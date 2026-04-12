import { Button, Card, Input } from '../../components/common';

export default function CreateMeetingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tạo cuộc họp mới</h1>
        <p className="mt-1 text-sm text-slate-500">Thiết lập chương trình, người tham gia và lịch họp.</p>
      </div>

      <Card>
        <form className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input label="Tiêu đề cuộc họp" placeholder="Đồng bộ sản phẩm hằng tuần" />
          </div>
          <Input label="Ngày" type="date" />
          <Input label="Giờ" type="time" />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Chương trình họp</label>
            <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" rows={5} placeholder="Nhập chương trình họp..." />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button>Tạo cuộc họp</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
