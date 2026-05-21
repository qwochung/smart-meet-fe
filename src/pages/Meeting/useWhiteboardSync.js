import { useCallback, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { tokenStorage } from "../../api/tokenStorage";
import apiConfig from "../../configs/apiConfig";

/**
 * useWhiteboardSync
 *
 * Đồng bộ nét vẽ whiteboard giữa tất cả participant qua WebSocket STOMP.
 * Tất cả mọi người đều subscribe để nhận updates, và đều có thể publish.
 */
export function useWhiteboardSync({ roomCode, enabled, canvasRef, userId }) {
  const clientRef = useRef(null);
  const lastSentRef = useRef(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !roomCode) return;

    const token = tokenStorage.getAccessToken();
    const brokerURL = `${apiConfig.wsURL}?token=${token}`;

    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        isConnectedRef.current = true;
        console.log(`[Whiteboard] Connected, subscribing to room ${roomCode}`);

        // Tất cả participant đều subscribe để nhận nét vẽ từ người khác
        client.subscribe(`/topic/whiteboard/${roomCode}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body);

            // Bỏ qua tin nhắn của chính mình (đã vẽ rồi, không cần load lại)
            if (String(msg.senderId) === String(userId)) return;

            console.log(
              `[Whiteboard] Received ${msg.type} from ${msg.senderId}`,
            );

            if (msg.type === "DRAW" && msg.dataURL && canvasRef.current) {
              canvasRef.current.loadDataURL(msg.dataURL);
            }

            if (msg.type === "CLEAR" && canvasRef.current) {
              canvasRef.current.clear();
            }
          } catch (e) {
            console.warn("[Whiteboard] Parse error:", e);
          }
        });
      },

      onDisconnect: () => {
        isConnectedRef.current = false;
        console.log("[Whiteboard] Disconnected");
      },

      onWebSocketError: (e) => {
        isConnectedRef.current = false;
        console.warn("[Whiteboard] WS error:", e);
      },

      onStompError: (frame) => {
        console.warn("[Whiteboard] STOMP error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      isConnectedRef.current = false;
      client.deactivate();
      clientRef.current = null;
      lastSentRef.current = null;
    };
  }, [enabled, roomCode, userId, canvasRef]);

  const publishDraw = useCallback(
    (dataURL) => {
      const client = clientRef.current;
      if (!client?.connected) {
        console.warn("[Whiteboard] publishDraw: not connected");
        return;
      }
      // Tránh gửi lại nếu canvas không thay đổi
      if (dataURL === lastSentRef.current) return;
      lastSentRef.current = dataURL;

      client.publish({
        destination: `/app/whiteboard/${roomCode}`,
        body: JSON.stringify({
          type: "DRAW",
          senderId: String(userId),
          dataURL,
        }),
      });
    },
    [roomCode, userId],
  );

  const publishClear = useCallback(() => {
    const client = clientRef.current;
    if (!client?.connected) return;

    lastSentRef.current = null; // reset để lần vẽ tiếp theo được gửi

    client.publish({
      destination: `/app/whiteboard/${roomCode}`,
      body: JSON.stringify({
        type: "CLEAR",
        senderId: String(userId),
      }),
    });
  }, [roomCode, userId]);

  return { publishDraw, publishClear };
}
