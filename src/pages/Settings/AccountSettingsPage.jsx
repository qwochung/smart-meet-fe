import { useState } from 'react';
import { Button, Card, Input } from '../../components/common';

const tabs = [
  { id: 'profile', label: 'Hồ sơ' },
  { id: 'password', label: 'Mật khẩu' },
  { id: 'notifications', label: 'Thông báo' },
];

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cài đặt tài khoản</h1>
        <p className="mt-1 text-sm text-slate-500">Quản lý hồ sơ, mật khẩu và tùy chọn thông báo.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <Card className="h-fit p-2">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        <Card>
          {activeTab === 'profile' && (
            <form className="grid gap-4 md:grid-cols-2">
              <Input label="Họ và tên" defaultValue="Nguyen Van A" />
              <Input label="Email" defaultValue="nguyenvana@smartmeet.com" />
              <div className="md:col-span-2 flex justify-end">
                <Button>Lưu hồ sơ</Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form className="grid gap-4">
              <Input label="Mật khẩu hiện tại" type="password" />
              <Input label="Mật khẩu mới" type="password" />
              <Input label="Xác nhận mật khẩu mới" type="password" />
              <div className="flex justify-end">
                <Button>Cập nhật mật khẩu</Button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 text-sm text-slate-700">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Nhắc lịch bằng email trước cuộc họp</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Báo cáo tổng hợp hằng tuần</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Bản tin cập nhật sản phẩm</label>
              <div className="pt-2">
                <Button>Lưu tùy chọn</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
