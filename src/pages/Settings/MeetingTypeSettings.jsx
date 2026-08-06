import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { meetingTypeService } from '../../services/meetingTypeService';

const MINUTES_FORMAT_OPTIONS = [
  { value: 'ACTION', label: 'Biên bản hành động — chỉ kết luận và đầu việc' },
  { value: 'DISCUSSION', label: 'Biên bản thảo luận — kèm diễn biến và lý do' },
  { value: 'VERBATIM', label: 'Biên bản nguyên văn — giữ nguyên lời thoại' },
];

const EMPTY_FORM = {
  label: '',
  description: '',
  extractFields: ['DISCUSSION_TOPICS', 'DECISIONS_MADE', 'ACTION_ITEMS'],
  customInstruction: '',
  defaultMinutesFormat: 'ACTION',
};

const unwrapList = (payload) => (Array.isArray(payload) ? payload : payload?.data ?? []);

export default function MeetingTypeSettings() {
  const [types, setTypes] = useState([]);
  const [summaryFields, setSummaryFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingCode, setSavingCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [typeData, fieldData] = await Promise.all([
          meetingTypeService.getMeetingTypes(),
          meetingTypeService.getSummaryFields(),
        ]);
        if (cancelled) return;
        setTypes(unwrapList(typeData));
        setSummaryFields(unwrapList(fieldData));
      } catch (err) {
        if (cancelled) return;
        console.error('[MeetingTypes] load failed:', err);
        setError('Không tải được danh sách loại cuộc họp. Vui lòng thử lại sau.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const builtInTypes = types.filter((type) => type.builtIn);
  const customTypes = types.filter((type) => !type.builtIn);
  const enabledCount = types.filter((type) => type.enabled).length;

  const handleToggle = async (type) => {
    const nextEnabled = !type.enabled;
    if (!nextEnabled && enabledCount <= 1) {
      alert('Cần giữ lại ít nhất một loại cuộc họp đang bật.');
      return;
    }

    // Cập nhật lạc quan để checkbox phản hồi ngay, khôi phục nếu lưu thất bại
    setTypes((current) =>
      current.map((item) => (item.code === type.code ? { ...item, enabled: nextEnabled } : item)),
    );
    setSavingCode(type.code);
    try {
      const updated = await meetingTypeService.updatePreferences([
        { typeCode: type.code, enabled: nextEnabled },
      ]);
      setTypes(unwrapList(updated));
    } catch (err) {
      console.error('[MeetingTypes] toggle failed:', err);
      setTypes((current) =>
        current.map((item) => (item.code === type.code ? { ...item, enabled: type.enabled } : item)),
      );
      alert('Không lưu được thay đổi. Vui lòng thử lại.');
    } finally {
      setSavingCode(null);
    }
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditForm = (type) => {
    setEditingId(type.id);
    setForm({
      label: type.label ?? '',
      description: type.description ?? '',
      extractFields: type.extractFields ?? [],
      customInstruction: type.customInstruction ?? '',
      defaultMinutesFormat: type.defaultMinutesFormat ?? 'ACTION',
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const toggleField = (value) => {
    setForm((current) => ({
      ...current,
      extractFields: current.extractFields.includes(value)
        ? current.extractFields.filter((item) => item !== value)
        : [...current.extractFields, value],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.label.trim()) {
      alert('Vui lòng nhập tên loại cuộc họp.');
      return;
    }
    if (form.extractFields.length === 0) {
      alert('Vui lòng chọn ít nhất một nội dung AI cần trích xuất.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        label: form.label.trim(),
        description: form.description.trim(),
        customInstruction: form.customInstruction.trim(),
      };
      if (editingId) {
        await meetingTypeService.updateCustomType(editingId, payload);
      } else {
        await meetingTypeService.createCustomType(payload);
      }
      setTypes(unwrapList(await meetingTypeService.getMeetingTypes()));
      closeForm();
    } catch (err) {
      console.error('[MeetingTypes] save failed:', err);
      alert(err?.response?.data?.message || 'Không lưu được loại cuộc họp. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`Xóa loại cuộc họp "${type.label}"? Các cuộc họp đã tạo sẽ dùng mẫu Tiêu chuẩn.`)) {
      return;
    }
    try {
      await meetingTypeService.deleteCustomType(type.id);
      setTypes(unwrapList(await meetingTypeService.getMeetingTypes()));
    } catch (err) {
      console.error('[MeetingTypes] delete failed:', err);
      alert('Không xóa được loại cuộc họp. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <p className="py-8 text-center text-sm text-slate-500">Đang tải loại cuộc họp...</p>;
  }

  if (error) {
    return <p className="py-8 text-center text-sm text-rose-600">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-slate-900">Loại có sẵn</h3>
        <p className="mt-1 text-sm text-slate-500">
          Bỏ tích những loại bạn không dùng để dropdown khi tạo cuộc họp gọn hơn. Loại có sẵn không sửa được.
        </p>
        <div className="mt-3 space-y-2">
          {builtInTypes.map((type) => (
            <TypeRow
              key={type.code}
              type={type}
              saving={savingCode === type.code}
              onToggle={() => handleToggle(type)}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Loại của bạn</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tự tạo loại cuộc họp riêng và chọn những nội dung AI cần trích xuất.
            </p>
          </div>
          {!formOpen && (
            <Button variant="outline" icon={Plus} onClick={openCreateForm}>
              Tạo loại mới
            </Button>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {customTypes.length === 0 && !formOpen && (
            <p className="rounded-xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
              Bạn chưa tạo loại cuộc họp nào.
            </p>
          )}
          {customTypes.map((type) => (
            <TypeRow
              key={type.code}
              type={type}
              saving={savingCode === type.code}
              onToggle={() => handleToggle(type)}
              onEdit={() => openEditForm(type)}
              onDelete={() => handleDelete(type)}
              summaryFields={summaryFields}
            />
          ))}
        </div>

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">
                {editingId ? 'Sửa loại cuộc họp' : 'Loại cuộc họp mới'}
              </h4>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Input
              label="Tên loại cuộc họp"
              value={form.label}
              onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
              placeholder="VD: Họp review thiết kế"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Mô tả bối cảnh (tùy chọn)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                placeholder="Mô tả ngắn để AI hiểu cuộc họp này bàn về điều gì..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Nội dung AI cần trích xuất <span className="text-rose-500">*</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {summaryFields.map((field) => (
                  <label
                    key={field.value}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.extractFields.includes(field.value)}
                      onChange={() => toggleField(field.value)}
                      className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    {field.label}
                  </label>
                ))}
              </div>
              {form.extractFields.length === 0 ? (
                <p className="mt-2 text-xs text-rose-600">
                  Cần chọn ít nhất một mục. Nếu không, biên bản sẽ chỉ có phần tóm tắt tổng quan.
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Phần tóm tắt tổng quan luôn được sinh, không cần tích. Các mục không tích sẽ để trống trong biên bản.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Yêu cầu riêng cho AI (tùy chọn)
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                value={form.customInstruction}
                onChange={(event) =>
                  setForm((current) => ({ ...current, customInstruction: event.target.value }))
                }
                placeholder="VD: Luôn ghi rõ tên người phát biểu; ưu tiên các nội dung liên quan tới ngân sách..."
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-slate-500">
                Được ghép vào cuối chỉ dẫn gửi cho AI, áp dụng cho mọi mục ở trên. Còn{' '}
                {1000 - form.customInstruction.length} ký tự.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Mẫu biên bản mặc định
              </label>
              <select
                value={form.defaultMinutesFormat}
                onChange={(event) =>
                  setForm((current) => ({ ...current, defaultMinutesFormat: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {MINUTES_FORMAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.defaultMinutesFormat === 'VERBATIM' && (
                <p className="mt-1.5 text-xs text-amber-600">
                  Mẫu nguyên văn không gọi AI tóm tắt, nên các mục đã tích ở trên sẽ không được dùng
                  cho tới khi bạn đổi sang mẫu Hành động hoặc Thảo luận.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" loading={submitting}>
                {editingId ? 'Lưu thay đổi' : 'Tạo loại cuộc họp'}
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function TypeRow({ type, saving, onToggle, onEdit, onDelete, summaryFields = [] }) {
  const fieldLabels = (type.extractFields ?? [])
    .map((code) => summaryFields.find((field) => field.value === code)?.label)
    .filter(Boolean);

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <label className="flex flex-1 cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={type.enabled}
          disabled={saving}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="flex-1">
          <span className="block text-sm font-medium text-slate-900">{type.label}</span>
          {type.description && (
            <span className="mt-0.5 block text-xs text-slate-500">{type.description}</span>
          )}
          {fieldLabels.length > 0 && (
            <span className="mt-1 block text-xs text-slate-400">
              Trích xuất: {fieldLabels.join(', ')}
            </span>
          )}
          {type.customInstruction && (
            <span className="mt-0.5 block truncate text-xs text-slate-400">
              Yêu cầu riêng: {type.customInstruction}
            </span>
          )}
        </span>
      </label>

      {(onEdit || onDelete) && (
        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              title="Sửa"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
