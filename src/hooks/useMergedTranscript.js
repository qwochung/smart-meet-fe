import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { STOMP_DESTINATIONS } from "../services/asrService";
import { transcriptService } from "../services/transcriptService";
import { tokenStorage } from "../api/tokenStorage";
import apiConfig from "../configs/apiConfig";

// Server sort lại và đánh số orderIndex cho TOÀN BỘ segment mỗi lần append,
// nhưng chỉ push 1 segment qua WS — nên không thể dùng orderIndex làm khóa định danh.
// Dùng sourceChunkId (ổn định theo chunk) để upsert, rồi sort theo thời gian.
const segmentKey = (s) =>
  s?.sourceChunkId != null ? `chunk:${s.sourceChunkId}` : `idx:${s?.orderIndex}`;

const sortSegments = (segments) =>
  [...segments].sort((a, b) => {
    const at = a.startTimeMs ?? Number.MAX_SAFE_INTEGER;
    const bt = b.startTimeMs ?? Number.MAX_SAFE_INTEGER;
    if (at !== bt) return at - bt;
    return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
  });

const applySegmentUpdate = (segments, incoming) => {
  if (!incoming) return segments;

  const key = segmentKey(incoming);
  const exists = segments.some((s) => segmentKey(s) === key);
  const next = exists
    ? segments.map((s) => (segmentKey(s) === key ? { ...s, ...incoming } : s))
    : [...segments, incoming];

  return sortSegments(next);
};

export const useMergedTranscript = ({ enabled = false, roomId } = {}) => {
  const [segments, setSegments] = useState([]);
  const [fullText, setFullText] = useState("");
  const [version, setVersion] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  const hydrate = useCallback(async () => {
    if (!roomId) return;
    try {
      const data = await transcriptService.getDraftTranscript(roomId);
      setSegments(Array.isArray(data?.segments) ? data.segments : []);
      setFullText(data?.fullText || "");
      setVersion(data?.version || 0);
    } catch (err) {
      console.warn("[MergedTranscript] hydrate failed:", err);
    }
  }, [roomId]);

  useEffect(() => {
    if (!enabled || !roomId) return;

    hydrate();

    const token = tokenStorage.getAccessToken();
    const brokerURL = `${apiConfig.wsURL}?token=${token}`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        setIsConnected(true);
        subscriptionRef.current = client.subscribe(
          STOMP_DESTINATIONS.draftTranscript(roomId),
          (frame) => {
            try {
              const data = JSON.parse(frame.body);
              const incoming = data.segment;

              if (incoming) {
                setSegments((prev) => applySegmentUpdate(prev, incoming));
              }
              if (typeof data.version === "number") {
                setVersion(data.version);
              }
              if (data.fullText) {
                setFullText(data.fullText);
              }
            } catch (err) {
              console.warn("[MergedTranscript] parse error:", err);
            }
          },
        );
      },

      onDisconnect: () => setIsConnected(false),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, roomId, hydrate]);

  const getFormattedTranscript = useCallback(
    () =>
      segments
        .map(
          (s) =>
            `[${s.participantName || s.participantId}]: ${s.content || ""}`,
        )
        .join("\n"),
    [segments],
  );

  return {
    mergedSegments: segments,
    mergedFullText: fullText || getFormattedTranscript(),
    mergedVersion: version,
    isMergedConnected: isConnected,
    refreshMergedTranscript: hydrate,
    getFormattedTranscript,
  };
};
