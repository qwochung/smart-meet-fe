import { Link } from 'react-router-dom';
import { CalendarDays, FileText, Filter, Plus, Search } from 'lucide-react';
import { Button, Card, DataTable } from '../../components/common';

const minutesData = [
  { id: 'm1', title: 'Sprint Planning - Product Team', date: '2026-04-08', status: 'Completed', summary: 'Roadmap Q2, assign owners, refine backlog.' },
  { id: 'm2', title: 'Client Demo Review', date: '2026-04-06', status: 'Draft', summary: 'Capture feedback from enterprise prospects.' },
  { id: 'm3', title: 'Engineering Weekly Sync', date: '2026-04-04', status: 'Completed', summary: 'Infra updates and release readiness check.' },
];

export default function MinutesListPage() {
  const columns = [
    { key: 'title', label: 'Meeting' },
    { key: 'date', label: 'Date', render: (row) => <span className="text-slate-600">{row.date}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {row.status}
        </span>
      ),
    },
    { key: 'summary', label: 'Quick Preview' },
    { key: 'action', label: '', render: (row) => <Link to={`/minutes/${row.id}`} className="text-primary-600 hover:text-primary-700">View</Link> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meeting Minutes</h1>
          <p className="mt-1 text-sm text-slate-500">Track, search, and export minutes from all meetings.</p>
        </div>
        <Button icon={Plus}>Create new minutes</Button>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none" placeholder="Search by meeting name..." />
          </label>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <CalendarDays className="h-4 w-4" />
            Date
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Status
          </button>
        </div>
      </Card>

      <Card title="Minutes List" subtitle="Latest meeting notes in your workspace">
        <div className="hidden md:block">
          <DataTable columns={columns} data={minutesData} />
        </div>
        <div className="space-y-3 md:hidden">
          {minutesData.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
              <Link to={`/minutes/${item.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                <FileText className="h-4 w-4" />
                Open details
              </Link>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
