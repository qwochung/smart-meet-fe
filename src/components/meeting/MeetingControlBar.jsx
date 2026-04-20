import {
  Disc,
  Hand,
  LayoutGrid,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

function ControlButton({ onClick, active, children, title, disabled }) {
  const base = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background 0.15s, transform 0.1s",
    position: "relative",
    opacity: disabled ? 0.55 : 1,
  };

  const style = active
    ? { ...base, background: "#3b82f6", color: "white" }
    : {
        ...base,
        background: "rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.65)",
      };

  return (
    <button style={style} onClick={onClick} title={title} disabled={disabled}>
      {children}
    </button>
  );
}

export default function MeetingControlBar({
  roomCode,
  micActive,
  videoActive,
  mediaLoading,
  onToggleMic,
  onToggleVideo,
  onToggleParticipants,
  onLeave,
}) {
  return (
    <footer
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <span
        style={{
          fontSize: 10.5,
          color: "rgba(255,255,255,0.22)",
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}
      >
        {roomCode}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <ControlButton
          active={micActive}
          onClick={onToggleMic}
          title={micActive ? "Tắt mic" : "Bật mic"}
          disabled={mediaLoading}
        >
          {micActive ? <Mic size={16} /> : <MicOff size={16} color="#f87171" />}
        </ControlButton>

        <ControlButton
          active={videoActive}
          onClick={onToggleVideo}
          title={videoActive ? "Tắt video" : "Bật video"}
          disabled={mediaLoading}
        >
          {videoActive ? <Video size={16} /> : <VideoOff size={16} />}
        </ControlButton>

        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(255,255,255,0.1)",
            margin: "0 2px",
          }}
        />

        <ControlButton title="Ghi hình" disabled>
          <span style={{ position: "relative", display: "flex" }}>
            <Disc size={16} />
            <span
              style={{
                position: "absolute",
                top: -1,
                right: -1,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#ef4444",
                border: "1.5px solid #0d1017",
              }}
            />
          </span>
        </ControlButton>

        <ControlButton title="Giơ tay" disabled>
          <Hand size={16} />
        </ControlButton>

        <ControlButton title="Chia sẻ màn hình" disabled>
          <MonitorUp size={16} />
        </ControlButton>

        <ControlButton title="Người tham gia" onClick={onToggleParticipants}>
          <Users size={16} />
        </ControlButton>

        <div
          style={{
            width: 1,
            height: 24,
            background: "rgba(255,255,255,0.1)",
            margin: "0 2px",
          }}
        />

        <button
          onClick={onLeave}
          style={{
            height: 42,
            borderRadius: 21,
            border: "none",
            background: "#dc2626",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 18px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.15s",
            fontFamily: "inherit",
          }}
        >
          <PhoneOff size={16} />
          Rời phòng
        </button>
      </div>

      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 10,
          border: "0.5px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.5)",
          fontSize: 11.5,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <LayoutGrid size={13} />
        Bố cục
      </button>
    </footer>
  );
}
