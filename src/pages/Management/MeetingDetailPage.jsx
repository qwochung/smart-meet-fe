import { Card } from '../../components/common';

const participants = ['Sarah Jenkins', 'David Chen', 'Mark Thompson', 'Linda Cao'];
const agenda = [
  'Đánh giá kết quả sprint gần nhất',
  'Thống nhất mốc cải thiện độ trễ API',
  'Chốt kế hoạch truyền thông phát hành',
];

export default function MeetingDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Đồng bộ sản phẩm hằng tuần</h1>
        <p className="mt-1 text-sm text-slate-500">10/04, 10:00 · Phòng: smart.meet/product-sync</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Người tham gia" className="lg:col-span-1">
          <ul className="space-y-2">
            {participants.map((name) => (
              <li key={name} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{name}</li>
            ))}
          </ul>
        </Card>

        <Card title="Chương trình họp" className="lg:col-span-2">
          <ol className="space-y-2 text-sm text-slate-700">
            {agenda.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 px-3 py-2">{item}</li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Bản ghi">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Bản ghi đã sẵn sàng. Có thể tích hợp widget phát lại tại đây.
          </div>
        </Card>
        <Card title="Bản ghi nội dung">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
            Đội ngũ đã chốt ưu tiên roadmap quan trọng và xác nhận thứ tự bàn giao cho Q2...
          </div>
        </Card>
      </div>
    </div>
  );
}
