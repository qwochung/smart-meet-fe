import { Headset, Home, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,rgba(37,99,235,0.22),transparent_36%),radial-gradient(circle_at_88%_14%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_80%_90%,rgba(15,23,42,0.12),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] bg-[size:36px_36px] opacity-30" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center px-5 py-8 sm:px-8">
        <section className="relative w-full overflow-hidden rounded-[34px] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary-100/70 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-14 left-20 h-40 w-40 rounded-full bg-sky-100/70 blur-2xl" />

          <div className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Trang này không tồn tại
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                Liên kết bạn mở có thể đã thay đổi, hết hạn hoặc không tồn tại.
                Hãy quay về khu vực chính để tiếp tục làm việc trong Smart Meet.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/">
                  <Button size="lg" icon={Home}>
                    Quay lại trang chủ
                  </Button>
                </Link>
                <Link to="/resources">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={Headset}
                    className="border-slate-300 text-slate-700 hover:border-slate-400"
                  >
                    Liên hệ hỗ trợ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
