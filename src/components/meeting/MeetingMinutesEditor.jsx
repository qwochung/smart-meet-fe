import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  HelpCircle,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Scale,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Button, Card } from '../common';
import { transcriptService } from '../../services/transcriptService';

const EMPTY_SUMMARY = {
  executiveSummary: '',
  discussionTopics: [],
  decisionsMade: [],
  actionItems: [],
  qaPairs: [],
  painPoints: [],
  prosAndCons: [],
};

const normalize = (summary = {}) => ({
  executiveSummary: summary.executiveSummary ?? '',
  discussionTopics: summary.discussionTopics ?? [],
  decisionsMade: summary.decisionsMade ?? [],
  actionItems: summary.actionItems ?? [],
  qaPairs: summary.qaPairs ?? [],
  painPoints: summary.painPoints ?? [],
  prosAndCons: summary.prosAndCons ?? [],
});

const formatDuration = (minutes) => {
  if (minutes == null) return 'Chưa theo dõi';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const textareaClass =
  'w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

export default function MeetingMinutesEditor({ roomCode }) {
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(null); // 'pdf' | 'docx' | null

  useEffect(() => {
    let cancelled = false;
    let timerId = null;
    const MAX_ATTEMPTS = 20; // ~40s: summary AI được sinh bất đồng bộ, có thể trễ hơn transcript
    let attempt = 0;

    setLoading(true);
    setError(null);

    const load = async () => {
      attempt += 1;
      try {
        const data = await transcriptService.getSummary(roomCode);
        if (cancelled) return;
        setDetail(data);
        setDraft(normalize(data?.summary));
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        // Summary có thể chưa được tạo xong (AI sinh bất đồng bộ) -> thử lại
        if (attempt < MAX_ATTEMPTS) {
          timerId = setTimeout(load, 2000);
        } else {
          console.error('[Minutes] load summary failed:', err);
          setError('Không thể tải biên bản. Vui lòng thử lại sau.');
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [roomCode]);

  const handleCancel = () => {
    setDraft(normalize(detail?.summary));
    setEditing(false);
  };

  const handleSave = async () => {
    if (!draft.executiveSummary || !draft.executiveSummary.trim()) {
      alert('Tổng kết điều hành không được để trống.');
      return;
    }
    setSaving(true);
    try {
      const updated = await transcriptService.updateSummary(roomCode, draft);
      setDetail((prev) => ({ ...prev, summary: updated }));
      setDraft(normalize(updated));
      setEditing(false);
    } catch (err) {
      console.error('[Minutes] save summary failed:', err);
      alert('Lưu biên bản thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async (format) => {
    if (exporting) return;
    setExporting(format);
    try {
      const blob = await transcriptService.downloadSummary(roomCode, format);
      const mime =
        format === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/pdf';
      const url = window.URL.createObjectURL(new Blob([blob], { type: mime }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Meeting_Minutes_${roomCode}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`[Minutes] export ${format} failed:`, err);
      alert(`Không thể tải biên bản ${format.toUpperCase()}. Vui lòng thử lại sau.`);
    } finally {
      setExporting(null);
    }
  };

  // ---- draft mutation helpers ----
  const setField = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const updateStringItem = (key, index, value) =>
    setDraft((d) => ({ ...d, [key]: d[key].map((it, i) => (i === index ? value : it)) }));
  const addStringItem = (key) => setDraft((d) => ({ ...d, [key]: [...d[key], ''] }));
  const removeItem = (key, index) =>
    setDraft((d) => ({ ...d, [key]: d[key].filter((_, i) => i !== index) }));

  const updateObjItem = (key, index, field, value) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].map((it, i) => (i === index ? { ...it, [field]: value } : it)),
    }));
  const addObjItem = (key, template) => setDraft((d) => ({ ...d, [key]: [...d[key], template] }));

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
          <svg className="h-6 w-6 animate-spin text-primary-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Đang tải biên bản...
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-slate-500">{error}</p>
      </Card>
    );
  }

  const s = editing ? draft : normalize(detail?.summary);

  return (
    <div className="space-y-6">
      {/* Thanh thao tác + thống kê */}
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Thời lượng" value={formatDuration(detail?.durationMinutes)} />
            <Stat label="Người tham gia" value={String(detail?.attendeeCount ?? 0)} />
            <Stat label="Chủ trì" value={detail?.hostName || '—'} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {editing ? (
              <>
                <Button icon={Save} loading={saving} onClick={handleSave}>
                  Lưu thay đổi
                </Button>
                <Button variant="outline" icon={X} onClick={handleCancel} disabled={saving}>
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" icon={Pencil} onClick={() => setEditing(true)}>
                  Chỉnh sửa
                </Button>
                <Button
                  variant="outline"
                  icon={Download}
                  loading={exporting === 'pdf'}
                  disabled={!!exporting}
                  onClick={() => handleExport('pdf')}
                >
                  Xuất PDF
                </Button>
                <Button
                  variant="outline"
                  icon={FileText}
                  loading={exporting === 'docx'}
                  disabled={!!exporting}
                  onClick={() => handleExport('docx')}
                >
                  Xuất DOCX
                </Button>
              </>
            )}
          </div>
        </div>
        {editing && (
          <p className="mt-3 text-xs text-amber-600">
            Bạn đang ở chế độ chỉnh sửa. Hãy lưu thay đổi trước khi xuất file để biên bản phản ánh đúng nội dung.
          </p>
        )}
      </Card>

      {/* Tổng kết điều hành */}
      <Card title="Tổng kết điều hành" subtitle="Tóm tắt tổng quan do AI tạo">
        <SectionIcon icon={Sparkles} />
        {editing ? (
          <textarea
            rows={5}
            className={textareaClass}
            value={s.executiveSummary}
            onChange={(e) => setField('executiveSummary', e.target.value)}
          />
        ) : (
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {s.executiveSummary || 'Chưa có nội dung.'}
          </p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListSection
          title="Chủ đề thảo luận"
          icon={ListChecks}
          items={s.discussionTopics}
          editing={editing}
          onChange={(i, v) => updateStringItem('discussionTopics', i, v)}
          onAdd={() => addStringItem('discussionTopics')}
          onRemove={(i) => removeItem('discussionTopics', i)}
        />
        <ListSection
          title="Các quyết định"
          icon={CheckCircle2}
          items={s.decisionsMade}
          editing={editing}
          onChange={(i, v) => updateStringItem('decisionsMade', i, v)}
          onAdd={() => addStringItem('decisionsMade')}
          onRemove={(i) => removeItem('decisionsMade', i)}
        />
      </div>

      {/* Công việc theo dõi */}
      <Card title="Công việc theo dõi" subtitle="Nhiệm vụ được phân công sau cuộc họp">
        <SectionIcon icon={ClipboardList} />
        <div className="space-y-3">
          {s.actionItems.length === 0 && !editing && (
            <p className="text-sm text-slate-500">Không có công việc nào.</p>
          )}
          {s.actionItems.map((item, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {editing ? (
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <input
                      className={inputClass}
                      placeholder="Nội dung công việc"
                      value={item.task ?? ''}
                      onChange={(e) => updateObjItem('actionItems', i, 'task', e.target.value)}
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        placeholder="Người phụ trách"
                        value={item.assignee ?? ''}
                        onChange={(e) => updateObjItem('actionItems', i, 'assignee', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="Hạn (YYYY-MM-DD)"
                        value={item.deadline ?? ''}
                        onChange={(e) => updateObjItem('actionItems', i, 'deadline', e.target.value)}
                      />
                    </div>
                  </div>
                  <RemoveBtn onClick={() => removeItem('actionItems', i)} />
                </div>
              ) : (
                <>
                  <p className="font-medium text-slate-900">{item.task}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-white px-2.5 py-1">
                      Phụ trách: {item.assignee || '—'}
                    </span>
                    <span className="rounded-full bg-white px-2.5 py-1">
                      Hạn: {item.deadline || '—'}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
          {editing && (
            <AddBtn label="Thêm công việc" onClick={() => addObjItem('actionItems', { task: '', assignee: '', deadline: '' })} />
          )}
        </div>
      </Card>

      {/* Hỏi & Đáp */}
      {(s.qaPairs.length > 0 || editing) && (
        <Card title="Hỏi & Đáp" subtitle="Các câu hỏi và trả lời trong cuộc họp">
          <SectionIcon icon={HelpCircle} />
          <div className="space-y-3">
            {s.qaPairs.map((qa, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {editing ? (
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <input
                        className={inputClass}
                        placeholder="Câu hỏi"
                        value={qa.question ?? ''}
                        onChange={(e) => updateObjItem('qaPairs', i, 'question', e.target.value)}
                      />
                      <input
                        className={inputClass}
                        placeholder="Trả lời"
                        value={qa.answer ?? ''}
                        onChange={(e) => updateObjItem('qaPairs', i, 'answer', e.target.value)}
                      />
                    </div>
                    <RemoveBtn onClick={() => removeItem('qaPairs', i)} />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-900">Hỏi: {qa.question}</p>
                    <p className="mt-1 text-sm text-slate-700">Đáp: {qa.answer}</p>
                  </>
                )}
              </div>
            ))}
            {editing && (
              <AddBtn label="Thêm câu hỏi" onClick={() => addObjItem('qaPairs', { question: '', answer: '' })} />
            )}
          </div>
        </Card>
      )}

      {(s.painPoints.length > 0 || editing) && (
        <ListSection
          title="Điểm khó khăn"
          icon={Scale}
          items={s.painPoints}
          editing={editing}
          onChange={(i, v) => updateStringItem('painPoints', i, v)}
          onAdd={() => addStringItem('painPoints')}
          onRemove={(i) => removeItem('painPoints', i)}
        />
      )}

      {/* Ưu / Nhược điểm */}
      {(s.prosAndCons.length > 0 || editing) && (
        <Card title="Ưu / Nhược điểm" subtitle="Phân tích các phương án">
          <SectionIcon icon={Scale} />
          <div className="space-y-3">
            {s.prosAndCons.map((pc, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                {editing ? (
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-2">
                      <input
                        className={inputClass}
                        placeholder="Ý tưởng"
                        value={pc.idea ?? ''}
                        onChange={(e) => updateObjItem('prosAndCons', i, 'idea', e.target.value)}
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          placeholder="Ưu điểm"
                          value={pc.pros ?? ''}
                          onChange={(e) => updateObjItem('prosAndCons', i, 'pros', e.target.value)}
                        />
                        <input
                          className={inputClass}
                          placeholder="Nhược điểm"
                          value={pc.cons ?? ''}
                          onChange={(e) => updateObjItem('prosAndCons', i, 'cons', e.target.value)}
                        />
                      </div>
                    </div>
                    <RemoveBtn onClick={() => removeItem('prosAndCons', i)} />
                  </div>
                ) : (
                  <>
                    <p className="font-medium text-slate-900">{pc.idea}</p>
                    <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                      <p className="rounded-lg bg-emerald-50 p-2 text-emerald-700">Ưu: {pc.pros}</p>
                      <p className="rounded-lg bg-rose-50 p-2 text-rose-700">Nhược: {pc.cons}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
            {editing && (
              <AddBtn
                label="Thêm phương án"
                onClick={() => addObjItem('prosAndCons', { idea: '', pros: '', cons: '' })}
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 truncate text-2xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

function SectionIcon({ icon: Icon }) {
  return (
    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
      <Icon className="h-5 w-5" />
    </div>
  );
}

function RemoveBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
      title="Xóa"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:border-primary-400 hover:text-primary-600"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

function ListSection({ title, icon, items, editing, onChange, onAdd, onRemove }) {
  return (
    <Card title={title}>
      <SectionIcon icon={icon} />
      <div className="space-y-2">
        {items.length === 0 && !editing && <p className="text-sm text-slate-500">Chưa có nội dung.</p>}
        {items.map((item, i) =>
          editing ? (
            <div key={i} className="flex items-start gap-2">
              <input className={inputClass} value={item ?? ''} onChange={(e) => onChange(i, e.target.value)} />
              <RemoveBtn onClick={() => onRemove(i)} />
            </div>
          ) : (
            <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
              <span>{item}</span>
            </div>
          )
        )}
        {editing && <AddBtn label="Thêm dòng" onClick={onAdd} />}
      </div>
    </Card>
  );
}
