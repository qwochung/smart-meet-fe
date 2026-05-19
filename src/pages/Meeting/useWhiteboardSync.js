import { useCallback, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { tokenStorage } from "../../api/tokenStorage";
import apiConfig from "../../configs/apiConfig";

/**
 * useWhiteboardSync
 *
 * Đồng bộ nét vẽ whiteboard giữa các participant qua WebSocket STOMP.
 *
 * Hoạt động:
 *  - Khi user vẽ xong 1 nét → gửi diff (chỉ nét mới) lên /app/whiteboard/{roomCode}
 *  - Khi nhận tin nhắn từ /topic/whiteboard/{roomCode} → áp lên canvas qua ref
 *
 * @param {string}   roomCode
 * @param {boolean}  enabled
 * @param {React.RefObject} canvasRef  — ref của WhiteboardCanvas
 * @param {string}   userId           — để lọc bỏ tin nhắn của chính mình
 */
export function useWhiteboardSync({ roomCode, enabled, canvasRef, userId }) {
  const clientRef = useRef(null);
  const lastSentRef = useRef(null); // tránh gửi lại ảnh giống nhau

  // ── Connect STOMP ────────────────────────────────────────────────────────

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
        // Subscribe nhận nét vẽ từ các participant khác
        client.subscribe(`/topic/whiteboard/${roomCode}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body);

            // Bỏ qua tin nhắn của chính mình
            if (msg.senderId === userId) return;

            if (msg.type === "DRAW" && msg.dataURL && canvasRef.current) {
              canvasRef.current.loadDataURL(msg.dataURL);
            }

            if (msg.type === "CLEAR" && canvasRef.current) {
              canvasRef.current.clear();
            }
          } catch (e) {
            console.warn("Whiteboard WS parse error:", e);
          }
        });
      },

      onWebSocketError: (e) => console.warn("Whiteboard WS error:", e),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [enabled, roomCode, userId, canvasRef]);

  // ── Publish draw ─────────────────────────────────────────────────────────

  const publishDraw = useCallback(
    (dataURL) => {
      if (!clientRef.current?.connected) return;
      if (dataURL === lastSentRef.current) return; // không gửi lại nếu không đổi
      lastSentRef.current = dataURL;

      clientRef.current.publish({
        destination: `/app/whiteboard/${roomCode}`,
        body: JSON.stringify({
          type: "DRAW",
          senderId: userId,
          dataURL,
        }),
      });
    },
    [roomCode, userId],
  );

  // ── Publish clear ─────────────────────────────────────────────────────────

  const publishClear = useCallback(() => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/whiteboard/${roomCode}`,
      body: JSON.stringify({ type: "CLEAR", senderId: userId }),
    });
  }, [roomCode, userId]);

  return { publishDraw, publishClear };
}
