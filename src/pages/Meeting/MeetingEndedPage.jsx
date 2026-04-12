import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Mic, Sparkles, Users } from 'lucide-react';
import { Button, Card } from '../../components/common';

const highlights = [
  'API latency is the top follow-up item for the backend team.',
  'The release communication plan is approved for Friday.',
  'Design will finalize the control bar prototype by tomorrow.',
];

const actionItems = [
  { task: 'Update backlog priorities for Sprint 14', owner: 'Sarah Jenkins', due: '2026-04-11' },
  { task: 'Review API latency plan with infra team', owner: 'David Chen', due: '2026-04-12' },
  { task: 'Prepare release communication draft', owner: 'Mark Thompson', due: '2026-04-14' },
];

const transcriptSnippets = [
  {
    speaker: 'Sarah',
    text: 'Let us close with the release checklist and confirm owners for each follow-up.',
  },
  {
    speaker: 'David',
    text: 'I will send the latency benchmark report before noon tomorrow.',
  },
];

export default function MeetingEndedPage() {
  const { roomId = 'product-sync' } = useParams();

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 text-slate-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Meeting ended</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Weekly Sync: {roomId.replace(/-/g, ' ')}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                The meeting has finished. Review the AI-generated summary, action items, and recording before sharing with the team.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[440px]">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</p>
                <p className="mt-2 text-2xl font-bold">43m</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Participants</p>
                <p className="mt-2 text-2xl font-bold">12</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recording</p>
                <p className="mt-2 text-2xl font-bold">Ready</p>
              </article>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/meetings">
              <Button variant="outline" icon={ArrowLeft} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Back to meetings
              </Button>
            </Link>
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" icon={Download}>
              Export summary
            </Button>
            <Button icon={Sparkles}>Share AI recap</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card title="AI Summary" subtitle="Auto-generated from the conversation">
            <div className="space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  Key highlights
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Transcript snippets</p>
                <div className="mt-3 space-y-3">
                  {transcriptSnippets.map((snippet) => (
                    <div key={snippet.speaker} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">{snippet.speaker}</p>
                      <p className="mt-1 leading-relaxed">{snippet.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Action items" subtitle="Assigned follow-ups">
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <article key={item.task} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{item.task}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-2.5 py-1">Owner: {item.owner}</span>
                      <span className="rounded-full bg-white px-2.5 py-1">Due: {item.due}</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card title="Recording & notes" subtitle="Materials ready to review">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Mic className="mt-0.5 h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-slate-900">Recording available</p>
                    <p className="mt-1 text-slate-600">The session video can be replayed and shared with the workspace.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Users className="mt-0.5 h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-slate-900">Participants summary</p>
                    <p className="mt-1 text-slate-600">Attendance, join time, and room activity are captured for the summary page.</p>
                  </div>
                </div>
                <Link to={`/room/${roomId}`} className="inline-flex w-full">
                  <Button variant="outline" fullWidth className="border-slate-300 text-slate-700 hover:bg-slate-100" icon={FileText}>
                    Re-open room context
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}