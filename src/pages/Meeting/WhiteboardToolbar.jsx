import { useState } from "react";
import {
  Pen,
  Highlighter,
  MoveUpRight,
  Square,
  Circle,
  Minus,
  Type,
  Eraser,
  Undo2,
  Trash2,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { TOOLS } from "./WhiteboardCanvas";

// ─── Preset colors ────────────────────────────────────────────────────────────

const COLORS = [
  "#f43f5e", // rose
  "#fb923c", // orange
  "#facc15", // yellow
  "#4ade80", // green
  "#38bdf8", // sky
  "#818cf8", // indigo
  "#e879f9", // fuchsia
  "#ffffff", // white
  "#94a3b8", // slate
  "#1e293b", // dark
];

const SIZES = [2, 4, 7, 12];

const TOOL_LIST = [
  { id: TOOLS.PEN, icon: Pen, label: "Bút vẽ" },
  { id: TOOLS.HIGHLIGHTER, icon: Highlighter, label: "Highlight" },
  { id: TOOLS.ARROW, icon: MoveUpRight, label: "Mũi tên" },
  { id: TOOLS.RECT, icon: Square, label: "Hình chữ nhật" },
  { id: TOOLS.ELLIPSE, icon: Circle, label: "Hình tròn" },
  { id: TOOLS.LINE, icon: Minus, label: "Đường thẳng" },
  { id: TOOLS.TEXT, icon: Type, label: "Văn bản" },
  { id: TOOLS.ERASER, icon: Eraser, label: "Tẩy" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToolBtn({ tool, active, onClick, title, children }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        border: active
          ? "1.5px solid rgba(255,255,255,0.55)"
          : "1.5px solid rgba(255,255,255,0.08)",
        background: active
          ? "rgba(255,255,255,0.15)"
          : "rgba(255,255,255,0.04)",
        color: active ? "white" : "rgba(255,255,255,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 22,
        background: "rgba(255,255,255,0.1)",
        margin: "0 2px",
        flexShrink: 0,
      }}
    />
  );
}

// ─── WhiteboardToolbar ────────────────────────────────────────────────────────

/**
 * Props:
 *   tool, onToolChange
 *   color, onColorChange
 *   size, onSizeChange
 *   opacity, onOpacityChange
 *   onUndo, onClear, onSave
 *   collapsed, onToggleCollapse
 */
export default function WhiteboardToolbar({
  tool,
  onToolChange,
  color,
  onColorChange,
  size,
  onSizeChange,
  opacity,
  onOpacityChange,
  onUndo,
  onClear,
  onSave,
  collapsed,
  onToggleCollapse,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (collapsed) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
        }}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(13,16,23,0.88)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            fontFamily: "inherit",
          }}
        >
          <Pen size={13} />
          Mở bảng vẽ
          <ChevronUp size={13} />
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {/* Color palette popup */}
      {showColorPicker && (
        <div
          style={{
            display: "flex",
            gap: 6,
            padding: "8px 10px",
            borderRadius: 14,
            background: "rgba(13,16,23,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            flexWrap: "wrap",
            maxWidth: 200,
            justifyContent: "center",
          }}
        >
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onColorChange(c);
                setShowColorPicker(false);
              }}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c,
                border:
                  color === c
                    ? "2px solid white"
                    : "2px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                transition: "transform 0.1s",
                transform: color === c ? "scale(1.2)" : "scale(1)",
                flexShrink: 0,
              }}
            />
          ))}
          {/* Custom color input */}
          <label
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background:
                "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",
              border: "2px solid rgba(255,255,255,0.2)",
              cursor: "pointer",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
          </label>
        </div>
      )}

      {/* Opacity slider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px",
          borderRadius: 12,
          background: "rgba(13,16,23,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 600,
          }}
        >
          ĐỘ MỜ
        </span>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round(opacity * 100)}
          onChange={(e) => onOpacityChange(Number(e.target.value) / 100)}
          style={{ width: 80, accentColor: color }}
        />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
            minWidth: 28,
            textAlign: "right",
          }}
        >
          {Math.round(opacity * 100)}%
        </span>
      </div>

      {/* Main toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          borderRadius: 16,
          background: "rgba(13,16,23,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        }}
      >
        {/* Tools */}
        {TOOL_LIST.map(({ id, icon: Icon, label }) => (
          <ToolBtn
            key={id}
            tool={id}
            active={tool === id}
            onClick={() => onToolChange(id)}
            title={label}
          >
            <Icon size={15} />
          </ToolBtn>
        ))}

        <Divider />

        {/* Color swatch */}
        <button
          type="button"
          title="Chọn màu"
          onClick={() => setShowColorPicker((v) => !v)}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: color,
            border: showColorPicker
              ? "2.5px solid white"
              : "2px solid rgba(255,255,255,0.25)",
            cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.1s",
          }}
        />

        <Divider />

        {/* Sizes */}
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            title={`Kích thước ${s}`}
            onClick={() => onSizeChange(s)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border:
                size === s
                  ? "1.5px solid rgba(255,255,255,0.5)"
                  : "1.5px solid rgba(255,255,255,0.06)",
              background:
                size === s
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.03)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: Math.min(s * 2.5, 18),
                height: Math.min(s * 2.5, 18),
                borderRadius: "50%",
                background: color,
              }}
            />
          </button>
        ))}

        <Divider />

        {/* Actions */}
        <ToolBtn title="Hoàn tác (Ctrl+Z)" onClick={onUndo}>
          <Undo2 size={15} />
        </ToolBtn>

        <ToolBtn title="Xóa tất cả" onClick={onClear}>
          <Trash2 size={15} />
        </ToolBtn>

        <ToolBtn title="Lưu ảnh" onClick={onSave}>
          <Download size={15} />
        </ToolBtn>

        <Divider />

        {/* Collapse */}
        <ToolBtn title="Thu gọn" onClick={onToggleCollapse}>
          <ChevronDown size={15} />
        </ToolBtn>
      </div>
    </div>
  );
}
