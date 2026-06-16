const formatSpokenTime = (startTimeMs) => {
  if (!startTimeMs) return "";
  return new Date(startTimeMs).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function LiveTranscriptPanel({ segments = [], fullText = "", onClose }) {
  const orderedSegments = [...segments].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
  );
  const hasSegments = orderedSegments.length > 0;

  return (
    <aside
      style={{
        width: 320,
        minWidth: 280,
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(13,16,23,0.96)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Biên bản nháp</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            Cập nhật theo thời gian thực (bản chính thức sau khi kết thúc họp)
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="icon-btn"
            style={{
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ×
          </button>
        )}
      </div>

      <div
        className="msg-container"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          fontSize: 13,
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {hasSegments ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {orderedSegments.map((s) => (
              <div key={s.orderIndex}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#7aa2ff" }}>
                    {s.participantName || s.participantId}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}
                  >
                    {formatSpokenTime(s.startTimeMs)}
                  </span>
                </div>
                <div>{s.content || ""}</div>
              </div>
            ))}
          </div>
        ) : fullText.trim() ? (
          <div style={{ whiteSpace: "pre-wrap" }}>{fullText}</div>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.45)" }}>
            Chưa có nội dung. Bật ghi âm và bắt đầu nói để tạo biên bản.
          </span>
        )}
      </div>
    </aside>
  );
}
