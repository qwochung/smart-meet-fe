import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button, Header, SiteFooter } from '../../components/common';

const plans = [
  {
    name: 'Miễn phí',
    price: '$0',
    period: '/tháng',
    description: 'Phù hợp cho cá nhân và các buổi họp nhanh nhỏ.',
    features: ['Tối đa 40 phút/cuộc họp', '100 người tham gia', 'Bảng trắng cơ bản', 'Chat nhóm và 1:1'],
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/người dùng/tháng',
    description: 'Trao quyền cho đội ngũ đang phát triển với công cụ nâng cao.',
    features: ['Thời lượng họp không giới hạn', '300 người tham gia', 'Ghi hình đám mây (5GB)', 'Tóm tắt cuộc họp bằng AI', 'Tùy biến thương hiệu'],
    highlighted: true,
  },
  {
    name: 'Doanh nghiệp',
    price: '$49',
    period: '/người dùng/tháng',
    description: 'Bảo mật và kiểm soát cho tổ chức quy mô lớn.',
    features: ['Người tham gia không giới hạn', 'SSO/SAML', 'CSM riêng', 'Phân tích nâng cao'],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header variant="public" fixed />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">Bảng giá</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Gói phù hợp mọi quy mô đội ngũ</h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Dù bạn là cá nhân hay doanh nghiệp toàn cầu, hãy chọn gói phù hợp để hợp tác mượt mà.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 ${plan.highlighted ? 'border-primary-300 bg-primary-50/40' : 'border-slate-200 bg-white'}`}
            >
              {plan.highlighted && (
                <span className="mb-3 inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  Phổ biến nhất
                </span>
              )}
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{plan.description}</p>
              <ul className="mt-5 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Check className="h-4 w-4 text-primary-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full">{plan.name === 'Doanh nghiệp' ? 'Liên hệ kinh doanh' : 'Bắt đầu ngay'}</Button>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="text-2xl font-semibold">So sánh tính năng chi tiết</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-3 py-2">Tính năng</th>
                  <th className="px-3 py-2">Miễn phí</th>
                  <th className="px-3 py-2">Pro</th>
                  <th className="px-3 py-2">Doanh nghiệp</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-200"><td className="px-3 py-2">Thời lượng cuộc họp</td><td className="px-3 py-2">40 phút</td><td className="px-3 py-2">Không giới hạn</td><td className="px-3 py-2">Không giới hạn</td></tr>
                <tr className="border-b border-slate-200"><td className="px-3 py-2">Người tham gia</td><td className="px-3 py-2">100</td><td className="px-3 py-2">300</td><td className="px-3 py-2">Không giới hạn</td></tr>
                <tr><td className="px-3 py-2">Tóm tắt AI</td><td className="px-3 py-2">-</td><td className="px-3 py-2">Có</td><td className="px-3 py-2">Có</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="text-2xl font-semibold">Câu hỏi thường gặp</h3>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div><p className="font-semibold text-slate-900">Tôi có thể đổi gói sau này không?</p><p>Có. Bạn có thể nâng cấp hoặc hạ cấp bất kỳ lúc nào trong cài đặt tài khoản.</p></div>
            <div><p className="font-semibold text-slate-900">Có ưu đãi cho giáo dục không?</p><p>Có, giá đặc biệt áp dụng cho trường học và tổ chức phi lợi nhuận.</p></div>
            <div><p className="font-semibold text-slate-900">Nền tảng có những biện pháp bảo mật nào?</p><p>Mã hóa AES-256, kiểm soát theo vai trò và SSO cho gói doanh nghiệp.</p></div>
          </div>
          <Link to="/resources" className="mt-5 inline-block">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">Đọc tài liệu</Button>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
