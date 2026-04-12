import { ArrowRight, BookOpen, FileText, PlayCircle, Search, TerminalSquare } from 'lucide-react';
import { Header, SiteFooter } from '../../components/common';

const resources = [
  {
    title: 'Hướng dẫn triển khai',
    description: 'Hướng dẫn từng bước để triển khai Smart Meeting cho đội ngũ của bạn.',
    icon: BookOpen,
    type: 'Hướng dẫn',
  },
  {
    title: 'Blog',
    description: 'Cập nhật tin tức sản phẩm, mẹo sử dụng và góc nhìn ngành.',
    icon: FileText,
    type: 'Bài viết',
  },
  {
    title: 'Video hướng dẫn',
    description: 'Xem hướng dẫn từng bước để làm chủ các tính năng chính.',
    icon: PlayCircle,
    type: 'Video',
  },
  {
    title: 'Tài liệu API',
    description: 'Tài liệu tích hợp dành cho quy trình làm việc của lập trình viên.',
    icon: TerminalSquare,
    type: 'Lập trình viên',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Trung tâm tài nguyên</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Mọi thứ bạn cần để làm chủ Smart Meet</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Từ hướng dẫn chi tiết đến công cụ nâng cao cho lập trình viên và chia sẻ cộng đồng.
        </p>
        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input placeholder="Tìm kiếm" className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-400 focus:outline-none" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Khám phá theo danh mục</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {resources.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="inline-flex rounded-lg bg-primary-50 p-2 text-primary-600">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.type}</p>
                <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <button type="button" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                  Mở tài nguyên <ArrowRight className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold">Tài nguyên phổ biến</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">Xem tất cả</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Hướng dẫn bắt đầu</p><p className="mt-1 text-sm text-slate-600">Thiết lập workspace đầu tiên trong dưới 5 phút.</p></article>
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Thực hành bảo mật tốt nhất</p><p className="mt-1 text-sm text-slate-600">Giúp cuộc họp riêng tư và an toàn.</p></article>
            <article className="rounded-lg border border-slate-200 bg-white p-4"><p className="font-semibold">Tích hợp Zapier</p><p className="mt-1 text-sm text-slate-600">Tự động hóa quy trình đặt lịch họp dễ dàng.</p></article>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h3 className="text-2xl font-semibold">Luôn cập nhật</h3>
          <p className="mt-2 text-sm text-slate-600">Đăng ký để nhận bản cập nhật, tính năng mới và mẹo từ chuyên gia.</p>
          <div className="mx-auto mt-4 flex max-w-md gap-2">
            <input placeholder="Địa chỉ email" className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary-400 focus:outline-none" />
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold hover:bg-primary-700">Đăng ký</button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
