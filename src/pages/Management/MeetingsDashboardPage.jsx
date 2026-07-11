import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Repeat } from 'lucide-react';
import { Button, Card, MeetingCalendar } from '../../components/common';
import { roomService } from '../../services/roomService';

const STATUS_BADGE = {
  ACTIVE: { label: 'Đang diễn ra', className: 'bg-emerald-50 text-emerald-700' },
  WAITING: { label: 'Đã lên lịch', className: 'bg-amber-50 text-amber-700' },
  ENDED: { label: 'Đã kết thúc', className: 'bg-slate-100 text-slate-600' },
};

const formatMeetingDate = (value) => {
  if (!value) return 'Chưa lên lịch';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa lên lịch';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const startOf = (meeting) => meeting.scheduledAt || meeting.expiresAt;

const LIST_PAGE_SIZE = 5;

function ListPager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onChange(Math.max(0, page - 1))}
        className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Trước
      </button>
      <span className="text-sm text-slate-500">
        {page + 1}/{totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sau
      </button>
    </div>
  );
}

export default function MeetingsDashboardPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingPage, setUpcomingPage] = useState(0);
  const [pastPage, setPastPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchMeetings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy tối đa 100 cuộc họp gần nhất để dựng lịch; danh sách bên dưới phân trang client-side
        const response = await roomService.getRoomMinutes({ page: 0, size: 100 });
        const payload = response?.data ?? response ?? {};
        const data = Array.isArray(payload) ? payload : payload.items || [];
        if (!cancelled) {
          setMeetings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching meetings:', err);
        if (!cancelled) {
          setError('Không tải được danh sách cuộc họp. Vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchMeetings();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      meetings
        .filter((m) => m.status === 'WAITING' || m.status === 'ACTIVE')
        .sort((a, b) => new Date(startOf(a)) - new Date(startOf(b))),
    [meetings],
  );

  const past = useMemo(
    () =>
      meetings
        .filter((m) => m.status === 'ENDED')
        .sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt)),
    [meetings],
  );

  const upcomingTotalPages = Math.ceil(upcoming.length / LIST_PAGE_SIZE);
  const pastTotalPages = Math.ceil(past.length / LIST_PAGE_SIZE);
  const upcomingVisible = useMemo(
    () => upcoming.slice(upcomingPage * LIST_PAGE_SIZE, (upcomingPage + 1) * LIST_PAGE_SIZE),
    [upcoming, upcomingPage],
  );
  const pastVisible = useMemo(
    () => past.slice(pastPage * LIST_PAGE_SIZE, (pastPage + 1) * LIST_PAGE_SIZE),
    [past, pastPage],
  );

  const calendarEvents = useMemo(
    () =>
      meetings.map((m) => ({
        id: m.roomCode,
        title: m.name,
        startAt: startOf(m),
        attendees: 0,
        status: STATUS_BADGE[m.status]?.label ?? m.status,
      })),
    [meetings],
  );

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

      {error && (
        <Card>
          <p className="text-sm text-rose-600">{error}</p>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title="Cuộc họp sắp tới" subtitle={`${upcoming.length} cuộc họp`}>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {loading ? 'Đang tải...' : 'Không có cuộc họp sắp tới.'}
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingVisible.map((meeting) => {
                const badge = STATUS_BADGE[meeting.status] ?? {
                  label: meeting.status,
                  className: 'bg-slate-100 text-slate-600',
                };
                return (
                  <Link
                    key={meeting.roomCode}
                    to={`/meetings/${meeting.roomCode}`}
                    className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{meeting.name}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{formatMeetingDate(startOf(meeting))}</p>
                    {meeting.recurrenceRule && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                        <Repeat className="h-3 w-3" />
                        {meeting.recurrenceRule}
                      </span>
                    )}
                  </Link>
                );
              })}
              <ListPager
                page={upcomingPage}
                totalPages={upcomingTotalPages}
                onChange={setUpcomingPage}
              />
            </div>
          )}
        </Card>

        <Card title="Chế độ xem lịch">
          <MeetingCalendar events={calendarEvents} />
        </Card>
      </div>

      <Card title="Cuộc họp đã diễn ra" subtitle={`${past.length} cuộc họp`}>
        {past.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">
            {loading ? 'Đang tải...' : 'Chưa có cuộc họp nào đã diễn ra.'}
          </p>
        ) : (
          <div className="space-y-3">
            {pastVisible.map((meeting) => (
              <Link
                key={meeting.roomCode}
                to={`/meetings/${meeting.roomCode}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
              >
                <div>
                  <p className="font-semibold text-slate-900">{meeting.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatMeetingDate(meeting.expiresAt)}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Đã kết thúc
                </span>
              </Link>
            ))}
            <ListPager page={pastPage} totalPages={pastTotalPages} onChange={setPastPage} />
          </div>
        )}
      </Card>
    </div>
  );
}
