import { Download, FileText } from 'lucide-react';
import { Button, Card } from '../../components/common';

const actionItems = [
  { id: 1, task: 'Update backlog priorities for Sprint 14', owner: 'Sarah', due: '2026-04-11', priority: 'High' },
  { id: 2, task: 'Review API latency plan with infra team', owner: 'David', due: '2026-04-12', priority: 'Medium' },
  { id: 3, task: 'Prepare launch checklist for stakeholder review', owner: 'Mark', due: '2026-04-14', priority: 'High' },
];

export default function MinutesDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sprint Planning - Product Team</h1>
          <p className="mt-1 text-sm text-slate-500">Meeting minutes detail with highlights and export options.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
            <FileText className="mr-2 h-4 w-4" />
            Export DOC
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Minutes Content" subtitle="Rich-text style summary">
          <article className="prose max-w-none prose-slate">
            <h3>Executive Summary</h3>
            <p>
              Team aligned on Q2 roadmap priorities, with API latency improvements confirmed as the top objective before UI refresh milestones.
              Scope for dark theme enhancements is deferred to ensure delivery confidence.
            </p>
            <h3>Key Discussion Points</h3>
            <ul>
              <li>Infrastructure budget approved for increased load testing.</li>
              <li>Release milestones remain unchanged, but execution ownership is refined.</li>
              <li>Cross-functional dependencies were clarified for frontend and backend tracks.</li>
            </ul>
            <h3>Decision Log</h3>
            <p>Q2 milestone timeline accepted by all leads, with weekly checkpoint cadence maintained.</p>
          </article>
        </Card>

        <Card title="Action Items" subtitle="Highlighted follow-up tasks">
          <div className="space-y-3">
            {actionItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{item.task}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="rounded bg-slate-100 px-2 py-1">Owner: {item.owner}</span>
                  <span className="rounded bg-slate-100 px-2 py-1">Due: {item.due}</span>
                  <span className={`rounded px-2 py-1 ${item.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.priority}</span>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
