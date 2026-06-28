import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Repeat,
  Settings2,
  Sparkles,
  X,
} from "lucide-react";
import { Button, Card } from "../../components/common";
import { getStoredUser } from "../../utils/auth.js";
import { roomService, roomSessionStorage } from "../../services/roomService";
import PreMeetingUpload from "./PreMeetingUpload.jsx";

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-primary-500" : "bg-slate-300"}`}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function CreateRoomPage() {
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [meetingType, setMeetingType] = useState("GENERAL");
  const navigate = useNavigate();
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("");
  const [participants, setParticipants] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [autoRecord, setAutoRecord] = useState(false);
  const [generateAiMinutes, setGenerateAiMinutes] = useState(true);
  const [privacySetting, setPrivacySetting] = useState("chi-khach-moi");
  const [recurrenceType, setRecurrenceType] = useState("NONE");
  const [occurrences, setOccurrences] = useState(4);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);
  const [scheduledRooms, setScheduledRooms] = useState(null);

  const isRecurring = recurrenceType !== "NONE";
  const scheduledPreview = date && time ? new Date(`${date}T${time}:00`) : null;
  const isScheduledFuture =
    scheduledPreview && scheduledPreview.getTime() > Date.now();
  const currentUser = getStoredUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (!meetingName.trim()) {
      setError("Vui lòng nhập tên cuộc họp.");
      return;
    }

    const scheduledAt =
      date && time ? new Date(`${date}T${time}:00`).toISOString() : null;

    // Cuộc họp đặt cho thời điểm trong tương lai -> chỉ lên lịch (phòng WAITING), không vào ngay
    const isScheduledFuture =
      scheduledAt && new Date(scheduledAt).getTime() > Date.now();

    if (isRecurring) {
      if (!scheduledAt) {
        setError("Cuộc họp lặp lại cần có cả ngày và giờ bắt đầu.");
        return;
      }
    }

    // Lặp lịch hoặc đặt lịch tương lai: tạo phòng đã lên lịch, không vào phòng ngay
    if (isRecurring || isScheduledFuture) {
      setLoading(true);
      setError("");
      try {
        const response = await roomService.scheduleMeetings({
          name: meetingName.trim(),
          description: description.trim(),
          scheduledAt,
          recurrenceType: isRecurring ? recurrenceType : "NONE",
          occurrences: isRecurring ? Number(occurrences) || 1 : 1,
          typeCode: meetingType,
        });
        const rooms = response?.data || response || [];
        setScheduledRooms(Array.isArray(rooms) ? rooms : []);
      } catch (scheduleError) {
        setError(scheduleError?.message || "Không thể lên lịch cuộc họp.");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: meetingName.trim(),
      description: description.trim(),
      scheduledAt,
      typeCode: meetingType,
    };

    try {
      const response = await roomService.createRoom(payload);
      const responseData = response?.data || response || {};
      const roomCode = responseData?.roomCode || responseData?.code;

      if (!roomCode) {
        throw new Error("Không nhận được mã phòng từ máy chủ.");
      }

      const session = {
        roomCode,
        role: "HOST",
        created: true,
        livekitToken: responseData.livekitToken || "",
        livekitHost: responseData.livekitHost || "",
        roomName: responseData.name || "",
      };

      console.log("CreateRoomPage - session:", session);

      roomSessionStorage.set(session);
      setCreatedSession(session);
    } catch (createError) {
      setError(createError?.message || "Không thể tạo cuộc họp.");
    } finally {
      setLoading(false);
    }
  };

  const addParticipant = () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || participants.includes(email)) {
      setNewEmail("");
      return;
    }

    setParticipants((prev) => [...prev, email]);
    setNewEmail("");
  };

  const removeParticipant = (emailToRemove) => {
    setParticipants((prev) => prev.filter((item) => item !== emailToRemove));
  };

  const handleInviteKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addParticipant();
    }
  };

  if (scheduledRooms) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 p-2 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {scheduledRooms.length > 1
                ? `Đã lên lịch ${scheduledRooms.length} buổi họp`
                : "Đã lên lịch cuộc họp"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {scheduledRooms.length > 1
                ? "Các buổi họp định kỳ đã được tạo và sẽ xuất hiện trong lịch của bạn."
                : "Cuộc họp đã được lên lịch và sẽ xuất hiện trong lịch của bạn."}
            </p>
          </div>
        </div>

        <Card>
          <div className="space-y-3">
            {scheduledRooms.map((room, index) => (
              <article
                key={room.roomCode || index}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Buổi {index + 1}: {room.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {room.scheduledAt
                      ? new Date(room.scheduledAt).toLocaleString("vi-VN", {
                          weekday: "long",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Chưa xác định"}
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                  {room.roomCode}
                </span>
              </article>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setScheduledRooms(null);
              setRecurrenceType("NONE");
            }}
          >
            Tạo lịch khác
          </Button>
          <Button onClick={() => navigate("/dashboard")}>Về trang tổng quan</Button>
        </div>
      </div>
    );
  }

  if (createdSession) {
    const uploadStorageKey = `smart-meet-pre-meeting-upload:${createdSession.roomCode}:${currentUser?.id}:HOST`;

    return (
      <PreMeetingUpload
        roomCode={createdSession.roomCode}
        roomName={createdSession.roomName}
        dismissStorageKey={uploadStorageKey}
        onContinue={() => {
          navigate(`/room/${createdSession.roomCode}`, {
            replace: true,
            state: createdSession,
          });
        }}
        onSkip={() => {
          navigate(`/room/${createdSession.roomCode}`, {
            replace: true,
            state: createdSession,
          });
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Tạo cuộc họp mới
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Thiết lập phiên làm việc tập trung và mời cộng tác viên của bạn.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-lg shadow-slate-200/60">
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Tên cuộc họp
              </label>
              <input
                type="text"
                value={meetingName}
                onChange={(event) => setMeetingName(event.target.value)}
                placeholder="Nhập tên cuộc họp..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Mô tả mục đích, nội dung hoặc người tham gia cuộc họp..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Ngày
                </label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Giờ
                </label>
                <div className="relative">
                  <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Mời người tham gia
              </label>
              <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
                {participants.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeParticipant(email)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={`Xóa ${email}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  onKeyDown={handleInviteKeyDown}
                  onBlur={addParticipant}
                  placeholder="Nhập email..."
                  className="min-w-[220px] flex-1 border-none bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Settings2 className="h-4 w-4 text-primary-500" />
                Cài đặt cuộc họp
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Tự động ghi lại cuộc họp
                    </p>
                    <p className="text-xs text-slate-500">
                      Lưu an toàn vào không gian dữ liệu đám mây của bạn.
                    </p>
                  </div>
                  <Toggle
                    enabled={autoRecord}
                    onToggle={() => setAutoRecord((prev) => !prev)}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      Tạo biên bản AI
                    </p>
                    <p className="text-xs text-slate-500">
                      Tự động tóm tắt và gợi ý các đầu việc cần xử lý.
                    </p>
                  </div>
                  <Toggle
                    enabled={generateAiMinutes}
                    onToggle={() => setGenerateAiMinutes((prev) => !prev)}
                  />
                </div>

                <div className="border-t border-slate-200/60 pt-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Loại cuộc họp (AI Summary Template)
                  </label>
                  <select
                    value={meetingType}
                    onChange={(event) => setMeetingType(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="GENERAL">Tiêu chuẩn / Cơ bản (GENERAL)</option>
                    <option value="SCRUM_SYNC">Họp dự án / Đồng bộ (SCRUM_SYNC)</option>
                    <option value="CLIENT_SALES">Gặp đối tác / Khách hàng (CLIENT_SALES)</option>
                    <option value="BRAINSTORMING">Lên ý tưởng / Sáng tạo (BRAINSTORMING)</option>
                    <option value="WEBINAR">Hội thảo / Đào tạo (WEBINAR)</option>
                    <option value="INTERVIEW">Phỏng vấn / 1-on-1 (INTERVIEW)</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Repeat className="h-4 w-4 text-primary-500" />
                  Lặp lịch định kỳ
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">
                      Tần suất lặp
                    </label>
                    <select
                      value={recurrenceType}
                      onChange={(event) => setRecurrenceType(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="NONE">Không lặp</option>
                      <option value="DAILY">Hằng ngày</option>
                      <option value="WEEKLY">Hằng tuần</option>
                      <option value="MONTHLY">Hằng tháng</option>
                    </select>
                  </div>
                  {isRecurring && (
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500">
                        Số buổi (2 - 12)
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={12}
                        value={occurrences}
                        onChange={(event) =>
                          setOccurrences(
                            Math.max(2, Math.min(12, Number(event.target.value) || 2)),
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  )}
                </div>
                {isRecurring && (
                  <p className="mt-2 text-xs text-slate-500">
                    Sẽ tạo {occurrences} buổi họp, bắt đầu từ ngày &amp; giờ đã chọn ở trên,
                    cách nhau{" "}
                    {recurrenceType === "DAILY"
                      ? "mỗi ngày"
                      : recurrenceType === "WEEKLY"
                        ? "mỗi tuần"
                        : "mỗi tháng"}
                    .
                  </p>
                )}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Quyền riêng tư cuộc họp
                </label>
                <select
                  value={privacySetting}
                  onChange={(event) => setPrivacySetting(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="chi-khach-moi">Chỉ người được mời</option>
                  <option value="trong-cong-ty">Mọi người trong công ty</option>
                  <option value="co-lien-ket">Bất kỳ ai có liên kết</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100"
              onClick={() => navigate(-1)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="bg-sky-500 px-6 hover:bg-sky-600 focus:ring-sky-500"
            >
              {isRecurring
                ? `Lên lịch ${occurrences} buổi`
                : isScheduledFuture
                  ? "Lên lịch cuộc họp"
                  : "Tạo cuộc họp"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
