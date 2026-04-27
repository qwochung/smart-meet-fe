import { ChevronUp, MoreVertical, Search, UserPlus, X, Check } from "lucide-react";

export default function MeetingParticipantsPanel({
                                                   participantQuery,
                                                   onParticipantQueryChange,
                                                   visibleParticipants,
                                                   contributorCount,
                                                   onOpenInvite,
                                                   onClose, pendingParticipants = [],
                                                   onAccept,
                                                   onReject
                                                 }) {
  return (
    <aside
      style={{
        width: 360,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 14,
        color: "#e5e7eb",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          padding: "4px 2px 2px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 20,
            lineHeight: 1.1,
            fontWeight: 600,
            color: "#f3f4f6",
          }}
        >
          Người tham gia
        </p>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            border: "none",
            background: "transparent",
            color: "#d1d5db",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>
      </div>

      <button
        onClick={onOpenInvite}
        style={{
          border: "none",
          borderRadius: 999,
          padding: "10px 16px",
          background: "#1d4ed8",
          color: "#ffffff",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <UserPlus size={16} />
        Thêm người
      </button>

      <p
        style={{
          margin: "14px 0 10px",
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.45,
        }}
      >
        Mời người khác bằng link phòng hoặc email.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <Search size={18} color="rgba(255,255,255,0.48)" />
        <input
          value={participantQuery}
          onChange={(event) => onParticipantQueryChange(event.target.value)}
          placeholder="Tìm kiếm người tham gia"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#f3f4f6",
            fontSize: 14,
            fontFamily: "inherit",
          }}
        />
      </div>

      {pendingParticipants.length > 0 && (
        <>
          <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.42)" }}>
            ĐANG CHỜ DUYỆT ({pendingParticipants.length})
          </div>
          <div style={{ marginTop: 10, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {pendingParticipants.map((user) => {
              const initials = String(user.name || "U").slice(0, 1).toUpperCase();
              return (
                <div key={user.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 600, flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f3f4f6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {user.name || "Người dùng ẩn danh"}
                    </div>
                    <div style={{ marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.56)" }}>
                      Đang yêu cầu tham gia...
                    </div>
                  </div>

                  {/* Nút thao tác: Từ chối & Chấp nhận */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onReject(user.id)} style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <X size={16} />
                    </button>
                    <button onClick={() => onAccept(user.id)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgb(59, 130, 246)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div
        style={{
          marginTop: 16,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.42)",
        }}
      >
        TRONG CUỘC HỌP
      </div>

      <div
        style={{
          marginTop: 10,
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          overflow: "hidden",
          background: "rgba(255,255,255,0.03)",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            color: "#f3f4f6",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          <span>Người tham gia</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 , padding: "0px 5px "}}>
            {contributorCount}
          </span>
          <button
            type="button"
            style={{
              width: 28,
              height: 28,
              border: "none",
              borderRadius: 999,
              background: "transparent",
              color: "rgba(255,255,255,0.78)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            <ChevronUp size={18} />
          </button>
        </div>

        <div
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {visibleParticipants.map((participant) => {
            const initials = String(participant.name || "U")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 1)
              .toUpperCase();

            return (
              <div
                key={participant.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: participant.self ? "#7c3aed" : "#334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#f3f4f6",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {participant.name || "Thành viên"}
                    {participant.self ? " (Bạn)" : ""}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.56)",
                    }}
                  >
                    {participant.self
                      ? "Chủ phòng"
                      : participant.isMuted
                        ? "Đã tắt mic"
                        : "Trong cuộc họp"}
                  </div>
                </div>

                <button
                  type="button"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    border: "none",
                    background: "rgba(132, 204, 255, 0.8)",
                    color: "#111827",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
