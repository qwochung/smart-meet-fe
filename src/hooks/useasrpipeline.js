import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useAudioCapture } from "./useAudioCapture";
import {
  STOMP_DESTINATIONS,
  buildAudioChunkPayload,
  deduplicateOverlap,
} from "../services/asrService";
import { tokenStorage } from "../api/tokenStorage";
import apiConfig from "../configs/apiConfig";

/**
 * useASRPipeline
 *
 * Dùng lại STOMP client đã có trong dự án (cùng endpoint ws/meet).
 * - Gửi audio base64 → /app/ws/rooms/{roomId}/audio
 * - Nhận transcript  ← /topic/rooms/{roomId}/transcript
 *
 * Khớp hoàn toàn với AudioTranscriptionController.java và AudioChunkRequest.java
 */
export const useASRPipeline = ({
  enabled = false,
  participantId, // currentUser.id (string hoặc number)
  participantName, // currentUser.name
  roomId,
  onTranscriptUpdate,
  onError,
} = {}) => {
  const [transcriptSegments, setTranscriptSegments] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const lastTextRef = useRef("");
  // Queue chunks khi STOMP chưa connected
  const pendingQueueRef = useRef([]);

  // ─── Kết nối STOMP (dùng chung endpoint ws/meet của dự án) ────────────────
  useEffect(() => {
    if (!enabled || !roomId) return;

    const token = tokenStorage.getAccessToken();
    const brokerURL = `${apiConfig.wsURL}?token=${token}`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        setIsConnected(true);
        console.log("[ASR] STOMP connected");

        // Flush queue nếu có chunk đến trước khi connect xong
        const pending = pendingQueueRef.current.splice(0);
        pending.forEach((payload) => {
          try {
            client.publish({
              destination: STOMP_DESTINATIONS.sendAudio(roomId),
              body: JSON.stringify(payload),
            });
          } catch {}
        });

        // Subscribe nhận transcript
        subscriptionRef.current = client.subscribe(
          STOMP_DESTINATIONS.transcript(roomId),
          (frame) => {
            try {
              const data = JSON.parse(frame.body);
              // BE trả về: { roomId, participantId, participantName, chunkIndex, text }
              const rawText = data.text || "";
              const deduped = deduplicateOverlap(lastTextRef.current, rawText);

              if (deduped.trim()) {
                lastTextRef.current = deduped;
                const segment = {
                  chunkIndex: data.chunkIndex,
                  participantId: data.participantId,
                  participantName: data.participantName,
                  rawText: deduped,
                  isFinal: true,
                };
                setTranscriptSegments((prev) => {
                  const exists = prev.find(
                    (s) =>
                      s.chunkIndex === segment.chunkIndex &&
                      s.participantId === segment.participantId,
                  );
                  if (exists)
                    return prev.map((s) =>
                      s.chunkIndex === segment.chunkIndex &&
                      s.participantId === segment.participantId
                        ? { ...s, ...segment }
                        : s,
                    );
                  return [...prev, segment];
                });
                onTranscriptUpdate?.(segment);
              }
            } catch (err) {
              console.warn("[ASR] Transcript parse error:", err);
            }
          },
        );
      },

      onDisconnect: () => {
        setIsConnected(false);
        console.log("[ASR] STOMP disconnected");
      },

      onStompError: (frame) => {
        console.error("[ASR] STOMP error:", frame);
        onError?.({ type: "STOMP_ERROR", frame });
      },

      onWebSocketError: (err) => {
        console.error("[ASR] WS error:", err);
        onError?.({ type: "WS_ERROR", err });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Gửi chunk lên BE ──────────────────────────────────────────────────────
  const handleChunk = useCallback(
    (chunkData) => {
      const payload = buildAudioChunkPayload({
        roomId,
        participantId: String(chunkData.participantId || participantId),
        participantName: chunkData.participantName || participantName || "",
        chunkIndex: chunkData.chunkIndex,
        startTimeMs: chunkData.startTimeMs,
        endTimeMs: chunkData.endTimeMs,
        sampleRate: chunkData.sampleRate || 16000,
        channels: chunkData.channels || 1,
        audioDataBase64: chunkData.audioDataBase64,
        isForceCut: chunkData.isForceCut || false,
      });

      const client = stompClientRef.current;
      if (client?.connected) {
        try {
          client.publish({
            destination: STOMP_DESTINATIONS.sendAudio(roomId),
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.error("[ASR] Publish failed:", err);
          onError?.({ type: "PUBLISH_FAILED", err });
        }
      } else {
        // Chưa connect → queue lại
        pendingQueueRef.current.push(payload);
      }
    },
    [roomId, participantId, participantName, onError],
  );

  // ─── Audio capture ─────────────────────────────────────────────────────────
  const { isCapturing, hasPermission, audioLevel } = useAudioCapture({
    enabled,
    participantId: String(participantId || ""),
    participantName: participantName || "",
    roomId,
    onChunk: handleChunk,
    onVoiceActivityChange: setVoiceActive,
  });

  const clearTranscript = useCallback(() => {
    setTranscriptSegments([]);
    lastTextRef.current = "";
  }, []);

  const getFullTranscript = useCallback(
    () =>
      transcriptSegments
        .slice()
        .sort((a, b) => a.chunkIndex - b.chunkIndex)
        .map((s) => `[${s.participantName || s.participantId}]: ${s.rawText}`)
        .join("\n"),
    [transcriptSegments],
  );

  return {
    transcriptSegments,
    isCapturing,
    isConnected,
    hasPermission,
    audioLevel,
    voiceActive,
    clearTranscript,
    getFullTranscript,
  };
};
