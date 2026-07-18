import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useAudioCapture } from "./useAudioCapture";
import {
  STOMP_DESTINATIONS,
  buildAudioChunkPayload,
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
  micActive = true,
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
  // Theo dõi chunk đã gửi vs chunk BE đã ack (xử lý xong) — để đợi trước khi finalize
  const sentIndicesRef = useRef(new Set());
  const ackedIndicesRef = useRef(new Set());
  const ackSubscriptionRef = useRef(null);

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

        // Nhận ack "đã xử lý xong chunk" từ BE (subscribe TRƯỚC khi flush để không sót ack)
        ackSubscriptionRef.current = client.subscribe(
          STOMP_DESTINATIONS.chunkAck(roomId),
          (frame) => {
            try {
              const { chunkIndex } = JSON.parse(frame.body);
              if (chunkIndex != null) ackedIndicesRef.current.add(chunkIndex);
            } catch {}
          },
        );

        // Flush queue nếu có chunk đến trước khi connect xong
        const pending = pendingQueueRef.current.splice(0);
        pending.forEach((payload) => {
          try {
            client.publish({
              destination: STOMP_DESTINATIONS.sendAudio(roomId),
              body: JSON.stringify(payload),
            });
            sentIndicesRef.current.add(payload.chunkIndex);
          } catch {}
        });
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
      ackSubscriptionRef.current?.unsubscribe();
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
          console.log("[ASR] Sending chunk", payload.chunkIndex);
          client.publish({
            destination: STOMP_DESTINATIONS.sendAudio(roomId),
            body: JSON.stringify(payload),
          });
          sentIndicesRef.current.add(payload.chunkIndex);
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
    micActive,
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

  /**
   * Đợi BE ack (xử lý xong) hết các chunk đã gửi, hoặc tới timeout.
   * Gọi trước khi kết thúc họp/finalize để không bỏ sót chunk cuối còn đang dịch.
   * @returns {Promise<boolean>} true nếu mọi chunk đã ack, false nếu hết giờ.
   */
  const waitForPendingAcks = useCallback((timeoutMs = 8000) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const allAcked = () => {
        for (const idx of sentIndicesRef.current) {
          if (!ackedIndicesRef.current.has(idx)) return false;
        }
        return true;
      };
      if (allAcked()) {
        resolve(true);
        return;
      }
      const timer = setInterval(() => {
        if (allAcked() || Date.now() - start >= timeoutMs) {
          clearInterval(timer);
          resolve(allAcked());
        }
      }, 150);
    });
  }, []);

  return {
    transcriptSegments,
    isCapturing,
    isConnected,
    hasPermission,
    audioLevel,
    voiceActive,
    clearTranscript,
    getFullTranscript,
    waitForPendingAcks,
  };
};
