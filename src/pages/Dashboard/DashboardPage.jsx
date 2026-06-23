import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  FilePlus2,
  FileText,
  Plus,
  Repeat,
  Search,
  Video,
  Radio,
} from "lucide-react";
import { Button, Card, Input, MeetingCalendar } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";
import { roomService } from "../../services/roomService";

const STATUS_BADGE = {
  ACTIVE: { label: "Đang diễn ra", className: "bg-emerald-50 text-emerald-700" },
  WAITING: { label: "Đang chờ", className: "bg-amber-50 text-amber-700" },
  ENDED: { label: "Đã kết thúc", className: "bg-slate-100 text-slate-600" },
};

function formatDateTime(value) {
  if (!value) return "Chưa lên lịch";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa lên lịch";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN");
}

const EMPTY_DASHBOARD = {
  stats: {
    totalMeetings: 0,
    meetingsThisWeek: 0,
    minutesCreated: 0,
    activeRooms: 0,
    waitingRooms: 0,
  },
  weeklyTrend: [],
  hourlyDistribution: [],
  upcomingMeetings: [],
  recentMinutes: [],
  roomStatus: [],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD);
  const [allMeetings, setAllMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, meetingsRes] = await Promise.all([
          roomService.getDashboard(),
          roomService.getRoomMinutes({}),
        ]);
        const data = dashboardRes?.data ?? dashboardRes ?? {};
        const meetings = Array.isArray(meetingsRes)
          ? meetingsRes
          : meetingsRes?.data ?? [];
        if (!cancelled) {
          setDashboard({ ...EMPTY_DASHBOARD, ...data });
          setAllMeetings(Array.isArray(meetings) ? meetings : []);
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        if (!cancelled) {
          setError("Không tải được dữ liệu tổng quan. Vui lòng thử lại.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    stats,
    weeklyTrend,
    hourlyDistribution,
    upcomingMeetings,
    recentMinutes,
    roomStatus,
  } = dashboard;

  const maxMeetingCount = useMemo(
    () => Math.max(1, ...weeklyTrend.map((item) => item.meetings)),
    [weeklyTrend],
  );

  // Đường gấp khúc + vùng tô cho biểu đồ xu hướng (toạ độ pixel trong khung 620x220)
  const trend = useMemo(() => {
    const W = 620;
    const H = 220;
    const padX = 24;
    const padTop = 24;
    const padBottom = 36;
    if (weeklyTrend.length < 2) {
      return { line: "", area: "", dots: [], W, H, gridY: [] };
    }
    const innerW = W - padX * 2;
    const innerH = H - padTop - padBottom;
    const coords = weeklyTrend.map((item, index) => {
      const x = padX + (index / (weeklyTrend.length - 1)) * innerW;
      const y = padTop + (1 - item.meetings / maxMeetingCount) * innerH;
      return { x, y, value: item.meetings, day: item.day };
    });
    const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const baseY = padTop + innerH;
    const area = `${padX},${baseY} ${line} ${W - padX},${baseY}`;
    const gridY = [0, 0.5, 1].map((t) => padTop + t * innerH);
    return { line, area, dots: coords, W, H, gridY };
  }, [weeklyTrend, maxMeetingCount]);

  // Phân bố trạng thái phòng cho biểu đồ tròn (donut)
  const statusSegments = useMemo(() => {
    const segments = [
      { key: "active", label: "Đang hoạt động", value: stats.activeRooms, color: "#10b981" },
      { key: "waiting", label: "Đã lên lịch", value: stats.waitingRooms, color: "#f59e0b" },
      { key: "ended", label: "Đã kết thúc", value: stats.minutesCreated, color: "#3b82f6" },
    ];
    const total = segments.reduce((sum, s) => sum + s.value, 0);
    let offset = 0;
    const withArc = segments.map((s) => {
      const fraction = total > 0 ? s.value / total : 0;
      const arc = { ...s, fraction, dash: fraction * 100, offset };
      offset += fraction * 100;
      return arc;
    });
    return { segments: withArc, total };
  }, [stats]);

  const maxHourCount = useMemo(
    () => Math.max(1, ...hourlyDistribution.map((item) => item.meetings)),
    [hourlyDistribution],
  );

  // Lịch lấy toàn bộ cuộc họp (cả đã diễn ra lẫn sắp tới) để hiển thị đầy đủ
  const calendarEvents = useMemo(() => {
    const source = allMeetings.length > 0 ? allMeetings : upcomingMeetings;
    return source.map((meeting) => ({
      id: meeting.roomCode,
      title: meeting.name,
      startAt: meeting.scheduledAt || meeting.expiresAt,
      attendees: meeting.participants ?? 0,
      status: STATUS_BADGE[meeting.status]?.label ?? meeting.status,
    }));
  }, [allMeetings, upcomingMeetings]);

  const statCards = [
    {
      label: "Cuộc họp tuần này",
      value: stats.meetingsThisWeek,
      icon: Video,
    },
    {
      label: "Tổng số cuộc họp",
      value: stats.totalMeetings,
      icon: Clock3,
    },
    {
      label: "Biên bản đã tạo",
      value: stats.minutesCreated,
      icon: FileText,
    },
    {
      label: "Phòng đang hoạt động",
      value: stats.activeRooms,
      icon: Radio,
    },
  ];

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

      {error && (
        <Card>
          <p className="text-sm text-rose-600">{error}</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary-50 p-2 text-primary-600">
                <card.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="text-2xl font-bold">
                  {loading ? "—" : card.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card
          title="Xu hướng cuộc họp trong tuần"
          subtitle="Số phiên họp được tạo theo từng ngày trong tuần này"
          className="lg:col-span-2"
        >
          {weeklyTrend.length < 2 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              {loading ? "Đang tải..." : "Chưa có đủ dữ liệu để vẽ biểu đồ."}
            </p>
          ) : (
            <svg
              viewBox={`0 0 ${trend.W} ${trend.H}`}
              className="h-56 w-full"
              role="img"
              aria-label="Biểu đồ xu hướng cuộc họp trong tuần"
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {trend.gridY.map((y, i) => (
                <line
                  key={i}
                  x1="24"
                  x2={trend.W - 24}
                  y1={y}
                  y2={y}
                  stroke="rgb(226 232 240)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              <polygon points={trend.area} fill="url(#trendFill)" />
              <polyline
                points={trend.line}
                fill="none"
                stroke="rgb(37 99 235)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {trend.dots.map((dot) => (
                <g key={dot.day}>
                  <circle cx={dot.x} cy={dot.y} r="4.5" fill="white" stroke="rgb(37 99 235)" strokeWidth="2.4" />
                  {dot.value > 0 && (
                    <text x={dot.x} y={dot.y - 10} textAnchor="middle" className="fill-slate-600" fontSize="12" fontWeight="600">
                      {dot.value}
                    </text>
                  )}
                  <text x={dot.x} y={trend.H - 12} textAnchor="middle" className="fill-slate-400" fontSize="12">
                    {dot.day}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </Card>

        <Card
          title="Phân bố trạng thái phòng"
          subtitle="Tỷ lệ phòng theo trạng thái"
        >
          {statusSegments.total === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              {loading ? "Đang tải..." : "Chưa có dữ liệu."}
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-44 w-44">
                <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                  <circle cx="21" cy="21" r="15.915" fill="none" stroke="rgb(241 245 249)" strokeWidth="6" />
                  {statusSegments.segments.map((s) =>
                    s.dash > 0 ? (
                      <circle
                        key={s.key}
                        cx="21"
                        cy="21"
                        r="15.915"
                        fill="none"
                        stroke={s.color}
                        strokeWidth="6"
                        strokeDasharray={`${s.dash} ${100 - s.dash}`}
                        strokeDashoffset={-s.offset}
                        strokeLinecap="butt"
                      />
                    ) : null,
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">
                    {statusSegments.total}
                  </span>
                  <span className="text-xs text-slate-500">phòng</span>
                </div>
              </div>
              <div className="w-full space-y-1.5">
                {statusSegments.segments.map((s) => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between text-xs text-slate-600"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {s.value} ({Math.round(s.fraction * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card
        title="Cuộc họp theo khung giờ"
        subtitle="Phân bố thời điểm các cuộc họp được tạo trong ngày"
      >
        {hourlyDistribution.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            {loading ? "Đang tải..." : "Chưa có dữ liệu."}
          </p>
        ) : (
          <div className="flex items-end justify-between gap-3 pt-2">
            {hourlyDistribution.map((bucket) => {
              const heightPct = Math.round((bucket.meetings / maxHourCount) * 100);
              return (
                <div
                  key={bucket.label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold text-slate-600">
                    {bucket.meetings}
                  </span>
                  <div className="flex h-36 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-300 transition-all"
                      style={{ height: `${Math.max(heightPct, 3)}%` }}
                      title={`${bucket.label}: ${bucket.meetings} cuộc họp`}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{bucket.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Trạng thái phòng theo thời gian thực"
          subtitle="Các phòng đang trực tiếp và số người tham gia"
          action={
            <Link
              to="/meetings"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Theo dõi tất cả
            </Link>
          }
        >
          {roomStatus.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {loading ? "Đang tải..." : "Không có phòng nào đang hoạt động."}
            </p>
          ) : (
            <div className="space-y-3">
              {roomStatus.map((room) => (
                <article
                  key={room.roomCode}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <p className="font-medium text-slate-900">{room.name}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Đang trực tiếp
                    </span>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <p>Mã phòng: {room.roomCode}</p>
                    <p>Người tham gia: {room.participants}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card
          title="Biên bản gần đây"
          subtitle="Các cuộc họp đã kết thúc gần đây"
          action={
            <Link
              to="/minutes"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Xem biên bản
            </Link>
          }
        >
          {recentMinutes.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {loading ? "Đang tải..." : "Chưa có biên bản nào."}
            </p>
          ) : (
            <div className="space-y-3">
              {recentMinutes.map((item) => (
                <Link
                  key={item.roomCode}
                  to={`/minutes/${item.roomCode}/summary`}
                  className="block rounded-lg border border-slate-200 p-4 transition hover:border-primary-300 hover:bg-primary-50/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.expiresAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Mã phòng: {item.roomCode}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card
        title="Cuộc họp sắp tới"
        subtitle="Các phòng đang chờ hoặc đang diễn ra"
        action={
          <Link to="/meetings" className="text-sm text-primary-600">
            Xem tất cả
          </Link>
        }
      >
        {upcomingMeetings.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            {loading ? "Đang tải..." : "Không có cuộc họp sắp tới."}
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingMeetings.map((meeting) => {
              const badge = STATUS_BADGE[meeting.status] ?? {
                label: meeting.status,
                className: "bg-slate-100 text-slate-600",
              };
              return (
                <article
                  key={meeting.roomCode}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{meeting.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDateTime(meeting.scheduledAt || meeting.expiresAt)} ·{" "}
                    {meeting.participants ?? 0} người tham gia
                  </p>
                  {meeting.recurrenceRule && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                      <Repeat className="h-3 w-3" />
                      {meeting.recurrenceRule}
                    </span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Lịch">
        <MeetingCalendar events={calendarEvents} compact />
      </Card>
    </div>
  );
}
