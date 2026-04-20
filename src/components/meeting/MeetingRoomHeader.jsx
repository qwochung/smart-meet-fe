import { Info, MessageSquare, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

function HeaderActionButton({ button }) {
  return (
    <button
      className="icon-btn"
      onClick={button.onClick}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        border: "none",
        background: button.active
          ? "rgba(59,130,246,0.2)"
          : "rgba(255,255,255,0.05)",
        color: button.active ? "#93c5fd" : "rgba(255,255,255,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.15s",
      }}
    >
      {button.icon}
      {button.badgeLabel ? (
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            minWidth: 18,
            height: 18,
            padding: "0 4px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            color: "#111827",
            border: "1.5px solid #0d1017",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {button.badgeLabel}
        </span>
      ) : button.badge ? (
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#3b82f6",
            border: "1.5px solid #0d1017",
          }}
        />
      ) : null}
    </button>
  );
}

export default function MeetingRoomHeader({
  roomTitle,
  elapsedText,
  chatOpen,
  participantsOpen,
  participantCount,
  onToggleChat,
  onToggleParticipants,
}) {
  const actionButtons = [
    {
      icon: <MessageSquare size={15} />,
      onClick: onToggleChat,
      badge: true,
      active: chatOpen,
    },
    {
      icon: <Users size={15} />,
      onClick: onToggleParticipants,
      badge: true,
      badgeLabel: participantCount,
      active: participantsOpen,
    },
    { icon: <Info size={15} /> },
    { icon: <Settings size={15} /> },
  ];

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 56,
        background: "rgba(255,255,255,0.025)",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
            }}
          >
            S
          </div>
        </Link>
        <div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.01em",
            }}
          >
            {roomTitle}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 2,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#ef4444",
                animation: "livePulse 1.5s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: 10.5,
                color: "rgba(255,255,255,0.38)",
                letterSpacing: "0.05em",
              }}
            >
              TRỰC TIẾP • {elapsedText}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {actionButtons.map((button, index) => (
          <HeaderActionButton key={index} button={button} />
        ))}
      </div>
    </header>
  );
}
