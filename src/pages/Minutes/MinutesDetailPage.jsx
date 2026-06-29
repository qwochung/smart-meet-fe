import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common';
import MeetingMinutesEditor from '../../components/meeting/MeetingMinutesEditor';

export default function MinutesDetailPage() {
  const { roomCode } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chi tiết biên bản</h1>
          <p className="mt-1 text-sm text-slate-500">Xem, chỉnh sửa và xuất biên bản cuộc họp.</p>
        </div>
        <Link to="/minutes">
          <Button variant="outline" icon={ArrowLeft} className="border-slate-300 text-slate-700 hover:bg-slate-100">
            Danh sách biên bản
          </Button>
        </Link>
      </div>

      <MeetingMinutesEditor roomCode={roomCode} />
    </div>
  );
}
