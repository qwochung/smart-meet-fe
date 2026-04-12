import { Download, FileText } from 'lucide-react';
import { Button, Card } from '../../components/common';

const actionItems = [
  { id: 1, task: 'Cập nhật ưu tiên backlog cho Sprint 14', owner: 'Sarah', due: '2026-04-11', priority: 'Cao' },
  { id: 2, task: 'Đánh giá kế hoạch độ trễ API với đội hạ tầng', owner: 'David', due: '2026-04-12', priority: 'Trung bình' },
  { id: 3, task: 'Chuẩn bị checklist phát hành để stakeholder duyệt', owner: 'Mark', due: '2026-04-14', priority: 'Cao' },
];

export default function MinutesDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lập kế hoạch Sprint - Đội Sản phẩm</h1>
          <p className="mt-1 text-sm text-slate-500">Chi tiết biên bản với điểm nhấn và tùy chọn xuất file.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <Download className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <FileText className="mr-2 h-4 w-4" />
            Xuất DOC
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Nội dung biên bản" subtitle="Tóm tắt theo định dạng văn bản phong phú">
          <article className="prose max-w-none prose-slate">
            <h3>Tổng kết điều hành</h3>
            <p>
              Đội ngũ đã thống nhất ưu tiên roadmap Q2, trong đó cải thiện độ trễ API là mục tiêu cao nhất trước các mốc làm mới giao diện.
              Phạm vi nâng cấp dark theme được dời lại để đảm bảo tiến độ bàn giao.
            </p>
            <h3>Những điểm thảo luận chính</h3>
            <ul>
              <li>Ngân sách hạ tầng đã được duyệt để tăng cường kiểm thử tải cao.</li>
              <li>Các mốc phát hành giữ nguyên, nhưng phân công triển khai đã được làm rõ.</li>
              <li>Phụ thuộc liên phòng ban đã được xác định rõ cho frontend và backend.</li>
            </ul>
            <h3>Nhật ký quyết định</h3>
            <p>Timeline mốc Q2 được tất cả trưởng nhóm thông qua, tiếp tục giữ nhịp checkpoint hằng tuần.</p>
          </article>
        </Card>

        <Card title="Công việc theo dõi" subtitle="Nhiệm vụ cần ưu tiên sau cuộc họp">
          <div className="space-y-3">
            {actionItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{item.task}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded bg-slate-100 px-2 py-1">Phụ trách: {item.owner}</span>
                  <span className="rounded bg-slate-100 px-2 py-1">Hạn: {item.due}</span>
                  <span className={`rounded px-2 py-1 ${item.priority === 'Cao' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.priority}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
