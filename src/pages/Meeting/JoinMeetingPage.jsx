import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function JoinMeetingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null); // ← không dùng generic TS
  const streamRef = useRef(null); // ← không dùng generic TS
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Lỗi truy cập camera:", err);
      }
    };

    openCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const toggleCamera = async () => {
    if (!streamRef.current) return;

    if (isCamOn) {
      // Dừng hẳn video track → đèn camera tắt
      streamRef.current.getVideoTracks().forEach((track) => track.stop());
      setIsCamOn(false);
    } else {
      // Xin lại quyền camera, lấy video track mới
      try {
        const newVideoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const newVideoTrack = newVideoStream.getVideoTracks()[0];

        // Thay thế track cũ (đã stop) trong stream hiện tại
        streamRef.current
          .getVideoTracks()
          .forEach((t) => streamRef.current.removeTrack(t));
        streamRef.current.addTrack(newVideoTrack);

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        setIsCamOn(true);
      } catch (err) {
        console.error("Không thể bật lại camera:", err);
      }
    }
  };

  const toggleMic = () => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !isMicOn;
    });
    setIsMicOn((prev) => !prev);
  };

  const handleJoin = () => {
    navigate("/room/prod-sync");
  };

  const people = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=100&q=80",
  ];

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
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
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
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all shadow-md ${
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
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-full transition-all shadow-md ${
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

              <div className="h-[52px] w-px bg-slate-200 mx-2"></div>

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
              Đồng bộ hằng tuần: Lộ trình sản phẩm & kế hoạch Sprint
            </h2>

            <div className="mt-5 flex items-center gap-5 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>10:00 AM - 11:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-400" />
                <span className="text-blue-600 hover:underline cursor-pointer">
                  smart.meet/prod-sync
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100" />

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">
                John, Sarah và 3 người khác đã vào phòng
              </p>
              <div className="mt-4 flex items-center">
                {people.map((person, index) => (
                  <img
                    key={person}
                    src={person}
                    alt="Participant avatar"
                    className={`h-11 w-11 rounded-full border-[3px] border-white bg-slate-100 object-cover shadow-sm ${index === 0 ? "" : "-ml-3"}`}
                  />
                ))}
                <div className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-slate-100 text-xs font-bold text-slate-600 shadow-sm z-10 hover:bg-slate-200 transition cursor-pointer">
                  +2
                </div>
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
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="flex items-center gap-3">
                  <MonitorSpeaker className="h-4 w-4 text-slate-400" />
                  <span className="truncate">AirPods Pro (Bluetooth)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleJoin}
                className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-blue-600 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                Tham gia ngay
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
