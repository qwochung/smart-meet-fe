import { Link } from 'react-router-dom';
import { Activity, CalendarDays, Clock3, FilePlus2, FileText, Mic, Plus, Search, Video } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';

const upcomingMeetings = [
  { id: 'u1', title: 'Weekly Product Sync', time: 'Today, 10:00 AM', attendees: 8 },
  { id: 'u2', title: 'Design Critique', time: 'Today, 3:00 PM', attendees: 5 },
];

const recentMinutes = [
  { id: 'm1', title: 'Sprint Planning Notes', updated: '2 hours ago' },
  { id: 'm2', title: 'Client Feedback Recap', updated: 'Yesterday' },
];

const roomStatus = [
  { id: 'r1', room: 'Product Room A1', live: true, participants: 7, quality: 'Excellent', latency: '42ms' },
  { id: 'r2', room: 'Engineering War-room', live: true, participants: 12, quality: 'Good', latency: '68ms' },
  { id: 'r3', room: 'Sales Briefing', live: false, participants: 0, quality: 'Idle', latency: '-' },
];

const recentTranscripts = [
  {
    id: 't1',
    meeting: 'Design Critique',
    time: '35 mins ago',
    snippet: 'Decision: keep the simplified navigation and move advanced filters under expandable controls.',
  },
  {
    id: 't2',
    meeting: 'Client Check-in',
    time: 'Today, 09:10',
    snippet: 'Action item: prepare revised rollout timeline and share by Friday noon.',
  },
  {
    id: 't3',
    meeting: 'Engineering Standup',
    time: 'Yesterday',
    snippet: 'Risk identified on API response times under peak load, follow-up task assigned to backend team.',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Quick overview of meetings, minutes, and upcoming activities.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/meetings/new">
            <Button icon={Plus}>New meeting</Button>
          </Link>
          <Link to="/minutes">
            <Button variant="outline" icon={FilePlus2}>New minutes</Button>
          </Link>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input icon={Search} placeholder="Search meeting, minutes, participants..." />
          <Link to="/meetings" className="inline-flex">
            <Button variant="outline">Open calendar</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600"><Video className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Meetings this week</p><p className="text-2xl font-bold">12</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600"><FileText className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Minutes created</p><p className="text-2xl font-bold">28</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-600"><Clock3 className="h-5 w-5" /></span>
            <div><p className="text-sm text-slate-500">Avg. meeting length</p><p className="text-2xl font-bold">43m</p></div>
          </div>
        </Card>
      </div>

      <Card title="Today Focus">
        <div className="grid gap-3 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Next Meeting</p>
            <p className="mt-2 font-semibold text-slate-900">Weekly Product Sync</p>
            <p className="mt-1 text-sm text-slate-500">10:00 AM · Room A1</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending Minutes</p>
            <p className="mt-2 font-semibold text-slate-900">2 drafts</p>
            <p className="mt-1 text-sm text-slate-500">Need review before EOD</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Availability</p>
            <p className="mt-2 font-semibold text-slate-900">87% online</p>
            <p className="mt-1 text-sm text-slate-500">Best slot: 3:00 PM</p>
          </article>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Realtime Room Status"
          subtitle="Live room health and participant load"
          action={
            <Link to="/meetings" className="text-sm text-primary-600 hover:text-primary-700">
              Monitor all
            </Link>
          }
        >
          <div className="space-y-3">
            {roomStatus.map((room) => (
              <article key={room.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${
                        room.live ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <p className="font-medium text-slate-900">{room.room}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      room.live ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {room.live ? 'Live' : 'Offline'}
                  </span>
                </div>
                <div className="mt-2 grid gap-2 text-xs text-slate-600 sm:grid-cols-3">
                  <p>Participants: {room.participants}</p>
                  <p>Quality: {room.quality}</p>
                  <p>Latency: {room.latency}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Transcripts"
          subtitle="Latest AI-generated conversation snippets"
          action={
            <Link to="/minutes" className="text-sm text-primary-600 hover:text-primary-700">
              View transcripts
            </Link>
          }
        >
          <div className="space-y-3">
            {recentTranscripts.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{item.meeting}</p>
                  <span className="text-xs text-slate-500">{item.time}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.snippet}</p>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Open full transcript
                </button>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Upcoming Meetings" action={<Link to="/meetings" className="text-sm text-primary-600">View all</Link>}>
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <article key={meeting.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{meeting.title}</p>
                <p className="mt-1 text-sm text-slate-500">{meeting.time} · {meeting.attendees} attendees</p>
              </article>
            ))}
          </div>
        </Card>
        <Card title="Recent Minutes" action={<Link to="/minutes" className="text-sm text-primary-600">Open minutes</Link>}>
          <div className="space-y-3">
            {recentMinutes.map((minute) => (
              <article key={minute.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{minute.title}</p>
                <p className="mt-1 text-sm text-slate-500">{minute.updated}</p>
              </article>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Calendar">
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
            <Activity className="h-3.5 w-3.5 text-emerald-500" />
            Live sync enabled
          </div>
          <CalendarDays className="mx-auto mt-4 h-8 w-8 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">Calendar panel placeholder</p>
        </div>
      </Card>
    </div>
  );
}
