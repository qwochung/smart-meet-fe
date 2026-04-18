import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  MessageSquare, Info, Settings, LayoutGrid, X, Mic, MicOff,
  Video, VideoOff, Disc, Hand, MonitorUp, Users, PhoneOff, Send,
  Sparkles, Zap
} from 'lucide-react';

const participants = [
  {
    id: 1, name: 'Alex Rivera', role: 'Người nói chính', isSpeaking: true,
    isMuted: false, hasVideo: true,
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400',
    active: true,
  },
  {
    id: 2, name: 'Sarah Chen', isSpeaking: false, isMuted: false, hasVideo: true,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 3, name: 'Jordan Smith', isSpeaking: false, isMuted: false, hasVideo: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
  },
  {
    id: 4, name: 'Bạn', isSpeaking: false, isMuted: true, hasVideo: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    self: true,
  },
  { id: 5, name: 'Marcus King', initials: 'MK', isSpeaking: false, isMuted: true, hasVideo: false },
  {
    id: 6, name: 'Elena Rodriguez', isSpeaking: false, isMuted: false, hasVideo: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
  },
];

const initialMessages = [
  { id: 1, sender: 'Alex Rivera', time: '10:42', content: 'Mình đã chia sẻ tài liệu thiết kế mới nhất trong kênh. Mọi người xem giúp nhé?', isSelf: false },
  { id: 2, sender: 'Bạn', time: '10:43', content: 'Cảm ơn Alex, mình đang xem đây. Điều hướng mượt hơn nhiều.', isSelf: true },
  { id: 3, sender: 'Sarah Chen', time: '10:44', content: 'Đồng ý. Chúng ta trao đổi về breakpoint mobile trong 5 phút nữa nhé.', isSelf: false },
];

