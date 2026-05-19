import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const TOOLS = {
  PEN: "pen",
  HIGHLIGHTER: "highlighter",
  ARROW: "arrow",
  RECT: "rect",
  ELLIPSE: "ellipse",
  LINE: "line",
  TEXT: "text",
  ERASER: "eraser",
};

const DEFAULT_COLOR = "#f43f5e";
const DEFAULT_SIZE = 3;
const ERASER_SIZE = 24;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getPos = (e, canvas) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return {
    x: (src.clientX - rect.left) * scaleX,
    y: (src.clientY - rect.top) * scaleY,
  };
};

const drawArrow = (ctx, x1, y1, x2, y2) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = Math.max(12, ctx.lineWidth * 4);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();
};

// ─── WhiteboardCanvas ────────────────────────────────────────────────────────

/**
 * WhiteboardCanvas
 *
 * ref methods:
 *   clear()            — xóa toàn bộ canvas
 *   undo()             — hoàn tác bước vẽ cuối
 *   getDataURL()       — xuất ảnh PNG base64
 *   loadDataURL(url)   — load ảnh vào canvas
 *
 * Props:
 *   tool, color, size   — từ toolbar
 *   opacity             — 0-1
 *   onDraw(dataURL)     — callback mỗi khi vẽ xong một nét (dùng để sync qua WebSocket)
 *   width, height       — kích thước canvas (px)
 *   className, style
 */
