import {useCallback, useEffect, useRef, useState} from "react";
import {MicVAD, utils} from "@ricky0123/vad-web";

const SAMPLE_RATE = 16000;
const FORCE_CUT_MS = 15000;
const OVERLAP_MS = 500;
const PRE_SPEECH_PAD_MS = 300;

const getAudioConstraints = () => ({
  sampleRate: SAMPLE_RATE,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
});

export const useAudioCapture = ({
                                  enabled = false,
                                  participantId,
                                  participantName,
                                  roomId,
                                  onChunk,
                                  onVoiceActivityChange,
                                } = {}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const micVADRef = useRef(null);
  const isRecordingRef = useRef(false);
  const chunkIndexRef = useRef(0);
  const recordStartMsRef = useRef(0);
  const forceCutTimerRef = useRef(null);
  const forceCutRef = useRef(false);
  const overlapBufferRef = useRef([]);

  const onChunkRef = useRef(onChunk);
  onChunkRef.current = onChunk;
  const onVoiceActivityChangeRef = useRef(onVoiceActivityChange);
  onVoiceActivityChangeRef.current = onVoiceActivityChange;

  const flushChunk = useCallback(
    async (audioData, isForceCut) => {
      if (audioData.length === 0) return;

      const overlapSamples = Math.floor((OVERLAP_MS / 1000) * SAMPLE_RATE);
      const overlap = overlapBufferRef.current;
      const combined =
        overlap.length > 0
          ? new Float32Array([...overlap, ...audioData])
          : audioData;

      const wavArrayBuffer = utils.encodeWAV(combined, 1, SAMPLE_RATE, 1, 16);
      const base64 = utils.arrayBufferToBase64(wavArrayBuffer);

      const startMs = recordStartMsRef.current;
      const endMs = Date.now();

      const keepSamples = Math.min(overlapSamples, audioData.length);
      overlapBufferRef.current = audioData.slice(-keepSamples);

      onChunkRef.current?.({
        audioDataBase64: base64,
        chunkIndex: chunkIndexRef.current,
        startTimeMs: startMs,
        endTimeMs: endMs,
        sampleRate: SAMPLE_RATE,
        channels: 1,
        participantId,
        participantName,
        roomId,
        isForceCut,
      });

      chunkIndexRef.current += 1;
      recordStartMsRef.current = Date.now();
    },
    [participantId, participantName, roomId],
  );

  const flushChunkRef = useRef(flushChunk);
  flushChunkRef.current = flushChunk;

  const handleForceCut = useCallback(async () => {
    const vad = micVADRef.current;
    if (!vad) return;
    forceCutRef.current = true;
    await vad.pause();
    await vad.start();
  }, []);

  const handleForceCutRef = useRef(handleForceCut);
  handleForceCutRef.current = handleForceCut;

  useEffect(() => {
    const onSpeechStartCb = () => {
      console.log("🎤 Speech Start");
      const timestamp = Date.now() - PRE_SPEECH_PAD_MS;
      recordStartMsRef.current =
        recordStartMsRef.current === 0 ? timestamp : recordStartMsRef.current;
      isRecordingRef.current = true;

      forceCutTimerRef.current = setTimeout(() => {
        handleForceCutRef.current();
      }, FORCE_CUT_MS);

      onVoiceActivityChangeRef.current?.(true);
    };

    const onSpeechEndCb = (audio) => {
      console.log("🎤 Speech End");
      if (forceCutTimerRef.current) {
        clearTimeout(forceCutTimerRef.current);
        forceCutTimerRef.current = null;
      }

      isRecordingRef.current =  false;

      const isForceCut = forceCutRef.current;
      forceCutRef.current = false;

      flushChunkRef.current(audio, isForceCut);

      onVoiceActivityChangeRef.current?.(false);
    };

    const onFrameProcessedCb = (probs) => {
      setAudioLevel(probs.isSpeech ? 1 : 0);
    };

    const startCapture = async () => {
      console.log("[AudioCapture] startCapture called", {enabled, participantId, roomId,});

      if (!enabled || !participantId || !roomId){
        console.warn("[AudioCapture] skipped", {enabled, participantId, roomId,});
        return
      }

      try {
        const vad = await MicVAD.new({
          model: "legacy",

          baseAssetPath: "/",
          onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/",

          onSpeechStart: onSpeechStartCb,
          onSpeechEnd: onSpeechEndCb,
          onFrameProcessed: onFrameProcessedCb,
          onVADMisfire: () => {
          },

          submitUserSpeechOnPause: true,
          redemptionMs: 600,
          preSpeechPadMs: PRE_SPEECH_PAD_MS,
          minSpeechMs: 200,
          positiveSpeechThreshold: 0.7,
          negativeSpeechThreshold: 0.3,

          getStream: () =>
            navigator.mediaDevices.getUserMedia({
              audio: getAudioConstraints(),
            }),
        });
        setHasPermission(true);
        micVADRef.current = vad;
        vad.start();
        setIsCapturing(true);
      } catch (err) {
        console.error("[AudioCapture] Failed:", err);
        setHasPermission(false);
      }
    };

    const stopCapture = async () => {
      if (forceCutTimerRef.current) {
        clearTimeout(forceCutTimerRef.current);
        forceCutTimerRef.current = null;
      }
      overlapBufferRef.current = [];
      chunkIndexRef.current = 0;
      recordStartMsRef.current = 0;
      isRecordingRef.current = false;
      forceCutRef.current = false;

      if (micVADRef.current) {
        try {
          await micVADRef.current.destroy();
        } catch {
        }
        micVADRef.current = null;
      }
      setIsCapturing(false);
      setAudioLevel(0);
    };

    if (enabled) startCapture();
    else stopCapture();
    return () => {
      stopCapture();
    };
  }, [enabled, participantId, roomId]);

  return {isCapturing, hasPermission, audioLevel};
};