function SpeakerBars() {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[9, 14, 7].map((h, i) => (
        <span key={i} style={{
          display: 'block', width: 3, height: h, borderRadius: 2,
          background: '#60a5fa',
          animation: `speakerWave ${0.8 + i * 0.15}s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </span>
  );
}

function ParticipantTile({ p }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 14, overflow: 'hidden',
      background: '#1c1f2e',
      boxShadow: p.active ? '0 0 0 2px #3b82f6, 0 0 0 4px rgba(59,130,246,0.15)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>
      {p.hasVideo ? (
        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#1c1f2e' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: '#2d3148',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
          }}>
            {p.initials}
          </div>
        </div>
      )}

      {/* gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 45%)',
        pointerEvents: 'none',
      }} />

      {/* mute badge */}
      {p.isMuted && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MicOff size={13} color="#f87171" />
        </div>
      )}

      {/* name tag */}
      <div style={{
        position: 'absolute', bottom: 10, left: 10,
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(8px)',
        padding: '4px 10px', borderRadius: 7,
        border: '0.5px solid rgba(255,255,255,0.1)',
      }}>
        {p.active && <SpeakerBars />}
        <span style={{ fontSize: 11, fontWeight: 500, color: 'white' }}>
          {p.name}
          {p.active && <span style={{ color: '#93c5fd', marginLeft: 5, fontSize: 10 }}>Đang nói</span>}
        </span>
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isSelf ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, padding: '0 4px' }}>
        {!msg.isSelf && <span style={{ fontSize: 11, fontWeight: 500, color: '#93c5fd' }}>{msg.sender}</span>}
        {msg.isSelf && <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}>Bạn</span>}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{msg.time}</span>
      </div>
      <div style={{
        maxWidth: '88%', padding: '8px 12px', borderRadius: 10,
        fontSize: 12, lineHeight: 1.55,
        ...(msg.isSelf
          ? { background: '#3b82f6', color: 'white', borderRadius: '10px 2px 10px 10px' }
          : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.82)', borderRadius: '2px 10px 10px 10px', border: '0.5px solid rgba(255,255,255,0.09)' }
        ),
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function ControlBtn({ onClick, active, danger, children, title }) {
  const base = {
    width: 46, height: 46, borderRadius: '50%', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'background 0.15s, transform 0.1s',
    position: 'relative',
  };
  const style = danger
    ? { ...base, background: '#dc2626', color: 'white' }
    : active
      ? { ...base, background: '#3b82f6', color: 'white' }
      : { ...base, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)' };

  return (
    <button style={style} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export default function MeetingRoomPage() {
  const { roomId } = useParams(); // TODO: Check room available
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [elapsed, setElapsed] = useState(45 * 60 + 12);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (s) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', time, content: message.trim(), isSelf: true }]);
    setMessage('');
  };

  return (
    <>
      <style>{`
        @keyframes speakerWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.35); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .ctrl-btn-ghost:hover { background: rgba(255,255,255,0.14) !important; color: white !important; }
        .ctrl-btn-active:hover { background: #2563eb !important; }
        .ctrl-btn-danger:hover { background: #ef4444 !important; }
        .chat-input:focus { outline: none; }
        .icon-btn:hover { background: rgba(255,255,255,0.12) !important; color: white !important; }
        .msg-container::-webkit-scrollbar { width: 4px; }
        .msg-container::-webkit-scrollbar-track { background: transparent; }
        .msg-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
      `}</style>

      <div style={{
        display: 'flex', flexDirection: 'column', height: '100vh',
        background: '#0d1017', fontFamily: "'DM Sans', system-ui, sans-serif",
        color: 'white', overflow: 'hidden',
      }}>

        {/* Top bar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 60,
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Link to="/">
              <div style={{
                width: 34, height: 34, borderRadius: 9, background: '#3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, color: 'white', textDecoration: 'none',
              }}>S</div>
            </Link>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.01em' }}>
                Đồng bộ dự án
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#ef4444',
                  animation: 'livePulse 1.5s ease-in-out infinite', display: 'inline-block',
                }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.05em' }}>
                  TRỰC TIẾP • {formatTime(elapsed)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              { icon: <MessageSquare size={16} />, onClick: () => setChatOpen(v => !v), badge: true, active: chatOpen },
              { icon: <Info size={16} /> },
              { icon: <Settings size={16} /> },
            ].map((btn, i) => (
              <button key={i} className="icon-btn" onClick={btn.onClick} style={{
                width: 36, height: 36, borderRadius: 9, border: 'none',
                background: btn.active ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                color: btn.active ? '#93c5fd' : 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative', transition: 'background 0.15s',
              }}>
                {btn.icon}
                {btn.badge && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6, width: 6, height: 6,
                    borderRadius: '50%', background: '#3b82f6', border: '1.5px solid #0d1017',
                  }} />
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Main */}
        <main style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: 14, gap: 12 }}>

          {/* Video grid */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(2, 1fr)',
            gap: 10,
          }}>
            {participants.map(p => (
              <ParticipantTile key={p.id} p={p} />
            ))}
          </div>

          {/* Chat sidebar */}
          {chatOpen && (
            <aside style={{
              width: 300, display: 'flex', flexDirection: 'column',
              background: '#13161f',
              borderRadius: 14,
              border: '0.5px solid rgba(255,255,255,0.07)',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '13px 16px',
                borderBottom: '0.5px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>
                  Trò chuyện nhóm
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20,
                    border: '0.5px solid rgba(139,92,246,0.45)',
                    background: 'rgba(139,92,246,0.1)',
                    color: '#a78bfa', fontSize: 11, fontWeight: 500, cursor: 'pointer',
                  }}>
                    <Zap size={11} />
                    Tóm tắt AI
                  </button>
                  <button onClick={() => setChatOpen(false)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.35)', display: 'flex', padding: 2,
                  }}>
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="msg-container" style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '10px 12px', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 22, padding: '7px 8px 7px 14px',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                }}>
                  <input
                    className="chat-input"
                    style={{
                      flex: 1, background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.85)', fontSize: 12,
                      fontFamily: 'inherit',
                    }}
                    placeholder="Nhắn cho cả nhóm…"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: message.trim() ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'background 0.15s', flexShrink: 0,
                  }}>
                    <Send size={13} color="white" />
                  </button>
                </div>
              </div>
            </aside>
          )}
        </main>

        {/* Controls */}
        <footer style={{
          height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {roomId}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Mic */}
            <ControlBtn active={micActive} onClick={() => setMicActive(v => !v)} title={micActive ? 'Tắt mic' : 'Bật mic'}>
              {micActive ? <Mic size={17} /> : <MicOff size={17} color="#f87171" />}
            </ControlBtn>

            {/* Camera */}
            <ControlBtn active={videoActive} onClick={() => setVideoActive(v => !v)} title={videoActive ? 'Tắt video' : 'Bật video'}>
              {videoActive ? <Video size={17} /> : <VideoOff size={17} />}
            </ControlBtn>

            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />

            {/* Record */}
            <ControlBtn title="Ghi hình">
              <span style={{ position: 'relative', display: 'flex' }}>
                <Disc size={17} />
                <span style={{
                  position: 'absolute', top: -1, right: -1, width: 6, height: 6,
                  borderRadius: '50%', background: '#ef4444', border: '1.5px solid #0d1017',
                }} />
              </span>
            </ControlBtn>

            {/* Hand */}
            <ControlBtn title="Giơ tay"><Hand size={17} /></ControlBtn>

            {/* Share screen */}
            <ControlBtn title="Chia sẻ màn hình"><MonitorUp size={17} /></ControlBtn>

            {/* Participants */}
            <ControlBtn title="Người tham gia"><Users size={17} /></ControlBtn>

            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />

            {/* Leave */}
            <button onClick={() => navigate(`/room/${roomId}/summary`)} style={{
              height: 46, borderRadius: 23, border: 'none',
              background: '#dc2626', color: 'white',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 22px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}>
              <PhoneOff size={16} />
              Rời phòng
            </button>
          </div>

          {/* Layout */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            border: '0.5px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <LayoutGrid size={14} />
            Bố cục
          </button>
        </footer>
      </div>
    </>
  );
}