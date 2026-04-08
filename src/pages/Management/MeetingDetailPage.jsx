import { Card } from '../../components/common';

const participants = ['Sarah Jenkins', 'David Chen', 'Mark Thompson', 'Linda Cao'];
const agenda = [
  'Review last sprint outcomes',
  'Align API latency milestones',
  'Confirm release communication plan',
];

export default function MeetingDetailPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Weekly Product Sync</h1>
        <p className="mt-1 text-sm text-slate-500">Apr 10, 10:00 AM · Room: smart.meet/product-sync</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Participants" className="lg:col-span-1">
          <ul className="space-y-2">
            {participants.map((name) => (
              <li key={name} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{name}</li>
            ))}
          </ul>
        </Card>

        <Card title="Agenda" className="lg:col-span-2">
          <ol className="space-y-2 text-sm text-slate-700">
            {agenda.map((item) => (
              <li key={item} className="rounded-lg border border-slate-200 px-3 py-2">{item}</li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recording">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            Recording is available. Playback widget can be integrated here.
          </div>
        </Card>
        <Card title="Transcript">
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
            We finalized key roadmap priorities and confirmed delivery sequence for Q2...
          </div>
        </Card>
      </div>
    </div>
  );
}
