import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getStoredUser } from "../../utils/auth.js";
import api from "../../api";
import {
  MeetingChatPanel,
  MeetingControlBar,
  MeetingInviteModal,
  MeetingParticipantsPanel,
  MeetingRoomHeader,
  MeetingSummaryPanel,
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
import {
  ensureAudioUnlocked,
  playNotificationBeep,
} from "../../utils/notificationSound.js";

import WhiteboardOverlay from "./WhiteboardOverlay";

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
  const activeSession = useMemo(
    () => ({
      ...(persistedSession || {}),
      ...(location.state || {}),
      preMeetingUploads:
        location.state?.preMeetingUploads ??
        persistedSession?.preMeetingUploads ??
        [],
    }),
    [location.state, persistedSession],
  );
  const sessionRole = activeSession?.role;
  const isCreatorEntry =
    sessionRole === "HOST" || activeSession?.created === true;
  const livekitUrl =
    activeSession?.livekitHost || activeSession?.livekitUrl || "";
  const livekitToken =
    activeSession?.livekitToken || activeSession?.token || "";
  const hasLiveKitSession = Boolean(livekitUrl && livekitToken);

  const {
    participants: livekitParticipants,
    connectionState: livekitConnectionState,
    connect: connectLiveKit,
    disconnect: disconnectLiveKit,
    toggleMicrophone: toggleLiveKitMicrophone,
    toggleCamera: toggleLiveKitCamera,
    toggleScreenShare: toggleLiveKitScreenShare,
    isScreenSharing,
    raisedHands,
    toggleRaiseHand,
  } = useLiveKitRoom();

  const initialJoinSettings = location.state?.joinSettings;
  const isApproved = location.state?.approved;
  const isParticipantAllowed = location.state?.pending === false || isApproved;

  const [chatOpen, setChatOpen] = useState(false);
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
  const [joinedAt] = useState(() => {
    const existingSession = roomSessionStorage.get(roomCode);
    if (existingSession?.joinedAt) return existingSession.joinedAt;
    const now = Date.now();
    if (existingSession) {
      roomSessionStorage.set({ ...existingSession, joinedAt: now });
    }
    return now;
  });
  const [elapsed, setElapsed] = useState(0);
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomParticipants, setRoomParticipants] = useState([]);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [participantQuery, setParticipantQuery] = useState("");
  const messagesEndRef = useRef(null);
  const [isHost, setIsHost] = useState(isCreatorEntry);
  const [isChecking, setIsChecking] = useState(true);
  const [pendingParticipants, setPendingParticipants] = useState([]);
  const prevRemoteParticipantKeysRef = useRef(new Set());
  const [isSpotlightListOpen, setIsSpotlightListOpen] = useState(false);
  const [focusedParticipantKey, setFocusedParticipantKey] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [whiteboardActive, setWhiteboardActive] = useState(false);

  // Unlock audio on first user interaction (browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      ensureAudioUnlocked();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // ─── Sync mic/video state after LiveKit connects ────────────────────────────
  useEffect(() => {
    if (livekitConnectionState !== "connected") return;
    const localParticipant = livekitParticipants?.find((p) => p.self);
    if (!localParticipant) return;
    setMicActive(!localParticipant.isMuted);
    setVideoActive(localParticipant.hasVideo);
  }, [livekitConnectionState]); // eslint-disable-line react-hooks/exhaustive-deps

  // WebSocket for HOST
  useWebSocket({
    roomCode,
    role: "HOST",
    userId: currentUser?.id,
    enabled: (isHost || isCreatorEntry) && Boolean(roomCode && currentUser?.id),
    onMessage: (msg) => {
      if (msg.type === "JOIN_REQUEST") {
        playNotificationBeep("join-request");
        console.log("HOST WS received:", msg);
        console.log("JOIN_REQUEST data:", msg.data);
        const pendingUserId = msg.data?.userId ?? msg.userId;
        setPendingParticipants((prev) => {
          if (prev.some((p) => p.id === pendingUserId)) return prev;
          return [
            ...prev,
            {
              id: pendingUserId,
              userId: pendingUserId,
              name: msg.data?.userName ?? msg.userName ?? "Người dùng",
              email: msg.data?.email ?? msg.email ?? "",
              avatar: msg.data?.avatar ?? msg.avatar ?? null,
            },
          ];
        });
      }
    },
  });

  // WebSocket for PARTICIPANT waiting approval
  const isWaitingApproval =
    !isApproved && !isCreatorEntry && isParticipantAllowed === false;
  useWebSocket({
    roomCode,
    userId: currentUser?.id,
    role: "PARTICIPANT",
    enabled: isWaitingApproval && Boolean(roomCode && currentUser?.id),
    onMessage: (msg) => {
      console.log("PARTICIPANT WS received:", msg);
      if (msg.type === "JOIN_APPROVED") {
        const data = msg.data || msg;
        const nextSession = {
          roomCode,
          role: "PARTICIPANT",
          pending: false,
          approved: true,
          livekitToken: data.livekitToken || data.token,
          livekitHost: data.livekitHost || data.livekitUrl,
        };
        roomSessionStorage.set(nextSession);
        navigate(`/room/${roomCode}`, { replace: true, state: nextSession });
      }
      if (msg.type === "JOIN_REJECTED") {
        const data = msg.data || msg;
        roomSessionStorage.clear(roomCode);
        navigate("/join/denied", {
          replace: true,
          state: { roomCode, reason: data.reason },
        });
      }
    },
  });

  const handleAcceptParticipant = (userId) => {
    if (userId == null || userId === "") return;
    setPendingParticipants((prev) => prev.filter((p) => p.id !== userId));
    api.room
      .acceptJoinRequest(roomCode, { userId: Number(userId) })
      .then(() => {
        api.room
          .getRoomByCode(roomCode)
          .then((roomResponse) => {
            const roomData = getRoomData(roomResponse);
            setRoomParticipants(
              normalizeRoomParticipants(roomData, currentUser),
            );
          })
          .catch((err) => console.error("Refetch room data failed:", err));
      })
      .catch((e) => console.error("Accept join request failed:", e));
  };

  const handleRejectParticipant = (userId) => {
    setPendingParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  // Fetch room info
  useEffect(() => {
    if (!roomCode) return;
    let cancelled = false;
    const fetchRoom = async () => {
      try {
        const roomResponse = await api.room.getRoomByCode(roomCode);
        const roomData = getRoomData(roomResponse);
        if (cancelled) return;
        const userIsHost =
          isCreatorEntry || roomData?.hostUser?.id === currentUser?.id;
        setIsHost(userIsHost);
        setRoomInfo(roomData);
        setRoomParticipants(normalizeRoomParticipants(roomData, currentUser));
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

  // Connect LiveKit
  useEffect(() => {
    if (!hasLiveKitSession || !roomCode || !currentUser?.id) return undefined;
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
        if (!cancelled) console.error("Không thể kết nối LiveKit:", error);
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

  // Sound when a participant (re)appears in the room
  useEffect(() => {
    if (!hasLiveKitSession) return;
    if (!Array.isArray(livekitParticipants)) return;

    const getKey = (p) =>
      String(p?.identity || p?.id || p?.email || p?.userId || "")
        .trim()
        .toLowerCase();

    const currentRemoteKeys = new Set(
      livekitParticipants
        .filter((p) => !p?.self)
        .map(getKey)
        .filter(Boolean),
    );

    const prevKeys = prevRemoteParticipantKeysRef.current || new Set();
    let hasNewRemote = false;
    for (const key of currentRemoteKeys) {
      if (!prevKeys.has(key)) {
        hasNewRemote = true;
        break;
      }
    }

    if (hasNewRemote) {
      playNotificationBeep("user-return");
    }

    prevRemoteParticipantKeysRef.current = currentRemoteKeys;
  }, [hasLiveKitSession, livekitParticipants]);

  // Timer
  useEffect(() => {
    const updateElapsed = () => {
      setElapsed(Math.floor((Date.now() - joinedAt) / 1000));
    };
    updateElapsed();
    const t = setInterval(updateElapsed, 1000);
    return () => clearInterval(t);
  }, [joinedAt]);

  // Auto-scroll chat
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

  // ─── Toggle mic ─────────────────────────────────────────────────────────────
  const handleToggleMic = async () => {
    if (!hasLiveKitSession) {
      setMicActive((prev) => !prev);
      return;
    }
    setMediaLoading(true);
    try {
      const nextEnabled = await toggleLiveKitMicrophone();
      if (typeof nextEnabled === "boolean") {
        setMicActive(nextEnabled);
      } else {
        setMicActive((prev) => !prev);
      }
    } catch (error) {
      console.error("Toggle LiveKit mic failed:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  // ─── Toggle camera ───────────────────────────────────────────────────────────
  const handleToggleVideo = async () => {
    if (!hasLiveKitSession) {
      setVideoActive((prev) => !prev);
      return;
    }
    setMediaLoading(true);
    try {
      const nextEnabled = await toggleLiveKitCamera();
      if (typeof nextEnabled === "boolean") {
        setVideoActive(nextEnabled);
      } else {
        setVideoActive((prev) => !prev);
      }
    } catch (error) {
      console.error("Toggle LiveKit camera failed:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleToggleScreenShare = async () => {
    if (!hasLiveKitSession) return;
    setMediaLoading(true);
    try {
      await toggleLiveKitScreenShare();
    } catch (error) {
      console.error("Toggle LiveKit screen share failed:", error);
    } finally {
      setMediaLoading(false);
    }
  };

  const roomTitle = roomInfo?.name || roomInfo?.title || `Phòng ${roomCode}`;
  const roomJoinLink = `${window.location.origin}/join?roomCode=${roomCode}`;

  const gridParticipants = useMemo(() => {
    if (!currentUser?.id) return [];

    const localLivekitParticipant = hasLiveKitSession
      ? livekitParticipants?.find((p) => p.self)
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

    const allParticipants = [
      selfTile,
      ...(Array.isArray(roomParticipants) ? roomParticipants : []),
    ];
    return allParticipants
      .map((p, i) => ({ ...p, sortOrder: i }))
      .sort((a, b) => {
        if (a.isHost !== b.isHost) return a.isHost ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      })
      .map(({ sortOrder, ...p }) => p);
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
    if (!hasLiveKitSession) return gridList;

    const livekitList = Array.isArray(livekitParticipants)
      ? livekitParticipants
      : [];
    if (livekitList.length === 0) return gridList;

    const getUniqueKeys = (p) =>
      [p?.id, p?.identity, p?.email, p?.userId]
        .filter(Boolean)
        .map((k) => String(k).trim().toLowerCase());

    const enrichedLivekitList = livekitList.map((lkp) => {
      const lkKeys = getUniqueKeys(lkp);
      const match = gridList.find((gp) => {
        if (gp.self && lkp.self) return true;
        return getUniqueKeys(gp).some((k) => lkKeys.includes(k));
      });
      if (match) {
        return {
          ...lkp,
          // Prefer the name from the API/room data over LiveKit identity (email)
          name: match.name || lkp.name,
          avatar: match.avatar || lkp.avatar,
          isHost: match.isHost !== undefined ? match.isHost : lkp.isHost,
          isHandRaised: raisedHands.has(lkp.identity) || raisedHands.has(lkp.id) || raisedHands.has(lkp.sid),
        };
      }
      return {
        ...lkp,
        isHandRaised: raisedHands.has(lkp.identity) || raisedHands.has(lkp.id) || raisedHands.has(lkp.sid),
      };
    });

    const missingFromLivekit = gridList.filter((gp) => {
      if (gp.self && livekitList.some((lp) => lp.self)) return false;
      const gpKeys = getUniqueKeys(gp);
      return !livekitList.some((lkp) =>
        getUniqueKeys(lkp).some((k) => gpKeys.includes(k)),
      );
    });

    return [...enrichedLivekitList, ...missingFromLivekit.map(p => ({
      ...p,
      isHandRaised: raisedHands.has(p.identity) || raisedHands.has(p.id) || raisedHands.has(p.sid),
    }))];
  }, [hasLiveKitSession, livekitParticipants, gridParticipants, raisedHands]);

  const visibleParticipants = displayedParticipants.filter((p) => {
    const q = participantQuery.trim().toLowerCase();
    if (!q) return true;
    return String(p.name || "")
      .toLowerCase()
      .includes(q);
  });

  const participantCount = Math.max(
    1,
    Array.isArray(displayedParticipants) ? displayedParticipants.length : 0,
  );
  const contributorCount = visibleParticipants.length || 1;
  const screenShareParticipant = useMemo(
    () =>
      Array.isArray(displayedParticipants)
        ? displayedParticipants.find((p) => p?.isScreenSharing) || null
        : null,
    [displayedParticipants],
  );
  const participantCountLabel = Math.max(
    1,
    Array.isArray(displayedParticipants) ? displayedParticipants.length : 0,
  );
  const spotlightParticipants = useMemo(
    () =>
      Array.isArray(displayedParticipants)
        ? displayedParticipants.filter(Boolean)
        : [],
    [displayedParticipants],
  );
  const focusedParticipant = useMemo(() => {
    if (!focusedParticipantKey) return null;
    return (
      spotlightParticipants.find((p) => {
        const key = String(p?.identity || p?.id || p?.email || "")
          .trim()
          .toLowerCase();
        return key === focusedParticipantKey;
      }) || null
    );
  }, [focusedParticipantKey, spotlightParticipants]);
  const spotlightPrimaryParticipant =
    focusedParticipant || screenShareParticipant;
  const isPrimaryScreenShare = Boolean(
    spotlightPrimaryParticipant?.isScreenSharing,
  );

  const toggleChatPanel = () => {
    setChatOpen((open) => {
      if (!open) {
        setParticipantsOpen(false);
        setSummaryOpen(false);
      }
      return !open;
    });
  };
  const toggleParticipantsPanel = () => {
    setParticipantsOpen((open) => {
      if (!open) {
        setChatOpen(false);
        setSummaryOpen(false);
      }
      return !open;
    });
  };
  const toggleSummaryPanel = () => {
    setSummaryOpen((open) => {
      if (!open) {
        setChatOpen(false);
        setParticipantsOpen(false);
      }
      return !open;
    });
  };
  const toggleSpotlightList = () => setIsSpotlightListOpen((prev) => !prev);

  const preMeetingSummaryItems = useMemo(
    () =>
      Array.isArray(activeSession?.preMeetingUploads)
        ? activeSession.preMeetingUploads.filter(
            (item) => String(item?.summary || "").trim().length > 0,
          )
        : [],
    [activeSession?.preMeetingUploads],
  );

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
    const target = String(email || "").trim();
    if (!target) return;
    const time = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "Hệ thống",
        time,
        content: `Đã tạo lời mời cho ${target}. Link: ${roomJoinLink}`,
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
        @keyframes speakerWave { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.35); } }
        @keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
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
          summaryOpen={summaryOpen}
          participantCount={participantCount}
          summaryCount={preMeetingSummaryItems.length}
          onToggleChat={toggleChatPanel}
          onToggleParticipants={toggleParticipantsPanel}
          onToggleSummary={toggleSummaryPanel}
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
          {screenShareParticipant ? (
            // position: relative QUAN TRỌNG — WhiteboardOverlay dùng position: absolute inset: 0
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative", // ← ĐÂY LÀ FIX CHÍNH
              }}
            >
              {/* Video của người share màn hình */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingInline: isPrimaryScreenShare
                    ? "clamp(8px, 2vw, 24px)"
                    : 0,
                }}
              >
                <div
                  style={{
                    width: isPrimaryScreenShare
                      ? "min(100%, calc((100vh - 110px) * 1.78))"
                      : "100%",
                    height: isPrimaryScreenShare
                      ? "min(100%, calc(100vh - 110px))"
                      : "100%",
                    maxWidth: "100%",
                    maxHeight: isPrimaryScreenShare
                      ? "calc(100vh - 110px)"
                      : "100%",
                    aspectRatio: isPrimaryScreenShare ? "16 / 9" : "auto",
                  }}
                >
                  <ParticipantTile
                    key={spotlightPrimaryParticipant.id}
                    participant={spotlightPrimaryParticipant}
                    contentFit={isPrimaryScreenShare ? "contain" : "cover"}
                    presentationMode={isPrimaryScreenShare}
                  />
                </div>
              </div>

              <WhiteboardOverlay
                roomCode={roomCode}
                userId={currentUser?.id}
                enabled={Boolean(screenShareParticipant)}
                isScreenSharer={Boolean(screenShareParticipant?.self)}
                active={whiteboardActive}
              />

              {/* PiP — camera của người share */}
              {focusedParticipant && (
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    bottom: 70,
                    width: 220,
                    height: 130,
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    zIndex: 6,
                  }}
                >
                  <ParticipantTile
                    key={`pip-${screenShareParticipant.id}`}
                    participant={screenShareParticipant}
                    contentFit="contain"
                    presentationMode
                  />
                </div>
              )}

              {/* Nút đếm người */}
              <button
                type="button"
                onClick={toggleSpotlightList}
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  zIndex: 7,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(8,12,20,0.75)",
                  color: "white",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "7px 12px",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
              >
                {participantCountLabel} người trong phòng
              </button>

              {/* Spotlight list */}
              {isSpotlightListOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    bottom: 58,
                    width: 300,
                    maxHeight: 360,
                    overflowY: "auto",
                    borderRadius: 14,
                    padding: 10,
                    background: "rgba(9,14,24,0.88)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.38)",
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 8,
                    zIndex: 8,
                  }}
                >
                  {spotlightParticipants.map((participant) => {
                    const participantKey = String(
                      participant?.identity ||
                        participant?.id ||
                        participant?.email ||
                        "",
                    )
                      .trim()
                      .toLowerCase();
                    const isSelected =
                      participantKey === focusedParticipantKey ||
                      (!focusedParticipant && participant?.isScreenSharing);
                    return (
                      <button
                        key={`spotlight-${participant.id}`}
                        type="button"
                        onClick={() => {
                          if (participant?.isScreenSharing) {
                            setFocusedParticipantKey(null);
                            return;
                          }
                          setFocusedParticipantKey(participantKey);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: isSelected
                            ? "1px solid rgba(96,165,250,0.75)"
                            : "1px solid rgba(255,255,255,0.12)",
                          background: isSelected
                            ? "rgba(37,99,235,0.22)"
                            : "rgba(255,255,255,0.04)",
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {participant?.name || "Participant"}
                        </span>
                        {participant?.isScreenSharing && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "#bfdbfe",
                              border: "1px solid rgba(147,197,253,0.5)",
                              borderRadius: 999,
                              padding: "2px 7px",
                            }}
                          >
                            Đang chia sẻ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", ...gridStyle }}>
              {displayedParticipants.map((participant) => (
                <ParticipantTile
                  key={participant.id}
                  participant={participant}
                />
              ))}
            </div>
          )}

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

          {summaryOpen && (
            <MeetingSummaryPanel
              summaryItems={preMeetingSummaryItems}
              onClose={() => setSummaryOpen(false)}
            />
          )}
        </main>

        <MeetingControlBar
          roomCode={roomCode}
          micActive={micActive}
          videoActive={videoActive}
          screenSharingActive={isScreenSharing}
          mediaLoading={mediaLoading || livekitConnectionState === "connecting"}
          onToggleMic={handleToggleMic}
          onToggleVideo={handleToggleVideo}
          onToggleScreenShare={handleToggleScreenShare}
          onToggleParticipants={toggleParticipantsPanel}
          onLeave={() => navigate(`/room/${roomCode}/summary`)}
          whiteboardActive={whiteboardActive}
          onToggleWhiteboard={() => setWhiteboardActive((prev) => !prev)}
          isWhiteboardAllowed={Boolean(screenShareParticipant)}
          isHandRaised={raisedHands.has(currentUser?.id) || raisedHands.has(currentUser?.email)}
          onToggleRaiseHand={toggleRaiseHand}
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
