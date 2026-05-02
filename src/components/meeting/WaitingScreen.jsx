import { LoaderCircle, Video, VideoOff } from 'lucide-react';

export default function WaitingScreen({ roomCode, roomName, status = 'Waiting for host approval...' }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <LoaderCircle className="h-10 w-10 animate-spin" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">Waiting for host approval...</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{status}</p>

          <div className="mt-8 grid w-full gap-4 rounded-3xl bg-slate-50 p-5 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Room code</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{roomCode || '-'}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Room</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{roomName || 'Pending room'}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <Video className="h-4 w-4 text-sky-500" />
              LiveKit will start automatically
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <VideoOff className="h-4 w-4 text-slate-500" />
              Camera stays off until approved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}