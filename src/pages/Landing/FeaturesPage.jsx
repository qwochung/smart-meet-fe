import { Link } from 'react-router-dom';
import { ArrowRight, Layers, MonitorPlay, ShieldCheck, Sparkles, UsersRound, Video } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const featureGroups = [
  {
    title: 'Cuộc gọi chất lượng studio',
    summary: 'Vận hành cuộc họp mượt mà với bitrate thích ứng và khử nhiễu AI cho nhóm hybrid.',
    icon: Video,
  },
  {
    title: 'Ghi chú bằng AI',
    summary: 'Tự động ghi lại quyết định, người phụ trách và việc cần làm sau mỗi buổi họp.',
    icon: Sparkles,
  },
  {
    title: 'Không gian cộng tác',
    summary: 'Dùng bảng trắng trực tiếp và canvas chia sẻ để phát triển ý tưởng khi họp.',
    icon: UsersRound,
  },
  {
    title: 'Bảo mật doanh nghiệp',
    summary: 'Bảo vệ cuộc họp với luồng mã hóa, phòng họp an toàn và chính sách kiểm soát.',
    icon: ShieldCheck,
  },
  {
    title: 'Tích hợp quy trình',
    summary: 'Liên kết bản ghi và điểm nhấn với CRM, công cụ dự án và tài liệu.',
    icon: Layers,
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Tính năng sản phẩm</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold tracking-tight">
          Mọi thứ đội ngũ bạn cần cho hợp tác hiệu quả cao.
        </h1>
        <p className="mt-5 max-w-2xl text-slate-600">
          Khám phá các khả năng giúp cuộc họp tập trung, dễ tra cứu và dễ hành động.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/auth/register"><Button size="lg">Dùng thử miễn phí</Button></Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Quay về trang chủ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((item) => {
            const ItemIcon = item.icon;

            return (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-primary-600">
                  <ItemIcon className="w-6 h-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <MonitorPlay className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">Truyền hình ổn định</h3>
            <p className="mt-2 text-sm text-slate-600">Chia sẻ demo và livestream mà không giật lag hay giảm chất lượng.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">Sẵn sàng tuân thủ</h3>
            <p className="mt-2 text-sm text-slate-600">Đạt chuẩn doanh nghiệp với kiểm soát theo vai trò và theo dõi kiểm toán.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <Sparkles className="h-7 w-7 text-primary-600" />
            <h3 className="mt-4 text-lg font-semibold">Năng suất AI</h3>
            <p className="mt-2 text-sm text-slate-600">Tự động tóm tắt và tạo công việc theo sau sau mỗi cuộc họp.</p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default FeaturesPage;
