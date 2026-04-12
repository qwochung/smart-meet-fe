import { Link } from 'react-router-dom';
import { Building2, GraduationCap, HeartPulse, Quote, UsersRound } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const industrySolutions = [
  {
    id: 'education',
    title: 'Giáo dục',
    description: 'Trao quyền cho học sinh và giảng viên với lớp học ảo tương tác, môi trường thi an toàn và tích hợp LMS sâu.',
    icon: GraduationCap,
    cards: [
      {
        title: 'Lớp học trực tuyến',
        description: 'Tăng tương tác với phòng thảo luận, khảo sát thời gian thực và bảng trắng.',
        image:
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Giảng viên đang dạy lớp trực tuyến với học sinh',
      },
      {
        title: 'Tích hợp LMS',
        description: 'Đồng bộ điểm danh và điểm số với Canvas, Moodle và Blackboard.',
        image:
          'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Bảng điều khiển hệ thống học tập trên màn hình',
      },
    ],
    quote: {
      text: 'Smart Meet đã thay đổi chương trình học từ xa của chúng tôi, tăng 40% mức độ tương tác của học sinh.',
      author: 'Dr. Sarah Chen',
      role: 'Trưởng khoa, Đại học Global',
    },
  },
  {
    id: 'enterprise',
    title: 'Doanh nghiệp',
    description: 'Mở rộng giao tiếp toàn cầu với bảo mật cấp ngân hàng, kiểm soát quản trị và SLA 99.99%.',
    icon: Building2,
    cards: [
      {
        title: 'Mã hóa đầu-cuối',
        description: 'Mã hóa AES-256 đảm bảo các cuộc họp quan trọng luôn bảo mật.',
        image:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Bảng điều khiển giao tiếp doanh nghiệp an toàn',
      },
      {
        title: 'Phân tích sử dụng',
        description: 'Bảng điều khiển tập trung cho chất lượng dịch vụ, quản lý license và mức độ áp dụng.',
        image:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Biểu đồ phân tích trên màn hình laptop',
      },
    ],
    quote: {
      text: 'Đây là nền tảng ổn định nhất mà chúng tôi dùng cho hơn 20,000 cuộc gọi nhân viên mỗi tháng.',
      author: 'Marcus Thorne',
      role: 'CTO, Vertex Global',
    },
  },
  {
    id: 'healthcare',
    title: 'Y tế',
    description: 'Giải pháp khám bệnh từ xa đạt chuẩn HIPAA, ưu tiên quyền riêng tư của bệnh nhân và sự dễ dùng cho bác sĩ.',
    icon: HeartPulse,
    cards: [
      {
        title: 'Lịch khám trực tuyến',
        description: 'Video độ phân giải cao để chẩn đoán từ xa chính xác và tái khám hiệu quả.',
        image:
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Bác sĩ đang tư vấn khám bệnh trực tuyến với bệnh nhân',
      },
      {
        title: 'Tích hợp EHR',
        description: 'Kết nối trực tiếp với Epic và Cerner để cập nhật hồ sơ y tế nhanh gọn.',
        image:
          'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Bác sĩ sử dụng hệ thống hồ sơ sức khỏe điện tử',
      },
    ],
    quote: {
      text: 'Niềm tin của bệnh nhân là ưu tiên hàng đầu. Smart Meet mang đến độ bảo mật và chất lượng chúng tôi cần.',
      author: 'Dr. Elena Rodriguez',
      role: 'Giám đốc y khoa, HealthPoint',
    },
  },
  {
    id: 'remote',
    title: 'Nhóm làm việc từ xa',
    description: 'Xây dựng văn hóa hợp tác xuyên múi giờ với công cụ cho cả làm việc đồng bộ và bất đồng bộ.',
    icon: UsersRound,
    cards: [
      {
        title: 'Phòng họp nhanh luôn mở',
        description: 'Không gian văn phòng ảo để thành viên ra vào linh hoạt cho các buổi đồng bộ nhanh.',
        image:
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Góc làm việc của nhóm từ xa với laptop và bàn làm việc',
      },
      {
        title: 'Ghi chú cộng tác',
        description: 'Chương trình họp và ghi chú được đồng bộ tức thì sang Slack và Notion.',
        image:
          'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=1200&q=80',
        imageAlt: 'Giấy ghi chú cho lập kế hoạch cộng tác',
      },
    ],
    quote: {
      text: 'Cuối cùng chúng tôi cảm thấy như đang ngồi chung một phòng, dù đang ở 12 quốc gia khác nhau.',
      author: 'James Wilson',
      role: 'Trưởng bộ phận nhân sự, Nomad Creative',
    },
  },
];

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h1 className="max-w-xl text-5xl font-bold tracking-tight">
              Giải pháp video may đo riêng cho từng lĩnh vực
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              Khám phá cách Smart Meet giúp hợp tác mượt mà trong giáo dục, y tế và doanh nghiệp toàn cầu.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg">Đặt lịch demo</Button>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Xem bảng giá
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
            <img src="/landing.jpg" alt="Nền tảng hợp tác video chuyên nghiệp" className="h-[300px] w-full rounded-lg object-cover object-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Giải pháp theo ngành</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-center text-4xl font-bold leading-tight">
          Trao sức mạnh cho đội ngũ bằng bộ công cụ chuyên biệt
        </h2>

        <div className="mt-14 space-y-14 lg:space-y-16">
          {industrySolutions.map((industry) => {
            const IndustryIcon = industry.icon;

            return (
              <article key={industry.id} id={industry.id}>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-grid h-9 w-9 place-items-center rounded-full border border-primary-500/40 bg-primary-500/15 text-primary-300">
                    <IndustryIcon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="text-3xl font-bold">{industry.title}</h3>
                    <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{industry.description}</p>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                  {industry.cards.map((card) => {
                    return (
                      <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-3 transition-transform duration-300 hover:-translate-y-1">
                        <div className="h-44 rounded-lg relative overflow-hidden">
                          <img
                            src={card.image}
                            alt={card.imageAlt}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(15,23,42,0.34)_100%)]" />
                        </div>
                        <h4 className="mt-4 text-lg font-semibold">{card.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                      </div>
                    );
                  })}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 transition-transform duration-300 hover:-translate-y-1">
                    <Quote className="h-7 w-7 text-primary-500" />
                    <p className="mt-5 text-sm leading-relaxed text-slate-700">&quot;{industry.quote.text}&quot;</p>
                    <div className="mt-7 flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-slate-500/40" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{industry.quote.author}</p>
                        <p className="text-xs text-slate-500">{industry.quote.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pb-16 pt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center sm:px-12">
            <h2 className="text-4xl font-bold leading-tight">Sẵn sàng chuyển đổi tổ chức của bạn?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Gia nhập hơn 50,000 công ty đang tin dùng Smart Meet cho liên lạc quan trọng.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="min-w-44 rounded-lg">
                Dùng thử miễn phí
              </Button>
              <Button size="lg" variant="outline" className="min-w-44 rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100">
                Liên hệ kinh doanh
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default SolutionsPage;