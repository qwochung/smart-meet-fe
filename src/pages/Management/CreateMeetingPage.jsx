import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button, Card } from "../../components/common";

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

export default function CreateMeetingPage() {
  const [chuDe, setChuDe] = useState("");
  const [ngay, setNgay] = useState("");
  const [gio, setGio] = useState("");
  const [nguoiThamGia, setNguoiThamGia] = useState([
    "sarah@nxus.ai",
    "mike.design@nxus.ai",
  ]);
  const [emailMoi, setEmailMoi] = useState("");
  const [tuDongGhiHinh, setTuDongGhiHinh] = useState(false);
  const [taoBienBanAI, setTaoBienBanAI] = useState(true);
  const [quyenRiengTu, setQuyenRiengTu] = useState("chi-khach-moi");

  const themNguoiThamGia = () => {
    const email = emailMoi.trim().toLowerCase();
    if (!email || nguoiThamGia.includes(email)) {
      setEmailMoi("");
      return;
    }

    setNguoiThamGia((prev) => [...prev, email]);
    setEmailMoi("");
  };

  const xoaNguoiThamGia = (emailCanXoa) => {
    setNguoiThamGia((prev) => prev.filter((item) => item !== emailCanXoa));
  };

  const xuLyPhimTat = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      themNguoiThamGia();
    }
  };

  const xuLySubmit = (event) => {
    event.preventDefault();
  };

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
        <form onSubmit={xuLySubmit} className="space-y-0">
          <div className="space-y-6 p-6 sm:p-8">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Tên cuộc họp
              </label>
              <input
                type="text"
                value={chuDe}
                onChange={(event) => setChuDe(event.target.value)}
                placeholder="VD: Đồng bộ chiến lược sản phẩm Q4"
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
                    value={ngay}
                    onChange={(event) => setNgay(event.target.value)}
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
                    value={gio}
                    onChange={(event) => setGio(event.target.value)}
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
                {nguoiThamGia.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => xoaNguoiThamGia(email)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={`Xóa ${email}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <input
                  type="email"
                  value={emailMoi}
                  onChange={(event) => setEmailMoi(event.target.value)}
                  onKeyDown={xuLyPhimTat}
                  onBlur={themNguoiThamGia}
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
                    enabled={tuDongGhiHinh}
                    onToggle={() => setTuDongGhiHinh((prev) => !prev)}
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
                    enabled={taoBienBanAI}
                    onToggle={() => setTaoBienBanAI((prev) => !prev)}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Quyền riêng tư cuộc họp
                </label>
                <select
                  value={quyenRiengTu}
                  onChange={(event) => setQuyenRiengTu(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
                >
                  <option value="chi-khach-moi">Chỉ người được mời</option>
                  <option value="trong-cong-ty">Mọi người trong công ty</option>
                  <option value="co-lien-ket">Bất kỳ ai có liên kết</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-sky-500 px-6 hover:bg-sky-600 focus:ring-sky-500"
            >
              Lên lịch cuộc họp
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Sparkles className="h-4 w-4 text-primary-500" />
            Tối ưu thời điểm họp
          </div>
          <p className="text-xs text-slate-500">
            AI đề xuất khung giờ phù hợp nhất dựa trên lịch và múi giờ của người
            tham gia.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
            <ShieldCheck className="h-4 w-4 text-primary-500" />
            Mã hóa đầu cuối
          </div>
          <p className="text-xs text-slate-500">
            Mọi cuộc họp đều được bảo vệ bằng chuẩn mã hóa nâng cao cho doanh
            nghiệp.
          </p>
        </div>
      </div>
    </div>
  );
}
