import { useCallback, useRef, useState } from "react";
import { Pen, X } from "lucide-react";
import WhiteboardCanvas, { TOOLS } from "./WhiteboardCanvas";
import WhiteboardToolbar from "./WhiteboardToolbar";
import { useWhiteboardSync } from "./useWhiteboardSync";

/**
 * WhiteboardOverlay
 *
 * Lớp vẽ trong suốt đặt lên trên video màn hình chia sẻ.
 *
 * Props:
 *   roomCode    — mã phòng họp
 *   userId      — id người dùng hiện tại
 *   enabled     — có hiện overlay không (true khi đang share screen)
 *   width       — chiều rộng container (px), mặc định 1920
 *   height      — chiều cao container (px), mặc định 1080
 *
 * Cách dùng trong MeetingRoomPage:
 *
 *   <div style={{ position: "relative", width: "100%", height: "100%" }}>
 *     <ParticipantTile participant={screenShareParticipant} />
 *     <WhiteboardOverlay
 *       roomCode={roomCode}
 *       userId={currentUser?.id}
 *       enabled={true}
 *     />
 *   </div>
 */
export default function WhiteboardOverlay({
  roomCode,
  userId,
  enabled = true,
  width = 1920,
  height = 1080,
}) {
  const canvasRef = useRef(null);

  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState("#f43f5e");
  const [size, setSize] = useState(3);
  const [opacity, setOpacity] = useState(1);
  const [collapsed, setCollapsed] = useState(true); // mặc định ẩn toolbar
  const [active, setActive] = useState(true); // bật/tắt lớp vẽ

  // WebSocket sync
  const { publishDraw, publishClear } = useWhiteboardSync({
    roomCode,
    enabled: enabled && Boolean(roomCode),
    canvasRef,
    userId: String(userId),
  });

  const handleDraw = useCallback(
    (dataURL) => {
      publishDraw(dataURL);
    },
    [publishDraw],
  );

  const handleClear = useCallback(() => {
    canvasRef.current?.clear();
    publishClear();
  }, [publishClear]);

  const handleUndo = useCallback(() => {
    canvasRef.current?.undo();
    // Sau undo, sync trạng thái canvas mới
    setTimeout(() => {
      const url = canvasRef.current?.getDataURL();
      if (url) publishDraw(url);
    }, 50);
  }, [publishDraw]);

  const handleSave = useCallback(() => {
    const url = canvasRef.current?.getDataURL();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `whiteboard-${roomCode}-${Date.now()}.png`;
    a.click();
  }, [roomCode]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5,
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {/* Canvas layer */}
      <WhiteboardCanvas
        ref={canvasRef}
        tool={active ? tool : TOOLS.PEN}
        color={color}
        size={size}
        opacity={opacity}
        onDraw={handleDraw}
        width={width}
        height={height}
        style={{ pointerEvents: active ? "auto" : "none" }}
      />

      {/* Icon to show toolbar (top-left) */}
      {collapsed && active && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          title="Hiện bộ công cụ vẽ"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 31,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(244,63,94,0.2)",
            color: "#f43f5e",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            pointerEvents: "auto",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(244,63,94,0.3)";
            e.currentTarget.style.border = "1px solid rgba(244,63,94,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(244,63,94,0.2)";
            e.currentTarget.style.border = "1px solid rgba(255,255,255,0.2)";
          }}
        >
          <Pen size={20} />
        </button>
      )}

      {/* Toggle drawing on/off button (top-right) */}
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        title={
          active
            ? "Tắt bảng vẽ (cho phép tương tác với màn hình)"
            : "Bật bảng vẽ"
        }
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 31,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 10,
          border: active
            ? "1px solid rgba(244,63,94,0.5)"
            : "1px solid rgba(255,255,255,0.12)",
          background: active ? "rgba(244,63,94,0.15)" : "rgba(13,16,23,0.7)",
          color: active ? "#f43f5e" : "rgba(255,255,255,0.45)",
          fontSize: 11.5,
          fontWeight: 700,
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          fontFamily: "inherit",
          letterSpacing: "0.04em",
          pointerEvents: "auto",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: active ? "#f43f5e" : "rgba(255,255,255,0.25)",
          }}
        />
        {active ? "ĐANG VẼ" : "VẼ TẮT"}
      </button>

      {/* Toolbar */}
      <WhiteboardToolbar
        tool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
        size={size}
        onSizeChange={setSize}
        opacity={opacity}
        onOpacityChange={setOpacity}
        onUndo={handleUndo}
        onClear={handleClear}
        onSave={handleSave}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />
    </div>
  );
}
