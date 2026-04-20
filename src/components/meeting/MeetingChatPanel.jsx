import { Send, X, Zap } from "lucide-react";

function ChatMessage({ message }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: message.isSelf ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 3,
          padding: "0 4px",
        }}
      >
        {!message.isSelf && (
          <span style={{ fontSize: 10.5, fontWeight: 600, color: "#93c5fd" }}>
            {message.sender}
          </span>
        )}
        {message.isSelf && (
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Bạn
          </span>
        )}
        <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)" }}>
          {message.time}
        </span>
      </div>
      <div
        style={{
          maxWidth: "88%",
          padding: "7px 11px",
          borderRadius: 11,
          fontSize: 11.5,
          lineHeight: 1.5,
          ...(message.isSelf
            ? {
                background: "#3b82f6",
                color: "white",
                borderRadius: "10px 2px 10px 10px",
              }
            : {
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.82)",
                borderRadius: "2px 10px 10px 10px",
                border: "0.5px solid rgba(255,255,255,0.09)",
              }),
        }}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function MeetingChatPanel({
  messages,
  message,
  onMessageChange,
  onSendMessage,
  onClose,
  messagesEndRef,
}) {
  return (
    <aside
      style={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 14px",
          borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.88)",
          }}
        >
          Trò chuyện nhóm
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 9px",
              borderRadius: 999,
              border: "0.5px solid rgba(139,92,246,0.45)",
              background: "rgba(139,92,246,0.1)",
              color: "#a78bfa",
              fontSize: 10.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Zap size={10} />
            Tóm tắt AI
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.35)",
              display: "flex",
              padding: 1,
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div
        className="msg-container"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {messages.map((chatMessage) => (
          <ChatMessage key={chatMessage.id} message={chatMessage} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: "9px 10px 10px",
          borderTop: "0.5px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 20,
            padding: "6px 8px 6px 12px",
            border: "0.5px solid rgba(255,255,255,0.1)",
          }}
        >
          <input
            className="chat-input"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.85)",
              fontSize: 11.5,
              fontFamily: "inherit",
            }}
            placeholder="Nhắn cho cả nhóm..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendMessage()}
          />
          <button
            onClick={onSendMessage}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: message.trim() ? "#3b82f6" : "rgba(255,255,255,0.1)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.15s",
              flexShrink: 0,
            }}
          >
            <Send size={12} color="white" />
          </button>
        </div>
      </div>
    </aside>
  );
}
