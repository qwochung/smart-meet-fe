import { Link } from "react-router-dom";
import {
  Clock3,
  FilePlus2,
  FileText,
  Mic,
  Plus,
  Search,
  Video,
} from "lucide-react";
import { Button, Card, Input, MeetingCalendar } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";

const upcomingMeetings = [
  {
    id: "u1",
    title: "Đồng bộ sản phẩm hằng tuần",
    time: "Hôm nay, 10:00",
    attendees: 8,
  },
  {
    id: "u2",
    title: "Đánh giá thiết kế",
    time: "Hôm nay, 15:00",
    attendees: 5,
  },
];

const recentMinutes = [
  { id: "m1", title: "Ghi chú lập kế hoạch Sprint", updated: "2 giờ trước" },
  { id: "m2", title: "Tổng hợp phản hồi khách hàng", updated: "Hôm qua" },
];

const roomStatus = [
  {
    id: "r1",
    room: "Phòng sản phẩm A1",
    live: true,
    participants: 7,
    quality: "Xuất sắc",
    latency: "42ms",
  },
  {
    id: "r2",
    room: "Phòng kỹ thuật",
    live: true,
    participants: 12,
    quality: "Tốt",
    latency: "68ms",
  },
  {
    id: "r3",
    room: "Họp nhanh kinh doanh",
    live: false,
    participants: 0,
    quality: "Nhàn rỗi",
    latency: "-",
  },
];

const recentTranscripts = [
  {
    id: "t1",
    meeting: "Đánh giá thiết kế",
    time: "35 phút trước",
    snippet:
      "Quyết định: giữ điều hướng tối giản và đưa bộ lọc nâng cao vào khu vực mở rộng.",
  },
  {
    id: "t2",
    meeting: "Cập nhật với khách hàng",
    time: "Hôm nay, 09:10",
    snippet:
      "Công việc cần làm: chuẩn bị lại timeline triển khai và chia sẻ trước trưa thứ Sáu.",
  },
  {
    id: "t3",
    meeting: "Họp nhanh kỹ thuật",
    time: "Hôm qua",
    snippet:
      "Đã phát hiện rủi ro độ trễ API khi tải cao, nhiệm vụ theo dõi đã giao cho đội backend.",
  },
];

const weeklyMeetingTrend = [
  { day: "T2", meetings: 3, duration: 110 },
  { day: "T3", meetings: 4, duration: 148 },
  { day: "T4", meetings: 2, duration: 84 },
  { day: "T5", meetings: 5, duration: 190 },
  { day: "T6", meetings: 4, duration: 162 },
  { day: "T7", meetings: 1, duration: 36 },
  { day: "CN", meetings: 2, duration: 72 },
];

const connectionQualityByHour = [
  { slot: "08:00-10:00", excellent: 64, good: 27, unstable: 9 },
  { slot: "10:00-12:00", excellent: 58, good: 31, unstable: 11 },
  { slot: "13:00-15:00", excellent: 71, good: 22, unstable: 7 },
  { slot: "15:00-17:00", excellent: 66, good: 26, unstable: 8 },
];

const minutesPipeline = [
  { stage: "Cuộc họp đã kết thúc", completed: 42, total: 42 },
  { stage: "AI phiên âm hoàn tất", completed: 40, total: 42 },
  { stage: "Rút trích quyết định", completed: 36, total: 42 },
  { stage: "Sinh biên bản bản nháp", completed: 33, total: 42 },
  { stage: "Duyệt và phát hành", completed: 29, total: 42 },
];

