import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, Card, MeetingCalendar } from '../../components/common';

const meetingEvents = [
  { id: 'm101', title: 'Đồng bộ sản phẩm hằng tuần', startAt: '2026-04-20T10:00:00', attendees: 8, status: 'Sắp diễn ra', recording: false },
  { id: 'm102', title: 'Cập nhật với khách hàng', startAt: '2026-04-21T14:00:00', attendees: 5, status: 'Sắp diễn ra', recording: false },
  { id: 'm103', title: 'Review backlog kỹ thuật', startAt: '2026-04-21T16:00:00', attendees: 6, status: 'Sắp diễn ra', recording: false },
  { id: 'm104', title: 'Đánh giá thiết kế', startAt: '2026-04-18T16:00:00', attendees: 7, status: 'Hoàn tất', recording: false },
  { id: 'm105', title: 'Họp nhanh kỹ thuật', startAt: '2026-04-17T09:00:00', attendees: 9, status: 'Hoàn tất', recording: true },
  { id: 'm106', title: 'Sprint planning', startAt: '2026-04-23T09:30:00', attendees: 10, status: 'Sắp diễn ra', recording: false },
  { id: 'm107', title: 'Demo cuối tuần', startAt: '2026-04-24T15:00:00', attendees: 11, status: 'Sắp diễn ra', recording: false },
];

const formatMeetingDate = (value) => new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value));

export default function MeetingsDashboardPage() {
  const now = new Date();
  const upcoming = meetingEvents
    .filter((meeting) => new Date(meeting.startAt) >= now)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

  const past = meetingEvents
    .filter((meeting) => new Date(meeting.startAt) < now)
    .sort((a, b) => new Date(b.startAt) - new Date(a.startAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý cuộc họp</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý cuộc họp sắp tới, đã diễn ra và thông tin chi tiết.</p>
        </div>
        <Link to="/meetings/new">
          <Button icon={Plus}>Tạo cuộc họp</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title="Cuộc họp sắp tới">
          <div className="space-y-3">
            {upcoming.map((meeting) => (
              <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                <p className="font-semibold text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">{formatMeetingDate(meeting.startAt)} · {meeting.attendees} người tham gia</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Chế độ xem lịch">
          <MeetingCalendar events={meetingEvents} />
        </Card>
      </div>

      <Card title="Cuộc họp đã diễn ra">
        <div className="space-y-3">
          {past.map((meeting) => (
            <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
              <div>
                <p className="font-semibold text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">{formatMeetingDate(meeting.startAt)}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meeting.recording ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {meeting.recording ? 'Có bản ghi' : 'Không có bản ghi'}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
