import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { STOMP_DESTINATIONS } from "../services/asrService";
import { transcriptService } from "../services/transcriptService";
import { tokenStorage } from "../api/tokenStorage";
import apiConfig from "../configs/apiConfig";

const applySegmentUpdate = (segments, incoming, type) => {
  if (!incoming) return segments;

  if (type === "SEGMENT_UPDATE") {
    const exists = segments.some((s) => s.orderIndex === incoming.orderIndex);
    if (exists) {
      return segments.map((s) =>
        s.orderIndex === incoming.orderIndex ? { ...s, ...incoming } : s,
      );
    }
  }

  const duplicate = segments.some((s) => s.orderIndex === incoming.orderIndex);
  if (duplicate) {
    return segments.map((s) =>
      s.orderIndex === incoming.orderIndex ? { ...s, ...incoming } : s,
    );
  }
  return [...segments, incoming].sort((a, b) => a.orderIndex - b.orderIndex);
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
              const type = data.type || "SEGMENT_APPEND";

              if (incoming) {
                setSegments((prev) => applySegmentUpdate(prev, incoming, type));
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
