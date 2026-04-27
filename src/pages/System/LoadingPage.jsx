import { Loader2 } from 'lucide-react';

export default function LoadingPage({
  title = 'Đang chuẩn bị không gian làm việc',
  description = 'Vui lòng đợi trong giây lát để hệ thống tải dữ liệu cho bạn.',
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.06),transparent_50%)]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur-sm sm:p-10">
          <div className="flex items-center justify-center">
            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary-100/80" />
              <Loader2 className="relative h-9 w-9 animate-spin text-primary-600" />
            </div>
          </div>

          <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-slate-600">
            {description}
          </p>

          <div className="mt-8 space-y-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-primary-600" />
            </div>
            <div className="grid gap-2">
              <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(280%);
          }
        }
      `}</style>
    </div>
  );
}
