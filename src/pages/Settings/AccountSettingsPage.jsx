import { useState } from 'react';
import { Button, Card, Input } from '../../components/common';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'password', label: 'Password' },
  { id: 'notifications', label: 'Notifications' },
];

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your profile, password, and notification preferences.</p>
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
              <Input label="Full name" defaultValue="Nguyen Van A" />
              <Input label="Email" defaultValue="nguyenvana@smartmeet.com" />
              <div className="md:col-span-2 flex justify-end">
                <Button>Save profile</Button>
              </div>
            </form>
          )}

          {activeTab === 'password' && (
            <form className="grid gap-4">
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Input label="Confirm new password" type="password" />
              <div className="flex justify-end">
                <Button>Update password</Button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3 text-sm text-slate-700">
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Email reminders before meeting</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Weekly summary report</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Product update newsletter</label>
              <div className="pt-2">
                <Button>Save preferences</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
