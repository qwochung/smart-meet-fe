import { useEffect, useMemo, useRef, useState } from "react";
import {Navigate, useLocation, useNavigate, useParams} from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { getStoredUser } from "../../utils/auth.js";
import api from "../../api";
import {
  MeetingChatPanel,
  MeetingControlBar,
  MeetingInviteModal,
  MeetingParticipantsPanel,
  MeetingRoomHeader,
  ParticipantTile,
} from "../../components/meeting";
import { LoadingPage } from "../System";
import {
  formatElapsedTime,
  getParticipantGridStyle,
  getRoomData,
  initialMessages,
  normalizeRoomParticipants,
} from "./meetingRoomUtils.js";

const WS_HOST = import.meta.env.VITE_WS_HOST;

export default function MeetingRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomCode } = useParams();

  const initialJoinSettings = location.state?.joinSettings;
  const [chatOpen, setChatOpen] = useState(true);
  const [micActive, setMicActive] = useState(
    initialJoinSettings?.micOn ?? true,
  );
  const [videoActive, setVideoActive] = useState(
    initialJoinSettings?.camOn ?? true,
  );
  const [mediaLoading, setMediaLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [elapsed, setElapsed] = useState(0);
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");

  const messagesEndRef = useRef(null);
  const localStreamRef = useRef(new MediaStream());
  const [localStreamVersion, setLocalStreamVersion] = useState(0);

  const [isHost, setIsHost] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const currentUser = getStoredUser();
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // Fetch room info and participants, determine if current user is host
  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;
    const fetchRoom = async () => {
      try {
        const roomData = await api.room.getRoomByCode(roomCode);
        if (cancelled) return;

        if (roomData?.hostUser?.id === currentUser?.id) {
          setIsHost(true);
          setRoomInfo(roomData);
          setRoomParticipants(
            normalizeRoomParticipants(roomData, currentUser?.id),
          );
        } else {
          setIsHost(false);
        }

      } catch (error) {
        console.error("Không lấy được thông tin phòng:", error);
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };

    fetchRoom();

    return () => {
      cancelled = true;
    };
  }, [roomCode, currentUser?.id]);

  //
  useEffect(() => {
    if (!roomCode || !isHost || !currentUser?.id || !WS_HOST) return;

    const stompClient = new Client({
      brokerURL: `${WS_HOST}/meet`,
      onConnect: () => {
        stompClient.subscribe(`/topic/room/${roomCode}/host-events`, (msg) => {
          try {
            const requestData = JSON.parse(msg.body || "{}");
            console.log("Host event:", requestData);
          } catch (error) {
            console.error("Parse host-events failed:", error);
          }
        });

        stompClient.publish({
          destination: `/app/room/${roomCode}/join`,
          body: JSON.stringify({
            userId: currentUser.id,
            role: isHost? "HOST" : "PARTICIPANT" }),
        });
      },
      onStompError: (error) => {
        console.error("WebSocket error:", error);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomCode, currentUser?.id]);

  // Access camera mic
  useEffect(() => {
    if (!currentUser || !isHost) return;
    const openInitialMedia = async () => {
      if (!micActive && !videoActive) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: micActive,
          video: videoActive,
        });

        localStreamRef.current = new MediaStream(stream.getTracks());
        setLocalStreamVersion((value) => value + 1);
      } catch (error) {
        console.error("Không thể mở media ban đầu:", error);
        setMicActive(false);
        setVideoActive(false);
      }
    };

    openInitialMedia();

    return () => {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = new MediaStream();
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const replaceTrack = (track) => {
    const stream = localStreamRef.current;
    const oldTracks = stream
      .getTracks()
      .filter((item) => item.kind === track.kind);
    oldTracks.forEach((item) => {
      stream.removeTrack(item);
      item.stop();
    });
    stream.addTrack(track);
    setLocalStreamVersion((value) => value + 1);
  };

  const removeTrackByKind = (kind) => {
    const stream = localStreamRef.current;
    const targets = stream.getTracks().filter((track) => track.kind === kind);
    targets.forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });
    setLocalStreamVersion((value) => value + 1);
  };

  const toggleMic = async () => {
    if (mediaLoading) return;

    setMediaLoading(true);
    try {
      if (micActive) {
        removeTrackByKind("audio");
        setMicActive(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioTrack = stream.getAudioTracks()[0];
        if (!audioTrack) return;

        replaceTrack(audioTrack);
        setMicActive(true);

        stream
          .getTracks()
          .filter((track) => track.id !== audioTrack.id)
          .forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Toggle mic failed:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const toggleVideo = async () => {
    if (mediaLoading) return;

    setMediaLoading(true);
    try {
      if (videoActive) {
        removeTrackByKind("video");
        setVideoActive(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) return;

        replaceTrack(videoTrack);
        setVideoActive(true);

        stream
          .getTracks()
          .filter((track) => track.id !== videoTrack.id)
          .forEach((track) => track.stop());
      }
    } catch (error) {
      console.error("Toggle camera failed:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: currentUser?.name || "Bạn",
        time,
        content: message.trim(),
        isSelf: true,
      },
    ]);
    setMessage("");
  };

  const roomTitle = roomInfo?.name || roomInfo?.title || `Phòng ${roomCode}`;
  const roomJoinLink = `${window.location.origin}/join?roomCode=${roomCode}`;

  const gridParticipants = useMemo(() => {
    const selfTile = {
      id: currentUser?.id || "self",
      name: `${currentUser?.name || "Bạn"}`,
      hasVideo: videoActive,
      isMuted: !micActive,
      self: true,
      active: micActive,
      stream: localStreamRef.current,
    };

    return [selfTile, ...roomParticipants];
  }, [
    currentUser?.id,
    currentUser?.name,
    roomParticipants,
    micActive,
    videoActive,
    localStreamVersion,
  ]);

  const participantCount = gridParticipants.length;
  const visibleParticipants = gridParticipants.filter((participant) => {
    const searchValue = participantQuery.trim().toLowerCase();
    if (!searchValue) return true;

    return String(participant.name || "")
      .toLowerCase()
      .includes(searchValue);
  });
  const contributorCount = visibleParticipants.length;

  const toggleChatPanel = () => {
    setChatOpen((isOpen) => {
      const nextOpen = !isOpen;
      if (nextOpen) setParticipantsOpen(false);
      return nextOpen;
    });
  };

  const toggleParticipantsPanel = () => {
    setParticipantsOpen((isOpen) => {
      const nextOpen = !isOpen;
      if (nextOpen) setChatOpen(false);
      return nextOpen;
    });
  };

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomJoinLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Copy room link failed:", error);
    }
  };

  const handleInvite = (email = inviteEmail) => {
    const inviteTarget = String(email || "").trim();
    if (!inviteTarget.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "Hệ thống",
        time,
        content: `Đã tạo lời mời cho ${inviteTarget}. Gửi link phòng: ${roomJoinLink}`,
        isSelf: false,
      },
    ]);

    setInviteEmail("");
    setIsInviteModalOpen(false);
  };

  const gridStyle = useMemo(
    () => getParticipantGridStyle(participantCount),
    [participantCount],
  );

  if (isChecking) {
    return (
      <LoadingPage
        title="Đang kiểm tra quyền vào phòng"
        description="Hệ thống đang xác minh vai trò của bạn trước khi vào cuộc gọi."
      />
    );
  }
  if (!isHost) {
    return <Navigate to={`/join?roomCode=${roomCode}`} replace />;
  }
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
        .chat-input:focus { outline: none; }
        .icon-btn:hover { background: rgba(255,255,255,0.12) !important; color: white !important; }
        .msg-container::-webkit-scrollbar { width: 4px; }
        .msg-container::-webkit-scrollbar-track { background: transparent; }
        .msg-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 28%), radial-gradient(circle at top right, rgba(14,165,233,0.08), transparent 20%), #0d1017",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          color: "white",
          overflow: "hidden",
        }}
      >
        <MeetingRoomHeader
          roomTitle={roomTitle}
          elapsedText={formatElapsedTime(elapsed)}
          chatOpen={chatOpen}
          participantsOpen={participantsOpen}
          participantCount={participantCount}
          onToggleChat={toggleChatPanel}
          onToggleParticipants={toggleParticipantsPanel}
        />

        <main
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            padding: 12,
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              ...gridStyle,
            }}
          >
            {gridParticipants.map((participant) => (
              <ParticipantTile key={participant.id} participant={participant} />
            ))}
          </div>

          {chatOpen && (
            <MeetingChatPanel
              messages={messages}
              message={message}
              onMessageChange={setMessage}
              onSendMessage={sendMessage}
              onClose={() => setChatOpen(false)}
              messagesEndRef={messagesEndRef}
            />
          )}

          {participantsOpen && (
            <MeetingParticipantsPanel
              participantQuery={participantQuery}
              onParticipantQueryChange={setParticipantQuery}
              visibleParticipants={visibleParticipants}
              contributorCount={contributorCount}
              onOpenInvite={() => setIsInviteModalOpen(true)}
              onClose={() => setParticipantsOpen(false)}
            />
          )}
        </main>

        <MeetingControlBar
          roomCode={roomCode}
          micActive={micActive}
          videoActive={videoActive}
          mediaLoading={mediaLoading}
          onToggleMic={toggleMic}
          onToggleVideo={toggleVideo}
          onToggleParticipants={toggleParticipantsPanel}
          onLeave={() => navigate(`/room/${roomCode}/summary`)}
        />
      </div>

      {isInviteModalOpen && (
        <MeetingInviteModal
          inviteEmail={inviteEmail}
          onInviteEmailChange={setInviteEmail}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={() => handleInvite()}
          roomJoinLink={roomJoinLink}
          onCopyRoomLink={copyRoomLink}
          copied={copied}
        />
      )}
    </>
  );
}
