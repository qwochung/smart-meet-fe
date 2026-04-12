import { Link } from 'react-router-dom';
import { CalendarRange, Plus } from 'lucide-react';
import { Button, Card } from '../../components/common';

const upcoming = [
  { id: 'u1', title: 'Weekly Product Sync', date: 'Apr 10, 10:00', attendees: 8 },
  { id: 'u2', title: 'Client Check-in', date: 'Apr 11, 14:00', attendees: 5 },
];

const past = [
  { id: 'p1', title: 'Engineering Standup', date: 'Apr 08, 09:00', recording: true },
  { id: 'p2', title: 'Design Review', date: 'Apr 07, 16:00', recording: false },
];

export default function MeetingsDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meeting Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage upcoming, past, and detailed meeting information.</p>
        </div>
        <Link to="/meetings/new">
          <Button icon={Plus}>Create Meeting</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title="Upcoming Meetings">
          <div className="space-y-3">
            {upcoming.map((meeting) => (
              <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                <p className="font-semibold text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">{meeting.date} · {meeting.attendees} participants</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Calendar View">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <CalendarRange className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm text-slate-600">Calendar widget placeholder</p>
          </div>
        </Card>
      </div>

      <Card title="Past Meetings">
        <div className="space-y-3">
          {past.map((meeting) => (
            <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
              <div>
                <p className="font-semibold text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">{meeting.date}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${meeting.recording ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {meeting.recording ? 'Recording' : 'No recording'}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
