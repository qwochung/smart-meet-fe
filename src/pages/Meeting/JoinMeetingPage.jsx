import { useEffect, useRef, useState } from "react";
import {Navigate, useNavigate, useSearchParams} from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  Link as LinkIcon,
  Mic,
  MicOff,
  MonitorSpeaker,
  Video,
  VideoOff,
  Wand2,
  MonitorUp,
  Cast,
} from "lucide-react";
import api from "../../api";
import {getStoredUser} from "../../utils/auth.js";
import { Client } from "@stomp/stompjs";


const WS_HOST = import.meta.env.VITE_WS_HOST;
const normalizeParticipants = (roomData = {}) => {
  const source =
    roomData.participants ||
    roomData.members ||
    roomData.attendees ||
    roomData.users ||
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((participant, index) => ({
    id: participant?.id || participant?.userId || participant?.email || index,
    name:
      participant?.name ||
      participant?.fullName ||
      participant?.displayName ||
      participant?.email ||
      "Thành viên",
    avatar:
      participant?.avatar ||
      participant?.avatarUrl ||
      participant?.photoURL ||
      participant?.image ||
      "",
  }));
};

const getRoomData = (response) => response?.data || response || {};

const formatRoomTime = (roomData = {}) => {
  const startRaw = roomData.startTime || roomData.startAt || roomData.scheduledAt;
  const endRaw = roomData.endTime || roomData.endAt;

  if (!startRaw) {
    return "Bắt đầu ngay khi bạn vào phòng";
  }

  const start = new Date(startRaw);
  if (Number.isNaN(start.getTime())) {
    return "Bắt đầu ngay khi bạn vào phòng";
  }

  const formatter = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });

  if (!endRaw) {
    return formatter.format(start);
  }

  const end = new Date(endRaw);
  if (Number.isNaN(end.getTime())) {
    return formatter.format(start);
  }

  const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)} · ${formatter.format(start)}`;
};

export default function JoinMeetingPage() {
  const currentUser = getStoredUser();
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const cameraWantedRef = useRef(true);
  const micWantedRef = useRef(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const [isRoomLoading, setIsRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);

  const roomCode = searchParams.get("roomCode")?.trim() || "";

  const stopStream = (stream) => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const stompClientRef = useRef(null);

  // Camera mic
  useEffect(() => {
    let cancelled = false;

    const openMedia = async () => {
      try {
        // Mở 2 stream độc lập ngay từ đầu
        const [videoStream, audioStream] = await Promise.all([
          navigator.mediaDevices.getUserMedia({ video: true }),
          navigator.mediaDevices.getUserMedia({ audio: true }),
        ]);

        if (cancelled) {
          stopStream(videoStream);
          stopStream(audioStream);
          return;
        }

        if (cameraWantedRef.current) {
          videoStreamRef.current = videoStream;
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
          }
        } else {
          stopStream(videoStream);
        }

        if (micWantedRef.current) {
          audioStreamRef.current = audioStream;
        } else {
          stopStream(audioStream);
        }
      } catch (err) {
        console.error("Lỗi truy cập media:", err);
      }
    };

    openMedia();

    return () => {
      cancelled = true;
      stopStream(videoStreamRef.current);
      stopStream(audioStreamRef.current);
      videoStreamRef.current = null;
      audioStreamRef.current = null;
    };
  }, []);

  // Fetch room info
  useEffect(() => {
    if (!roomCode) {
      setRoomInfo(null);
      setRoomError("Không tìm thấy mã phòng. Vui lòng kiểm tra lại liên kết.");
      return;
    }

    let cancelled = false;
    setIsRoomLoading(true);
    setRoomError("");

    const fetchRoom = async () => {
      try {
        const response = await api.room.getRoomByCode(roomCode);
        if (cancelled) return;
        setRoomInfo(getRoomData(response));
      } catch (error) {
        if (cancelled) return;
        console.error("Không lấy được thông tin phòng:", error);
        setRoomError("Không thể tải thông tin phòng. Vui lòng thử lại sau.");
      } finally {
        if (!cancelled) {
          setIsRoomLoading(false);
        }
      }
    };

    fetchRoom();

    return () => {
      cancelled = true;
    };
  }, [roomCode]);

  // Socket for real-time
  useEffect(() => {
    if (!roomCode) return;

    const client = new Client({
      brokerURL: `${WS_HOST}/meet`,
      onConnect: () => {
        console.log("WS connected");

        client.subscribe(
          `topic/room/${roomCode}/user/${currentUser?.id}`,
          (message) => {
            const data = JSON.parse(message.body);
            console.log("Received WS message:", data);

            if (data.type === "JOIN_APPROVED") {
              navigate(`/room/${roomCode}`, {
                state: {
                  joinSettings: {
                    micOn: isMicOn,
                    camOn: isCamOn,
                  },
                },
              });
            }

            if (data.type === "JOIN_REJECTED") {
              navigate("/join/denied", {
                replace: true,
                state: {
                  roomCode,
                  roomName,
                },
              });
            }

          }
        )
      },

      onStompError: (frame) => {
        console.error("WS STOMP error:", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate()
        .then(r => console.log("WS disconnected"))
        .catch(err => console.error("Error disconnecting WS:", err));
    }

  }, [roomCode, currentUser?.id]);


  const toggleCamera = async () => {
    if (isMediaLoading) return;
    setIsMediaLoading(true);
    try {
      if (isCamOn) {
        cameraWantedRef.current = false;
        stopStream(videoStreamRef.current);
        videoStreamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsCamOn(false);
      } else {
        cameraWantedRef.current = true;
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (!cameraWantedRef.current) {
          stopStream(newStream);
          return;
        }

        videoStreamRef.current = newStream;
        if (videoRef.current) videoRef.current.srcObject = newStream;
        setIsCamOn(true);
      }
    } catch (err) {
      console.error("Không thể toggle camera:", err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  const toggleMic = async () => {
    if (isMediaLoading) return;
    setIsMediaLoading(true);
    try {
      if (isMicOn) {
        micWantedRef.current = false;
        stopStream(audioStreamRef.current);
        audioStreamRef.current = null;
        setIsMicOn(false);
      } else {
        micWantedRef.current = true;
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (!micWantedRef.current) {
          stopStream(newStream);
          return;
        }

        audioStreamRef.current = newStream;
        setIsMicOn(true);
      }
    } catch (err) {
      console.error("Không thể toggle mic:", err);
    } finally {
      setIsMediaLoading(false);
    }
  };

  const handleJoin = () => {
    if (!roomCode || !stompClientRef.current) return;
    setIsRoomLoading(true);

    stompClientRef.current.publish({
      destination: `/app/room/${roomCode}/join`,
      body: JSON.stringify({
        userId: currentUser?.id,
        role: "PARTICIPANT",
        type: "JOIN_REQUEST",
      })
    });
  };

  const participants = normalizeParticipants(roomInfo || {});
  const roomName = roomInfo?.name || roomInfo?.title || `Phòng ${roomCode || "meeting"}`;
  const roomLink = roomInfo?.meetingLink || roomInfo?.roomLink || `smart.meet/room/${roomCode || "-"}`;
  const participantsText = participants.length
    ? `${participants[0].name} và ${Math.max(participants.length - 1, 0)} người khác đã vào phòng`
    : "Chưa có ai trong phòng. Bạn sẽ là người đầu tiên.";
  const canJoin = Boolean(roomCode) && !isRoomLoading;

  if(!roomCode){
    return <Navigate to="/dashboard" replace/>;
  }
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <main className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="flex w-full max-w-[1100px] flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl text-center lg:text-left">
                Sẵn sàng tham gia?
              </h1>
              <p className="mt-2 text-slate-500 text-center lg:text-left">
                Kiểm tra âm thanh và camera trước khi vào cuộc gọi.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-300 relative border-4 border-white">
              <div className="aspect-video w-full bg-[#0f172a] relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`h-full w-full object-cover ${isCamOn ? "block" : "hidden"}`}
                />
                {!isCamOn && (
                  <div className="absolute inset-0 grid place-items-center bg-slate-100 border border-slate-200">
                    <VideoOff className="h-12 w-12 text-slate-300" />
                  </div>
                )}
              </div>

              {isCamOn && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-slate-900/40 px-3 py-1.5 backdrop-blur-md border border-white/20 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-sm font-medium text-white">
                    Camera đang bật
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2 text-xs font-bold tracking-wider text-slate-500">
                <button
                  onClick={toggleMic}
                  disabled={isMediaLoading}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMicOn
                      ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
                      : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  {isMicOn ? (
                    <Mic className="h-5 w-5" />
                  ) : (
                    <MicOff className="h-5 w-5" />
                  )}
                </button>
                <span>{isMicOn ? "MIC BẬT" : "MIC TẮT"}</span>
              </div>

              <div className="flex flex-col items-center gap-2 text-xs font-bold tracking-wider text-slate-500">
                <button
                  onClick={toggleCamera}
                  disabled={isMediaLoading}
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCamOn
                      ? "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200"
                      : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                  }`}
                >
                  {isCamOn ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </button>
                <span>{isCamOn ? "CAM BẬT" : "CAM TẮT"}</span>
              </div>

              <div className="h-[52px] w-px bg-slate-200 mx-2" />

              <div className="flex flex-col items-center gap-2 text-xs font-bold tracking-wider text-slate-500">
                <button className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-md">
                  <Wand2 className="h-5 w-5" />
                </button>
                <span>HIỆU ỨNG</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[420px] rounded-[24px] bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-blue-600 uppercase">
              <Calendar className="h-4 w-4" />
              Chi tiết cuộc họp
            </div>

            <h2 className="mt-4 text-[26px] font-extrabold leading-tight text-slate-900">
              {isRoomLoading ? "Đang tải thông tin cuộc họp..." : roomName}
            </h2>

            <div className="mt-5 flex items-center gap-5 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{formatRoomTime(roomInfo || {})}</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-400" />
                <span className="text-blue-600 hover:underline cursor-pointer">
                  {roomLink}
                </span>
              </div>
            </div>

            {roomError && (
              <p className="mt-3 text-sm font-medium text-red-600">{roomError}</p>
            )}

            <div className="mt-8 border-t border-slate-100" />

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">
                {participantsText}
              </p>
              <div className="mt-4 flex items-center">
                {participants.slice(0, 3).map((person, index) => (
                  person.avatar ? (
                    <img
                      key={person.id}
                      src={person.avatar}
                      alt={person.name}
                      className={`h-11 w-11 rounded-full border-[3px] border-white bg-slate-100 object-cover shadow-sm ${index === 0 ? "" : "-ml-3"}`}
                    />
                  ) : (
                    <div
                      key={person.id}
                      className={`h-11 w-11 rounded-full border-[3px] border-white bg-slate-200 text-xs font-bold text-slate-700 shadow-sm flex items-center justify-center ${index === 0 ? "" : "-ml-3"}`}
                    >
                      {person.name.slice(0, 1).toUpperCase()}
                    </div>
                  )
                ))}
                {participants.length > 3 && (
                  <div className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-xs font-bold text-slate-600 shadow-sm z-10 hover:bg-slate-200 transition cursor-pointer">
                    +{participants.length - 3}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                <span>Cài đặt thiết bị</span>
                <button className="text-blue-600 hover:text-blue-700 hover:underline">
                  Thay đổi
                </button>
              </div>
              <div className="mt-3 space-y-2 rounded-2xl bg-white p-4 text-sm font-medium text-slate-700 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <Mic className="h-4 w-4 text-slate-400" />
                  <span className="truncate">
                    MacBook Pro Microphone (Built-in)
                  </span>
                </div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex items-center gap-3">
                  <MonitorSpeaker className="h-4 w-4 text-slate-400" />
                  <span className="truncate">AirPods Pro (Bluetooth)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleJoin}
                disabled={!canJoin}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-blue-600 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                {isRoomLoading ? "Đang chờ tham gia" : "Tham gia ngay"}
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                Chỉ tham gia bằng âm thanh
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center pb-8 pt-4">
        <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
          <button className="flex items-center gap-2 hover:text-slate-800 transition">
            <MonitorUp className="h-4 w-4" />
            Trình chiếu
          </button>
          <button className="flex items-center gap-2 hover:text-slate-800 transition">
            <Cast className="h-4 w-4" />
            Truyền cuộc họp này
          </button>
        </div>
        <p className="mt-8 text-xs font-medium text-slate-400">
          © 2026 Smart Meet. Họp video chuyên nghiệp, an toàn và mã hóa.
        </p>
      </footer>
    </div>
  );
}