import { useEffect, useRef } from "react";
import { MicOff } from "lucide-react";

function SpeakerBars() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[9, 14, 7].map((h, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 3,
            height: h,
            borderRadius: 2,
            background: "#60a5fa",
            animation: `speakerWave ${0.8 + i * 0.15}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function ParticipantTile({ participant }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    
    // Use LiveKit track attach if available (most reliable)
    if (participant.videoTrack) {
      participant.videoTrack.attach(el);
      return () => {
        try { participant.videoTrack.detach(el); } catch {}
      };
    } 
    // Fallback to MediaStream if not a LiveKit track
    else if (participant.stream && participant.hasVideo) {
      el.srcObject = participant.stream;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [participant.stream, participant.videoTrack?.sid, participant.hasVideo]);

  const audioRef = useRef(null);
  useEffect(() => {
    const el = audioRef.current;
    if (!el || participant.self || !participant.audioTrack) return;
    
    participant.audioTrack.attach(el);
    return () => {
      try { participant.audioTrack.detach(el); } catch {}
    };
  }, [participant.audioTrack?.sid, participant.self]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 15,
        overflow: "hidden",
        background: "linear-gradient(180deg, #1b2030 0%, #121725 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: participant.active
          ? "0 0 0 1px rgba(59,130,246,0.85), 0 12px 30px rgba(59,130,246,0.12)"
          : "0 12px 32px rgba(0,0,0,0.18)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      {/* Attach remote audio track */}
      {!participant.self && (
        <audio ref={audioRef} autoPlay />
      )}

      {participant.hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted={Boolean(participant.self)}
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : participant.hasVideo && participant.avatar ? (
        <img
          src={participant.avatar}
          alt={participant.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            background: "#1c1f2e",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #34405f 0%, #23293d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {(participant.name || "U").slice(0, 1).toUpperCase()}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />

      {participant.isMuted && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MicOff size={13} color="#f87171" />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 9,
          left: 9,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0,0,0,0.52)",
          backdropFilter: "blur(8px)",
          padding: "4px 9px",
          borderRadius: 8,
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        {participant.active && <SpeakerBars />}
        <span style={{ fontSize: 10.5, fontWeight: 500, color: "white" }}>
          {participant.name}
        </span>
      </div>
    </div>
  );
}
