import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Mic, Sparkles, Users } from 'lucide-react';
import { Button, Card } from '../../components/common';
import { transcriptService } from '../../services/transcriptService';

const highlights = [
  'Độ trễ API là hạng mục ưu tiên theo dõi hàng đầu cho đội backend.',
  'Kế hoạch truyền thông phát hành đã được thông qua cho thứ Sáu.',
  'Đội thiết kế sẽ chốt mẫu thanh điều khiển trước ngày mai.',
];

const actionItems = [
  { task: 'Cập nhật ưu tiên backlog cho Sprint 14', owner: 'Sarah Jenkins', due: '2026-04-11' },
  { task: 'Đánh giá kế hoạch độ trễ API với đội hạ tầng', owner: 'David Chen', due: '2026-04-12' },
  { task: 'Chuẩn bị bản nháp truyền thông phát hành', owner: 'Mark Thompson', due: '2026-04-14' },
];

export default function MeetingSummaryPage() {
  const { roomCode = 'product-sync' } = useParams();
  const [finalTranscript, setFinalTranscript] = useState(null);
  const [finalizeStatus, setFinalizeStatus] = useState('PROCESSING');
  const [exporting, setExporting] = useState(false);

  const handleDownloadPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const blob = await transcriptService.downloadPdfSummary(roomCode);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Meeting_Minutes_${roomCode}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Tải file PDF thất bại:', err);
      alert('Không thể tải báo cáo PDF. Vui lòng thử lại sau.');
    } finally {
      setExporting(false);
    }
  };

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

  const transcriptSegments = Array.isArray(finalTranscript?.segments)
    ? finalTranscript.segments
    : [];

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 text-slate-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Cuộc họp đã kết thúc</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Đồng bộ hằng tuần: {roomCode.replace(/-/g, ' ')}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Cuộc họp đã kết thúc. Xem lại tóm tắt AI, công việc theo dõi và bản ghi trước khi chia sẻ cho đội ngũ.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[440px]">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Thời lượng</p>
                <p className="mt-2 text-2xl font-bold">43m</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Người tham gia</p>
                <p className="mt-2 text-2xl font-bold">12</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bản ghi</p>
                <p className="mt-2 text-2xl font-bold">
                  {finalizeStatus === 'FINAL' ? 'Sẵn sàng' : 'Đang xử lý'}
                </p>
              </article>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/meetings">
              <Button variant="outline" icon={ArrowLeft} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Quay lại danh sách họp
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-100" 
              icon={Download}
              onClick={handleDownloadPdf}
              disabled={exporting || finalizeStatus !== 'FINAL'}
            >
              {exporting ? 'Đang xuất file...' : 'Tải báo cáo PDF'}
            </Button>
            <Button icon={Sparkles}>Chia sẻ tổng kết AI</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card title="Tóm tắt AI" subtitle="Tự động tạo từ nội dung hội thoại">
            <div className="space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  Điểm nhấn chính
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
                <p className="text-sm font-semibold text-slate-900">Biên bản đã merge</p>
                <p className="mt-1 text-xs text-slate-500">
                  {finalizeStatus === 'PROCESSING' && 'Đang xử lý biên bản cuối cuộc họp...'}
                  {finalizeStatus === 'FINAL' && 'Biên bản chính thức đã sẵn sàng.'}
                  {finalizeStatus === 'FAILED' && 'Không thể tạo biên bản. Vui lòng thử lại sau.'}
                </p>
                <div className="mt-3 space-y-3">
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
              </article>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Công việc theo dõi" subtitle="Nhiệm vụ đã được phân công">
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <article key={item.task} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{item.task}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-white px-2.5 py-1">Phụ trách: {item.owner}</span>
                      <span className="rounded-full bg-white px-2.5 py-1">Hạn: {item.due}</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card title="Bản ghi và ghi chú" subtitle="Tài liệu đã sẵn sàng để xem lại">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Mic className="mt-0.5 h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-slate-900">Đã có bản ghi</p>
                    <p className="mt-1 text-slate-600">Video buổi họp có thể phát lại và chia sẻ trong workspace.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Users className="mt-0.5 h-4 w-4 text-primary-600" />
                  <div>
                    <p className="font-medium text-slate-900">Tổng kết người tham gia</p>
                    <p className="mt-1 text-slate-600">Điểm danh, thời điểm vào phòng và hoạt động phòng họp đã được ghi lại.</p>
                  </div>
                </div>
                <Link to={`/room/${roomCode}`} className="inline-flex w-full">
                  <Button variant="outline" fullWidth className="border-slate-300 text-slate-700 hover:bg-slate-100" icon={FileText}>
                    Mở lại bối cảnh phòng họp
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