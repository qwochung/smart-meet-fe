import { useCallback, useRef, useState } from "react";
import { Pen } from "lucide-react";
import WhiteboardCanvas, { TOOLS } from "./WhiteboardCanvas";
import WhiteboardToolbar from "./WhiteboardToolbar";
import { useWhiteboardSync } from "./useWhiteboardSync";

export default function WhiteboardOverlay({
  roomCode,
  userId,
  enabled = true,
  isScreenSharer = false,
  active = false,
  width = 1920,
  height = 1080,
}) {
  const canvasRef = useRef(null);

  const [tool, setTool] = useState(TOOLS.PEN);
  const [color, setColor] = useState("#f43f5e");
  const [size, setSize] = useState(3);
  const [opacity, setOpacity] = useState(1);
  const [collapsed, setCollapsed] = useState(true);

  // active state is now controlled by props

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

  // QUAN TRỌNG: Tất cả children đều dùng position: absolute
  // => parent PHẢI có position: relative
  // => Xem MeetingRoomPage: wrapper div của screen share cần position: relative
  return (
    <>
      {/* Canvas luôn render — nhận WebSocket updates kể cả khi không active */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          pointerEvents: active ? "auto" : "none",
        }}
      >
        <WhiteboardCanvas
          ref={canvasRef}
          tool={tool}
          color={color}
          size={size}
          opacity={opacity}
          onDraw={handleDraw}
          width={width}
          height={height}
          style={{ pointerEvents: active ? "auto" : "none" }}
        />
      </div>

      {active && collapsed && (
        <button
          type="button"
          onClick={() => setCollapsed(false)}
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
          }}
        >
          <Pen size={20} />
        </button>
      )}

      {active && (
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
          isScreenSharer={isScreenSharer}
        />
      )}
    </>
  );
}
