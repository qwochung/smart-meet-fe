import { ShieldCheck, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

const AUTO_REDIRECT_SECONDS = 30;

export default function JoinRequestDeniedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [remainingSeconds, setRemainingSeconds] = useState(
    AUTO_REDIRECT_SECONDS,
  );

  const roomName = location.state?.roomName || "cuộc họp này";
  const homePath = useMemo(() => (isAuthenticated() ? "/dashboard" : "/"), []);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      navigate(homePath, { replace: true });
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [remainingSeconds, navigate, homePath]);

  const progress = (remainingSeconds / AUTO_REDIRECT_SECONDS) * 100;

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-4 py-7 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col">
        <div className="inline-flex items-center gap-3 text-sm text-slate-500">
          <div className="relative h-10 w-10">
            <svg
              className="h-10 w-10 -rotate-90"
              viewBox="0 0 40 40"
              aria-hidden
            >
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <circle
                cx="20"
                cy="20"
                r="17"
                fill="none"
                stroke="#2563eb"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={106.8}
                strokeDashoffset={106.8 - (106.8 * progress) / 100}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700">
              {remainingSeconds}
            </span>
          </div>
          <p>Đang trở về màn hình chính</p>
        </div>

        <main className="mx-auto mt-12 flex w-full max-w-[860px] flex-1 flex-col items-center text-center sm:mt-14">
          <h1 className="text-4xl font-medium leading-tight tracking-[-0.02em] text-slate-700 sm:text-5xl lg:text-[56px]">
            Có người trong cuộc gọi đã từ chối yêu cầu tham gia của bạn
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Bạn có thể thử lại sau hoặc liên hệ chủ phòng của {roomName}.
          </p>

          <button
            onClick={() => navigate(homePath, { replace: true })}
            className="mt-9 inline-flex min-w-[250px] items-center justify-center rounded-full bg-[#1a73e8] px-8 py-3 text-sm font-semibold text-white shadow-[0_3px_12px_rgba(26,115,232,0.35)] transition hover:bg-[#1669d6]"
          >
            Trở về màn hình chính
          </button>

          <Link
            to="/resources"
            className="mt-6 text-sm font-semibold text-[#1a73e8] hover:text-[#1669d6] hover:underline"
          >
            Gửi phản hồi
          </Link>

          <article className="mt-12 w-full max-w-[720px] rounded-sm border border-slate-300 bg-white px-8 py-7 text-left shadow-sm">
            <div className="flex items-start gap-5">
              <span className="inline-flex h-[68px] w-[68px] items-center justify-center rounded-md bg-[#e8f0fe] text-[#1a73e8]">
                <ShieldCheck className="h-9 w-9" />
              </span>
              <div>
                <h2 className="text-2xl font-medium leading-tight text-slate-700 sm:text-[30px]">
                  Cuộc họp của bạn được bảo mật
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Không ai có thể tham gia nếu chưa được mời hoặc được chủ phòng
                  chấp nhận.
                </p>
                <button
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1a73e8] hover:text-[#1669d6]"
                  onClick={() => navigate("/resources")}
                >
                  <TimerReset className="h-5 w-5" />
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
