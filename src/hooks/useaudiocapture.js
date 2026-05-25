import { useCallback, useEffect, useRef, useState } from "react";

const SAMPLE_RATE = 16000;
const CHUNK_INTERVAL_MS = 5000;
const OVERLAP_MS = 1000;
const SILENCE_THRESHOLD = 0.055;
const SILENCE_DURATION_MS = 800;

// Float32 → Int16 PCM
const floatTo16BitPCM = (float32Array) => {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const c = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = c < 0 ? c * 32768 : c * 32767;
  }
  return int16;
};

// PCM Int16 → WAV Blob
const encodeWav = (pcmData, sampleRate) => {
  const buf = new ArrayBuffer(44 + pcmData.byteLength);
  const view = new DataView(buf);
  const w = (off, str) => {
    for (let i = 0; i < str.length; i++)
      view.setUint8(off + i, str.charCodeAt(i));
  };
  w(0, "RIFF");
  view.setUint32(4, 36 + pcmData.byteLength, true);
  w(8, "WAVE");
  w(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  w(36, "data");
  view.setUint32(40, pcmData.byteLength, true);
  new Uint8Array(buf, 44).set(new Uint8Array(pcmData.buffer));
  return new Blob([buf], { type: "audio/wav" });
};

// WAV Blob → Base64 string (BE cần base64)
const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const getRMS = (float32) => {
  let sum = 0;
  for (let i = 0; i < float32.length; i++) sum += float32[i] * float32[i];
  return Math.sqrt(sum / float32.length);
};

/**
 * State Machine cho VAD (Voice Activity Detection):
 * IDLE (Im lặng) -> SPEAKING (Đang nói) -> HOLDING (Chờ im lặng 800ms) -> IDLE
 */

export const useAudioCapture = ({
  enabled = false,
  participantId, // khớp AudioChunkRequest.participantId
  participantName, // khớp AudioChunkRequest.participantName
  roomId,
  onChunk, // callback({ base64, chunkIndex, startTimeMs, endTimeMs, sampleRate })
  onVoiceActivityChange,
} = {}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const processorRef = useRef(null);
  const sourceRef = useRef(null);

  // Cờ state machine: true khi đang có phiên ghi âm (SPEAKING hoặc HOLDING)
  // false khi đang ở trạng thái IDLE (im lặng)
  const isRecordingSessionRef = useRef(false);

  const pcmBufferRef = useRef([]); // Dữ liệu âm thanh đang thu (chỉ khi isRecordingSessionRef === true)
  const overlapBufferRef = useRef([]);
  const chunkIndexRef = useRef(0);
  const chunkTimerRef = useRef(null);
  const recordStartMsRef = useRef(0); // absolute ms timestamp khi bắt đầu chunk
  const silenceTimerRef = useRef(null); // đếm ngược 800ms chờ im lặng
  const isVoiceActiveRef = useRef(false); // theo dõi sự thay đổi nguồn gốc

  // Dừng thu âm: dọn dẹp mọi thứ
  const stopCapture = useCallback(() => {
    if (chunkTimerRef.current) {
      clearInterval(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioCtxRef.current?.close().catch(() => {});
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current =
      sourceRef.current =
      audioCtxRef.current =
      streamRef.current =
        null;
    pcmBufferRef.current = [];
    overlapBufferRef.current = [];
    chunkIndexRef.current = 0;
    setIsCapturing(false);
    setAudioLevel(0);
  }, []);

  /**
   * Flush một chunk âm thanh (gửi qua STOMP)
   * CHỈ được gọi khi đang có session ghi âm (isRecordingSessionRef === true)
   * và có dữ liệu trong buffer.
   */
  const flushChunk = useCallback(async () => {
    const buffer = pcmBufferRef.current;
    if (buffer.length === 0) return;

    const overlapSamples = Math.floor((OVERLAP_MS / 1000) * SAMPLE_RATE);
    const combined = [...overlapBufferRef.current, ...buffer];
    const float32 = new Float32Array(combined.length);
    combined.forEach((v, i) => {
      float32[i] = v;
    });

    const pcm16 = floatTo16BitPCM(float32);
    const wav = encodeWav(pcm16, SAMPLE_RATE);
    const base64 = await blobToBase64(wav);

    // startTimeMs / endTimeMs tính từ lúc chunk bắt đầu, tính ms tuyệt đối
    const startMs = recordStartMsRef.current;
    const endMs = Date.now();

    overlapBufferRef.current = buffer.slice(-overlapSamples);
    pcmBufferRef.current = [];
    recordStartMsRef.current = Date.now(); // reset cho chunk tiếp theo
    console.group(`🚀 [ASR AudioCapture] Gửi Chunk #${chunkIndexRef.current}`);

    onChunk?.({
      audioDataBase64: base64,
      chunkIndex: chunkIndexRef.current,
      startTimeMs: startMs,
      endTimeMs: endMs,
      sampleRate: SAMPLE_RATE,
      channels: 1,
      participantId,
      participantName,
      roomId,
    });

    chunkIndexRef.current += 1;
    console.groupEnd();
  }, [onChunk, participantId, participantName, roomId]);

  const startCapture = useCallback(async () => {
    if (!enabled || !participantId || !roomId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      setHasPermission(true);
      streamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: SAMPLE_RATE,
      });
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      recordStartMsRef.current = Date.now();

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const copy = new Float32Array(input.length);
        copy.set(input);


        // Tính RMS để phát hiện giọng nói
        const rms = getRMS(copy);
        setAudioLevel(rms);
// THÊM DÒNG NÀY ĐỂ ĐO ĐỘ ỒN PHÒNG CẬU (Xem xong thì xóa đi nhé)
//         console.log("Mức ồn hiện tại RMS:", rms.toFixed(4));
        const isVoice = rms > SILENCE_THRESHOLD;

        // VÁ LỖI MẤT TIẾNG: Phải nạp data liên tục nếu phiên ghi âm đang mở!
        if (isRecordingSessionRef.current) {
          pcmBufferRef.current.push(...copy);
        }

        // --- LOGIC STATE MACHINE ---
        if (!isRecordingSessionRef.current) {
          // TRẠNG THÁI IDLE: chưa có session
          if (isVoice) {
            isRecordingSessionRef.current = true;
            // Vừa mở session là phải push ngay khung hình đầu tiên này
            pcmBufferRef.current.push(...copy);

            // Hủy timer cũ nếu có
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
            isVoiceActiveRef.current = true;
            onVoiceActivityChange?.(true);
          }
        } else {
          // TRẠNG THÁI SPEAKING/HOLDING: đang có session
          if (isVoice) {
            // Vẫn đang nói -> Xóa timer đếm ngược 800ms (nếu có)
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = null;
            }
            isVoiceActiveRef.current = true;
            onVoiceActivityChange?.(true);
          } else {
            // Đang im lặng -> Bật đếm ngược
            // VÁ LỖI SPAM: CHỈ tạo timer mới nếu chưa có timer nào đang chạy!
            if (!silenceTimerRef.current) {
              silenceTimerRef.current = setTimeout(() => {
                // Hết 800ms -> Đóng cửa session
                isRecordingSessionRef.current = false;
                isVoiceActiveRef.current = false;
                onVoiceActivityChange?.(false);

                flushChunk();

                silenceTimerRef.current = null; // Đừng quên reset biến này!
              }, SILENCE_DURATION_MS);
            }
          }
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);

      // --- SỬA SLIDING WINDOW TIMER (setInterval 5s) ---
      // CHỈ gọi flushChunk() NẾU đang có session và có data
      chunkTimerRef.current = setInterval(() => {
        if (isRecordingSessionRef.current && pcmBufferRef.current.length > 0) {
          flushChunk();
        }
      }, CHUNK_INTERVAL_MS);

      setIsCapturing(true);
    } catch (err) {
      console.error("[AudioCapture] Failed:", err);
      setHasPermission(false);
    }
  }, [
    enabled,
    participantId,
    participantName,
    roomId,
    flushChunk,
    onVoiceActivityChange,
  ]);

  useEffect(() => {
    if (enabled) startCapture();
    else stopCapture();
    return stopCapture;
  }, [enabled, startCapture, stopCapture]);

  return { isCapturing, hasPermission, audioLevel, flushNow: flushChunk };
};