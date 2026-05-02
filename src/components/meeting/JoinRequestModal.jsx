import { Check, X } from 'lucide-react';

export default function JoinRequestModal({ request, onAccept, onReject }) {
  if (!request) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl shadow-slate-950/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">Join request</p>
            <h2 className="mt-2 text-2xl font-semibold">{request.userName || 'Someone'} wants to join</h2>
            <p className="mt-2 text-sm text-slate-300">Review the request before allowing the participant into the LiveKit room.</p>
          </div>
          <button
            type="button"
            onClick={onReject}
            className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
            aria-label="Close request"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sky-300">
            {(request.userName || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-white">{request.userName || 'Unknown user'}</p>
            <p className="text-xs text-slate-400">User ID: {request.userId ?? 'n/a'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onReject}
            className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}