const WhiteboardCanvas = forwardRef(function WhiteboardCanvas(
  {
    tool = TOOLS.PEN,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    opacity = 1,
    onDraw,
    width = 1920,
    height = 1080,
    className = "",
    style = {},
  },
  ref,
) {
  const canvasRef = useRef(null);
  const historyRef = useRef([]); // stack của ImageData để undo
  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null); // snapshot trước khi vẽ shape (rect/ellipse/arrow)
  const textInput = useRef(null);
  const [textPos, setTextPos] = useState(null); // { x, y } khi dùng tool text

  // ── Context helpers ────────────────────────────────────────────────────────

  const getCtx = useCallback(() => canvasRef.current?.getContext("2d"), []);

  const applyStyle = useCallback(
    (ctx) => {
      ctx.globalAlpha = tool === TOOLS.HIGHLIGHTER ? 0.35 : opacity;
      ctx.strokeStyle = tool === TOOLS.ERASER ? "rgba(0,0,0,0)" : color;
      ctx.fillStyle = color;
      ctx.lineWidth = tool === TOOLS.ERASER ? ERASER_SIZE : size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalCompositeOperation =
        tool === TOOLS.ERASER ? "destination-out" : "source-over";
    },
    [tool, color, size, opacity],
  );

  // ── Expose ref API ─────────────────────────────────────────────────────────

  useImperativeHandle(
    ref,
    () => ({
      clear() {
        const ctx = getCtx();
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        historyRef.current = [];
      },
      undo() {
        const ctx = getCtx();
        if (!ctx || !historyRef.current.length) return;
        const prev = historyRef.current.pop();
        ctx.putImageData(prev, 0, 0);
      },
      getDataURL() {
        return canvasRef.current?.toDataURL("image/png");
      },
      loadDataURL(url) {
        const ctx = getCtx();
        if (!ctx || !url) return;
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = url;
      },
    }),
    [getCtx, width, height],
  );

  // ── Save to history ────────────────────────────────────────────────────────

  const saveHistory = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, width, height);
    historyRef.current.push(snap);
    if (historyRef.current.length > 50) historyRef.current.shift(); // giới hạn 50 bước
  }, [getCtx, width, height]);

  // ── Pointer events ─────────────────────────────────────────────────────────

  const handlePointerDown = useCallback(
    (e) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = getCtx();
      const pos = getPos(e, canvas);

      // Tool text: hiển thị input overlay
      if (tool === TOOLS.TEXT) {
        setTextPos(pos);
        return;
      }

      saveHistory();
      drawing.current = true;
      startPos.current = pos;

      // Snapshot canvas trước khi vẽ shape (để redraw khi drag)
      if ([TOOLS.RECT, TOOLS.ELLIPSE, TOOLS.ARROW, TOOLS.LINE].includes(tool)) {
        snapshotRef.current = ctx.getImageData(0, 0, width, height);
      }

      applyStyle(ctx);

      if (
        tool === TOOLS.PEN ||
        tool === TOOLS.HIGHLIGHTER ||
        tool === TOOLS.ERASER
      ) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    },
    [tool, getCtx, saveHistory, applyStyle, width, height],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!drawing.current) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = getCtx();
      const pos = getPos(e, canvas);

      applyStyle(ctx);

      switch (tool) {
        case TOOLS.PEN:
        case TOOLS.HIGHLIGHTER:
        case TOOLS.ERASER:
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          break;

        case TOOLS.RECT: {
          ctx.putImageData(snapshotRef.current, 0, 0);
          const w = pos.x - startPos.current.x;
          const h = pos.y - startPos.current.y;
          ctx.beginPath();
          ctx.strokeRect(startPos.current.x, startPos.current.y, w, h);
          break;
        }

        case TOOLS.ELLIPSE: {
          ctx.putImageData(snapshotRef.current, 0, 0);
          const rx = Math.abs(pos.x - startPos.current.x) / 2;
          const ry = Math.abs(pos.y - startPos.current.y) / 2;
          const cx = startPos.current.x + (pos.x - startPos.current.x) / 2;
          const cy = startPos.current.y + (pos.y - startPos.current.y) / 2;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case TOOLS.ARROW: {
          ctx.putImageData(snapshotRef.current, 0, 0);
          drawArrow(ctx, startPos.current.x, startPos.current.y, pos.x, pos.y);
          break;
        }

        case TOOLS.LINE: {
          ctx.putImageData(snapshotRef.current, 0, 0);
          ctx.beginPath();
          ctx.moveTo(startPos.current.x, startPos.current.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();
          break;
        }

        default:
          break;
      }
    },
    [tool, getCtx, applyStyle],
  );

  const handlePointerUp = useCallback(
    (e) => {
      if (!drawing.current) return;
      drawing.current = false;
      snapshotRef.current = null;

      // Notify parent (dùng để sync qua WebSocket)
      if (onDraw && canvasRef.current) {
        onDraw(canvasRef.current.toDataURL("image/png"));
      }
    },
    [onDraw],
  );

  // ── Text commit ────────────────────────────────────────────────────────────

  const commitText = useCallback(() => {
    if (!textPos || !textInput.current) return;
    const value = textInput.current.value.trim();
    if (value) {
      const ctx = getCtx();
      saveHistory();
      applyStyle(ctx);
      ctx.font = `${Math.max(size * 5, 16)}px 'DM Sans', system-ui, sans-serif`;
      ctx.globalAlpha = opacity;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillText(value, textPos.x, textPos.y);
      if (onDraw) onDraw(canvasRef.current.toDataURL("image/png"));
    }
    setTextPos(null);
  }, [textPos, getCtx, saveHistory, applyStyle, size, opacity, onDraw]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        const ctx = getCtx();
        if (!ctx || !historyRef.current.length) return;
        const prev = historyRef.current.pop();
        ctx.putImageData(prev, 0, 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [getCtx]);

  // ── Cursor style ───────────────────────────────────────────────────────────

  const cursorStyle = () => {
    if (tool === TOOLS.ERASER)
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${ERASER_SIZE}' height='${ERASER_SIZE}' viewBox='0 0 24 24'%3E%3Crect x='2' y='2' width='20' height='20' rx='3' fill='white' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E") ${ERASER_SIZE / 2} ${ERASER_SIZE / 2}, auto`;
    if (tool === TOOLS.TEXT) return "text";
    if (tool === TOOLS.PEN || tool === TOOLS.HIGHLIGHTER) return "crosshair";
    return "crosshair";
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          cursor: cursorStyle(),
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Text input overlay */}
      {textPos && (
        <input
          ref={textInput}
          autoFocus
          placeholder="Nhập văn bản..."
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitText();
            if (e.key === "Escape") setTextPos(null);
          }}
          style={{
            position: "absolute",
            left: `${(textPos.x / width) * 100}%`,
            top: `${(textPos.y / height) * 100}%`,
            transform: "translateY(-100%)",
            background: "rgba(0,0,0,0.75)",
            border: `2px solid ${color}`,
            borderRadius: 6,
            color,
            padding: "4px 8px",
            fontSize: Math.max(size * 5, 14),
            fontFamily: "inherit",
            outline: "none",
            minWidth: 120,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
});

export { TOOLS };
export default WhiteboardCanvas;