const calendarEvents = [
  { id: "m101", title: "Đồng bộ sản phẩm hằng tuần", startAt: "2026-04-20T10:00:00", attendees: 8, status: "Sắp diễn ra" },
  { id: "m102", title: "Đánh giá thiết kế", startAt: "2026-04-20T15:00:00", attendees: 5, status: "Sắp diễn ra" },
  { id: "m103", title: "Cập nhật với khách hàng", startAt: "2026-04-21T14:00:00", attendees: 6, status: "Sắp diễn ra" },
  { id: "m104", title: "Sprint planning", startAt: "2026-04-23T09:30:00", attendees: 10, status: "Sắp diễn ra" },
  { id: "m105", title: "Demo cuối tuần", startAt: "2026-04-24T15:00:00", attendees: 11, status: "Sắp diễn ra" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const maxMeetingCount = Math.max(
    ...weeklyMeetingTrend.map((item) => item.meetings),
  );
  const trendPoints = weeklyMeetingTrend
    .map((item, index) => {
      const x = (index / (weeklyMeetingTrend.length - 1)) * 100;
      const y = 90 - (item.meetings / maxMeetingCount) * 70;
      return `${x},${y}`;
    })
    .join(" ");
  const minutesDone = minutesPipeline[minutesPipeline.length - 1].completed;
  const minutesTotal = minutesPipeline[0].total;
  const minutesCompletionRate = Math.round((minutesDone / minutesTotal) * 100);
  const gaugeDegree = Math.round((minutesCompletionRate / 100) * 360);
  const minutesGauge = `conic-gradient(rgb(37 99 235) 0deg ${gaugeDegree}deg, rgb(226 232 240) ${gaugeDegree}deg 360deg)`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {user?.name ? `Chào mừng, ${user.name}` : "Tổng quan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Xem nhanh cuộc họp, biên bản và các hoạt động sắp tới.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/join">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Tham gia họp
            </Button>
          </Link>
          <Link to="/meetings/new">
            <Button icon={Plus}>Tạo cuộc họp</Button>
          </Link>
          <Link to="/minutes">
            <Button variant="outline" icon={FilePlus2}>
              Tạo biên bản
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            icon={Search}
            placeholder="Tìm cuộc họp, biên bản, người tham gia..."
          />
          <Link to="/meetings" className="inline-flex">
            <Button variant="outline">Mở lịch</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600">
              <Video className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Cuộc họp tuần này</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Biên bản đã tạo</p>
              <p className="text-2xl font-bold">28</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-slate-500">
                Thời lượng họp trung bình
              </p>
              <p className="text-2xl font-bold">43m</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Xu hướng cuộc họp trong tuần"
          subtitle="Số phiên họp đã diễn ra theo từng ngày"
          className="lg:col-span-2"
        >
          <div className="space-y-3">
            <div className="relative h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-3">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="h-full w-full overflow-visible"
              >
                <polyline
                  points={trendPoints}
                  fill="none"
                  stroke="rgb(37 99 235)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs text-slate-600">
              {weeklyMeetingTrend.map((item) => (
                <div
                  key={item.day}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center"
                >
                  <p className="font-semibold text-slate-700">{item.day}</p>
                  <p className="mt-1 text-slate-500">
                    {item.meetings} cuộc họp
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Chất lượng kết nối theo khung giờ"
          subtitle="Phân bố ổn định đường truyền trong ngày"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {connectionQualityByHour.map((item) => (
                <div key={item.slot} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700">
                      {item.slot}
                    </span>
                    <span>Không ổn định: {item.unstable}%</span>
                  </div>
                  <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-emerald-500"
                      style={{ width: `${item.excellent}%` }}
                      aria-hidden="true"
                    />
                    <div
                      className="bg-amber-400"
                      style={{ width: `${item.good}%` }}
                      aria-hidden="true"
                    />
                    <div
                      className="bg-rose-500"
                      style={{ width: `${item.unstable}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Ổn định cao
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Trung bình
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Không ổn định
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Hiệu suất sinh biên bản tự động"
        subtitle="Từ lúc kết thúc họp đến lúc phát hành biên bản"
      >
        <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
          <div
            className="mx-auto h-40 w-40 rounded-full p-3"
            style={{ background: minutesGauge }}
          >
            <div className="flex h-full items-center justify-center rounded-full bg-white text-center">
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {minutesCompletionRate}%
                </p>
                <p className="text-xs text-slate-500">Biên bản đã phát hành</p>
                <p className="mt-1 text-xs font-medium text-slate-700">
                  {minutesDone}/{minutesTotal} cuộc họp
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {minutesPipeline.map((item) => {
              const percentage = Math.round(
                (item.completed / item.total) * 100,
              );
              return (
                <article
                  key={item.stage}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {item.stage}
                    </p>
                    <span className="text-xs font-semibold text-slate-700">
                      {item.completed}/{item.total}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${percentage}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Trọng tâm hôm nay">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Cuộc họp tiếp theo
            </p>
            <p className="mt-2 font-semibold text-slate-900">
              Đồng bộ sản phẩm hằng tuần
            </p>
            <p className="mt-1 text-sm text-slate-500">10:00 · Phòng A1</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Biên bản chờ xử lý
            </p>
            <p className="mt-2 font-semibold text-slate-900">2 bản nháp</p>
            <p className="mt-1 text-sm text-slate-500">
              Cần duyệt trước cuối ngày
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mức sẵn sàng của đội
            </p>
            <p className="mt-2 font-semibold text-slate-900">87% đang online</p>
            <p className="mt-1 text-sm text-slate-500">
              Khung giờ tốt nhất: 15:00
            </p>
          </article>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Trạng thái phòng theo thời gian thực"
          subtitle="Sức khỏe phòng họp và tải người tham gia"
          action={
            <Link
              to="/meetings"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Theo dõi tất cả
            </Link>
          }
        >
          <div className="space-y-3">
            {roomStatus.map((room) => (
              <article
                key={room.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        room.live ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <p className="font-medium text-slate-900">{room.room}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      room.live
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {room.live ? "Đang trực tiếp" : "Ngoại tuyến"}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                  <p>Người tham gia: {room.participants}</p>
                  <p>Chất lượng: {room.quality}</p>
                  <p>Độ trễ: {room.latency}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card
          title="Bản ghi gần đây"
          subtitle="Trích đoạn hội thoại mới nhất do AI tạo"
          action={
            <Link
              to="/minutes"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Xem bản ghi
            </Link>
          }
        >
          <div className="space-y-3">
            {recentTranscripts.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.meeting}</p>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.snippet}
                </p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Mở bản ghi đầy đủ
                </button>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Cuộc họp sắp tới"
          action={
            <Link to="/meetings" className="text-sm text-primary-600">
              Xem tất cả
            </Link>
          }
        >
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <article
                key={meeting.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="font-medium text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {meeting.time} · {meeting.attendees} người tham gia
                </p>
              </article>
            ))}
          </div>
        </Card>
        <Card
          title="Biên bản gần đây"
          action={
            <Link to="/minutes" className="text-sm text-primary-600">
              Mở biên bản
            </Link>
          }
        >
          <div className="space-y-3">
            {recentMinutes.map((minute) => (
              <article
                key={minute.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="font-medium text-slate-900">{minute.title}</p>
                <p className="mt-1 text-sm text-slate-500">{minute.updated}</p>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Lịch">
        <MeetingCalendar events={calendarEvents} compact />
      </Card>
    </div>
  );
}
