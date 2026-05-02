import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
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
import { useLiveKitRoom } from "../../hooks/useLiveKitRoom.js";
import { useWebSocket } from "../../hooks/useWebSocket.js";
import { LoadingPage } from "../System";
import {
  createInitialMessages,
  formatElapsedTime,
  getParticipantGridStyle,
  getRoomData,
  normalizeRoomParticipants,
} from "./meetingRoomUtils.js";
import { roomSessionStorage } from "../../services/roomService.js";

export default function MeetingRoomPage() {
  const currentUser = getStoredUser();
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const { roomCode } = useParams();
  const persistedSession = useMemo(
    () => roomSessionStorage.get(roomCode),
    [roomCode],
  );
  const activeSession = location.state || persistedSession || {};
  const sessionRole = activeSession?.role;
  const isCreatorEntry = sessionRole === "HOST" || activeSession?.created === true;
  const livekitUrl = activeSession?.livekitHost || activeSession?.livekitUrl || "";
  const livekitToken = activeSession?.livekitToken || activeSession?.token || "";
  const hasLiveKitSession = Boolean(livekitUrl && livekitToken);

  const {
    participants: livekitParticipants,
    connectionState: livekitConnectionState,
    connect: connectLiveKit,
    disconnect: disconnectLiveKit,
    toggleMicrophone: toggleLiveKitMicrophone,
    toggleCamera: toggleLiveKitCamera,
  } = useLiveKitRoom();

  const initialJoinSettings = location.state?.joinSettings;
  const isApproved = location.state?.approved;
  const isParticipantAllowed = location.state?.pending === false || isApproved;

  const [chatOpen, setChatOpen] = useState(true);
  const [micActive, setMicActive] = useState(
    initialJoinSettings?.micOn ?? true,
  );
  const [videoActive, setVideoActive] = useState(
    initialJoinSettings?.camOn ?? true,
  );
  const [mediaLoading, setMediaLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() =>
    createInitialMessages(sessionRole === "HOST"),
  );
  const [elapsed, setElapsed] = useState(0);
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [isHost, setIsHost] = useState(false);
  const [canEnterRoom, setCanEnterRoom] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [pendingParticipants, setPendingParticipants] = useState([]);

  // Debug logging
  useEffect(() => {
    console.log("MeetingRoomPage Debug:", {
      hasLiveKitSession,
      livekitUrl: livekitUrl ? "✓ Present" : "✗ Missing",
      livekitToken: livekitToken ? "✓ Present" : "✗ Missing",
      activeSession: Object.keys(activeSession),
      livekitConnectionState,
      isHost,
    });
  }, [hasLiveKitSession, livekitUrl, livekitToken, livekitConnectionState, isHost]);

  // WebSocket for HOST: subscribe to host-events
  const { connectionState: hostWsState } = useWebSocket({
    roomCode,
    role: "HOST",
    userId: currentUser?.id,
    enabled: isHost && Boolean(roomCode && currentUser?.id),
    onMessage: (message) => {
      console.log("Host WS message:", message);
      if (message.type === "JOIN_REQUEST") {
        const pendingUserId = message.data?.userId ?? message.userId;
        setPendingParticipants((prev) => {
          const isAlreadyPending = prev.some((p) => p.id === pendingUserId);
          if (isAlreadyPending) return prev;

          return [
            ...prev,
            {
              id: pendingUserId,
              userId: pendingUserId,
              name: message.data?.userName ?? message.userName ?? "Người dùng",
              email: message.data?.email ?? message.email ?? "",
              avatar: message.data?.avatar ?? message.avatar ?? null,
            },
          ];
        });
      }
    },
  });

  // WebSocket for PARTICIPANT: subscribe to participant channel
  const isWaitingApproval = !isApproved && !isCreatorEntry && isParticipantAllowed === false;
  const { connectionState: participantWsState } = useWebSocket({
    roomCode,
    userId: currentUser?.id,
    role: "PARTICIPANT",
    enabled: isWaitingApproval && Boolean(roomCode && currentUser?.id),
    onMessage: (message) => {
      console.log("Participant WS message:", message);
      if (message.type === "JOIN_APPROVED") {
        const data = message.data || message;
        const nextSession = {
          roomCode,
          role: "PARTICIPANT",
          pending: false,
          approved: true,
          livekitToken: data.livekitToken || data.token,
          livekitHost: data.livekitHost || data.livekitUrl,
        };
        roomSessionStorage.set(nextSession);
        navigate(`/room/${roomCode}`, {
          replace: true,
          state: nextSession,
        });
      }
      if (message.type === "JOIN_REJECTED") {
        const data = message.data || message;
        roomSessionStorage.clear(roomCode);
        navigate("/join/denied", {
          replace: true,
          state: { roomCode, reason: data.reason },
        });
      }
    },
  });


  const handleAcceptParticipant = (userId) => {
    if (userId == null || userId === "") {
      console.error("Accept join request failed: missing userId");
      return;
    }

    setPendingParticipants(prev => prev.filter(p => p.id !== userId));

    api.room.acceptJoinRequest(roomCode, { userId })
      .then(r => {
        console.log("Accept join request success");
        // Refetch room data to ensure we have the participant's full details (like email)
        // This is necessary because the LiveKit token might use email as identity,
        // and we need the email in roomParticipants to properly merge and avoid duplicates.
        api.room.getRoomByCode(roomCode)
          .then(roomResponse => {
            const roomData = getRoomData(roomResponse);
            setRoomParticipants(normalizeRoomParticipants(roomData, currentUser));
          })
          .catch(err => console.error("Refetch room data failed:", err));
      })
      .catch(e => console.error("Accept join request failed:", e));
  };

  const handleRejectParticipant = (userId) => {
    setPendingParticipants(prev => prev.filter(p => p.id !== userId));
  };

  // Fetch room info and participants, determine if current user is host
  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;
    const fetchRoom = async () => {
      try {
        const roomResponse = await api.room.getRoomByCode(roomCode);
        const roomData = getRoomData(roomResponse);
        if (cancelled) return;

        const userIsHost = isCreatorEntry || roomData?.hostUser?.id === currentUser?.id;

        setIsHost(userIsHost);
        setRoomInfo(roomData);
        setRoomParticipants(
          normalizeRoomParticipants(roomData, currentUser),
        );

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
  }, [roomCode, currentUser?.id, isCreatorEntry]);



  useEffect(() => {
    if (!hasLiveKitSession || !roomCode || !currentUser?.id) {
      return undefined;
    }

    let cancelled = false;

    const connectRoom = async () => {
      try {
        await connectLiveKit({
          url: livekitUrl,
          token: livekitToken,
          autoAudio: initialJoinSettings?.micOn ?? true,
          autoVideo: initialJoinSettings?.camOn ?? true,
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Không thể kết nối LiveKit:", error);
        }
      }
    };

    connectRoom();

    return () => {
      cancelled = true;
      disconnectLiveKit();
    };
  }, [
    hasLiveKitSession,
    roomCode,
    currentUser?.id,
    livekitUrl,
    livekitToken,
    initialJoinSettings?.micOn,
    initialJoinSettings?.camOn,
    connectLiveKit,
    disconnectLiveKit,
  ]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (!currentUser?.id) {
      return [];
    }

    const localLivekitParticipant = hasLiveKitSession 
      ? livekitParticipants?.find(p => p.self) 
      : null;

    const selfTile = {
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name || "Bạn",
      hasVideo: localLivekitParticipant?.hasVideo ?? videoActive,
      isMuted: localLivekitParticipant?.isMuted ?? !micActive,
      self: true,
      isHost,
      active: micActive,
      videoTrack: localLivekitParticipant?.videoTrack ?? null,
      audioTrack: localLivekitParticipant?.audioTrack ?? null,
      stream: localLivekitParticipant?.stream ?? null,
    };

    const allParticipants = [selfTile, ...(Array.isArray(roomParticipants) ? roomParticipants : [])];

    if (allParticipants.length === 0) {
      return [selfTile]; // Ensure at least self is always present
    }

    return allParticipants
      .map((participant, index) => ({
        ...participant,
        sortOrder: index,
      }))
      .sort((a, b) => {
        if (a.isHost !== b.isHost) {
          return a.isHost ? -1 : 1;
        }

        return a.sortOrder - b.sortOrder;
      })
      .map(({ sortOrder, ...participant }) => participant);
  }, [
    currentUser?.id,
    currentUser?.name,
    currentUser?.email,
    roomParticipants,
    micActive,
    videoActive,
    isHost,
    hasLiveKitSession,
    livekitParticipants,
  ]);

  const displayedParticipants = useMemo(() => {
    const gridList = Array.isArray(gridParticipants) ? gridParticipants : [];

    if (!hasLiveKitSession) {
      return gridList;
    }

    const livekitList = Array.isArray(livekitParticipants)
      ? livekitParticipants
      : [];

    if (livekitList.length === 0) {
      return gridList;
    }

    const getUniqueKeys = (p) => {
      return [p?.id, p?.identity, p?.email, p?.userId]
        .filter(Boolean)
        .map(k => String(k).trim().toLowerCase());
    };

    const enrichedLivekitList = livekitList.map(lkp => {
      const lkKeys = getUniqueKeys(lkp);
      const match = gridList.find(gp => {
        if (gp.self && lkp.self) return true;
        const gpKeys = getUniqueKeys(gp);
        return gpKeys.some(k => lkKeys.includes(k));
      });

      if (match) {
        return {
          ...lkp,
          name: match.name || lkp.name,
          avatar: match.avatar || lkp.avatar,
          isHost: match.isHost !== undefined ? match.isHost : lkp.isHost,
        };
      }
      return lkp;
    });

    const missingFromLivekit = gridList.filter(gp => {
      if (gp.self && livekitList.some(lp => lp.self)) return false;
      const gpKeys = getUniqueKeys(gp);
      return !livekitList.some(lkp => {
        const lkKeys = getUniqueKeys(lkp);
        return gpKeys.some(k => lkKeys.includes(k));
      });
    });

    // Keep LiveKit tiles first (for active streams), then append API/grid-only members.
    return [...enrichedLivekitList, ...missingFromLivekit];
  }, [hasLiveKitSession, livekitParticipants, gridParticipants]);

  const visibleParticipants = displayedParticipants.filter((participant) => {
    const searchValue = participantQuery.trim().toLowerCase();
    if (!searchValue) return true;

    return String(participant.name || "")
      .toLowerCase()
      .includes(searchValue);
  });
  // Ensure participant count is always at least 1 (self) and is an array length
  const participantCount = Math.max(1, Array.isArray(displayedParticipants) ? displayedParticipants.length : 0);
  const contributorCount = visibleParticipants.length || 1;

  const handleToggleMic = async () => {
    if (!hasLiveKitSession) return;
    try {
      await toggleLiveKitMicrophone();
      setMicActive((prev) => !prev);
    } catch (error) {
      console.error("Toggle LiveKit mic failed:", error);
    }
  };

  const handleToggleVideo = async () => {
    if (!hasLiveKitSession) return;
    try {
      await toggleLiveKitCamera();
      setVideoActive((prev) => !prev);
    } catch (error) {
      console.error("Toggle LiveKit camera failed:", error);
    }
  };

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
  if (!isHost && !isParticipantAllowed) {
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
            {displayedParticipants.map((participant) => (
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
              pendingParticipants={pendingParticipants}
              onAccept={handleAcceptParticipant}
              onReject={handleRejectParticipant}
            />
          )}
        </main>

        <MeetingControlBar
          roomCode={roomCode}
          micActive={micActive}
          videoActive={videoActive}
          mediaLoading={mediaLoading || livekitConnectionState === "connecting"}
          onToggleMic={handleToggleMic}
          onToggleVideo={handleToggleVideo}
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