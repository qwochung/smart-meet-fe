import { Check, Copy, X } from "lucide-react";

export default function MeetingInviteModal({
  inviteEmail,
  onInviteEmailChange,
  onClose,
  onInvite,
  roomJoinLink,
  onCopyRoomLink,
  copied,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 40,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "#171b26",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          padding: 18,
          color: "#e5e7eb",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              color: "#f3f4f6",
            }}
          >
            Mời người tham gia
          </p>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <p
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Nhập email để gửi lời mời
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={inviteEmail}
            onChange={(event) => onInviteEmailChange(event.target.value)}
            placeholder="name@example.com"
            onKeyDown={(event) => {
              if (event.key === "Enter") onInvite();
            }}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "#f9fafb",
              padding: "0 12px",
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={onInvite}
            disabled={!inviteEmail.trim()}
            style={{
              height: 42,
              borderRadius: 12,
              border: "none",
              background: inviteEmail.trim() ? "#0b72b5" : "#334155",
              color: "white",
              padding: "0 16px",
              fontSize: 14,
              fontWeight: 600,
              cursor: inviteEmail.trim() ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            Mời
          </button>
        </div>

        <p
          style={{
            margin: "4px 0 8px",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Hoặc chia sẻ liên kết phòng
        </p>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <input
            value={roomJoinLink}
            readOnly
            style={{
              flex: 1,
              height: 34,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.9)",
              padding: "0 8px",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={onCopyRoomLink}
            style={{
              height: 34,
              borderRadius: 10,
              border: "none",
              padding: "0 12px",
              background: copied ? "#16a34a" : "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Đã copy" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
