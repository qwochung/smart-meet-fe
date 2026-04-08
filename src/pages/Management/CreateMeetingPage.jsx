import { Button, Card, Input } from '../../components/common';

export default function CreateMeetingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Meeting</h1>
        <p className="mt-1 text-sm text-slate-500">Set agenda, participants, and schedule.</p>
      </div>

      <Card>
        <form className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input label="Meeting title" placeholder="Weekly Product Sync" />
          </div>
          <Input label="Date" type="date" />
          <Input label="Time" type="time" />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Agenda</label>
            <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" rows={5} placeholder="Enter meeting agenda..." />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>Create meeting</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
