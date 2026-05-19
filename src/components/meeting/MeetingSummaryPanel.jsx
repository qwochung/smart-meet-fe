import { FileText, Sparkles, X } from "lucide-react";

export default function MeetingSummaryPanel({
  summaryItems = [],
  onClose,
}) {
  return (
    <aside
      style={{
        width: 340,
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
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              lineHeight: 1.1,
              fontWeight: 600,
              color: "#f3f4f6",
            }}
          >
            Tóm tắt tài liệu
          </p>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Nội dung đã được lưu từ bước upload trước đó.
          </p>
        </div>
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

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: "10px 12px",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(59,130,246,0.18)",
            color: "#93c5fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles size={18} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#f3f4f6" }}>
            {summaryItems.length} tài liệu đã tóm tắt
          </div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
            Xem nhanh nội dung chính trước khi vào thảo luận.
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
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
          <span>Tài liệu</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
            {summaryItems.length}
          </span>
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
          {summaryItems.length === 0 ? (
            <div
              style={{
                padding: "18px 14px",
                borderRadius: 14,
                border: "1px dashed rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                lineHeight: 1.55,
              }}
            >
              Chưa có tài liệu nào được tóm tắt từ bước upload trước đó.
            </div>
          ) : (
            summaryItems.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      background: "rgba(59,130,246,0.16)",
                      color: "#93c5fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#f9fafb",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                        fontSize: 11.5,
                        color: "rgba(255,255,255,0.48)",
                      }}
                    >
                      Tài liệu đã được xử lý trước cuộc họp
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: "rgba(255,255,255,0.78)",
                  }}
                >
                  {item.summary}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}