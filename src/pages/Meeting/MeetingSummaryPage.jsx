import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button, Card, Header } from '../../components/common';
import { transcriptService } from '../../services/transcriptService';
import MeetingMinutesEditor from '../../components/meeting/MeetingMinutesEditor';

export default function MeetingSummaryPage() {
  const { roomCode = 'product-sync' } = useParams();
  const [finalTranscript, setFinalTranscript] = useState(null);
  const [finalizeStatus, setFinalizeStatus] = useState('PROCESSING');

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    const pollFinal = async () => {
      try {
        const data = await transcriptService.getFinalTranscript(roomCode);
        if (cancelled) return;
        setFinalTranscript(data);
        if (data?.status === 'FINAL' || data?.status === 'FAILED') {
          setFinalizeStatus(data.status);
          return;
        }
        if (!cancelled) {
          timerId = setTimeout(pollFinal, 2000);
        }
      } catch (err) {
        console.warn('[Summary] poll final transcript failed:', err);
        if (!cancelled) {
          timerId = setTimeout(pollFinal, 2000);
        }
      }
    };

    const start = async () => {
      try {
        // Mở lại trang mà biên bản đã FINAL/FAILED rồi thì khỏi gọi finalize lại
        const current = await transcriptService.getFinalTranscript(roomCode);
        if (cancelled) return;
        setFinalTranscript(current);
        if (current?.status === 'FINAL' || current?.status === 'FAILED') {
          setFinalizeStatus(current.status);
          return;
        }
        await transcriptService.finalizeTranscript(roomCode);
      } catch (err) {
        console.warn('[Summary] finalize transcript failed:', err);
      }
      if (!cancelled) {
        await pollFinal();
      }
    };

    start();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [roomCode]);

  const transcriptSegments = Array.isArray(finalTranscript?.segments) ? finalTranscript.segments : [];

  return (
    <>
      <Header variant="app" fixed />
      <div className="min-h-full bg-slate-50 px-4 py-6 text-slate-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
                Cuộc họp đã kết thúc
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
                Biên bản: {roomCode.replace(/-/g, ' ')}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Xem lại tóm tắt AI, chỉnh sửa nếu cần và xuất biên bản (PDF hoặc DOCX) để chia sẻ cho đội ngũ.
              </p>
            </div>
            <Link to="/minutes">
              <Button variant="outline" icon={ArrowLeft} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Danh sách biên bản
              </Button>
            </Link>
          </div>
        </div>

        {finalizeStatus === 'PROCESSING' && (
          <Card>
            <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
              <svg className="h-6 w-6 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang xử lý biên bản cuối cuộc họp...
            </div>
          </Card>
        )}

        {finalizeStatus === 'FAILED' && (
          <Card>
            <p className="py-8 text-center text-sm text-rose-600">
              Không thể tạo biên bản cho cuộc họp này. Vui lòng thử lại sau.
            </p>
          </Card>
        )}

        {finalizeStatus === 'FINAL' && (
          <>
            <MeetingMinutesEditor roomCode={roomCode} />

            <Card title="Bản ghi đã merge" subtitle="Nội dung hội thoại được ghi lại">
              <div className="space-y-3">
                {transcriptSegments.length === 0 ? (
                  <p className="text-sm text-slate-500">Chưa có nội dung biên bản.</p>
                ) : (
                  transcriptSegments.map((segment) => (
                    <div
                      key={`${segment.orderIndex}-${segment.sourceChunkId}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                    >
                      <p className="font-semibold text-slate-900">
                        {segment.participantName || segment.participantId}
                      </p>
                      <p className="mt-1 leading-relaxed">{segment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Link to={`/room/${roomCode}`} className="inline-flex">
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" icon={FileText}>
                Mở lại bối cảnh phòng họp
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
    </>
  );
}
