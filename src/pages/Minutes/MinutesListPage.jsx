import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, FileText, Filter, Plus, Search } from 'lucide-react';
import { Button, Card, DataTable } from '../../components/common';
import { roomService } from '../../services/roomService';

export default function MinutesListPage() {
  const [minutes, setMinutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMinutes = async () => {
      setLoading(true);
      try {
        const response = await roomService.getRoomMinutes({
          name: searchQuery || undefined,
          date: filterDate || undefined,
        });
        const data = Array.isArray(response) ? response : (response?.data || []);
        setMinutes(data);
      } catch (error) {
        console.error('Error fetching room minutes:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchMinutes();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filterDate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ENDED':
        return <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700">Hoàn tất</span>;
      case 'ACTIVE':
        return <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-sky-50 text-sky-700">Đang diễn ra</span>;
      case 'WAITING':
        return <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700">Đang chờ</span>;
      default:
        return <span className="rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const columns = [
    { key: 'name', label: 'Cuộc họp' },
    {
      key: 'expiresAt',
      label: 'Ngày',
      render: (row) => (
        <span className="text-slate-600">
          {row.expiresAt ? new Date(row.expiresAt).toLocaleDateString('vi-VN') : 'N/A'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (row) => getStatusBadge(row.status),
    },
    { key: 'description', label: 'Mô tả' },
    {
      key: 'action',
      label: '',
      render: (row) =>
        row.status === 'ENDED' ? (
          <Link to={`/minutes/${row.roomCode}/summary`} className="text-primary-600 hover:text-primary-700">
            Xem
          </Link>
        ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Biên bản họp</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi, tìm kiếm và xuất biên bản từ tất cả cuộc họp.</p>
        </div>
        <Link to="/meetings/new">
          <Button icon={Plus}>Tạo cuộc họp mới</Button>
        </Link>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none"
              placeholder="Tìm theo tên cuộc họp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <div className="relative inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 bg-white text-slate-700 hover:bg-slate-50 focus-within:ring-1 focus-within:ring-primary-500">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-700 py-1"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Trạng thái
          </button>
        </div>
      </Card>

      <Card title="Danh sách biên bản" subtitle="Ghi chú cuộc họp mới nhất trong workspace">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : minutes.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Không tìm thấy biên bản họp nào.
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable columns={columns} data={minutes} />
            </div>
            <div className="space-y-3 md:hidden">
              {minutes.map((item) => (
                <article key={item.roomCode} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  {item.status === 'ENDED' && (
                    <Link
                      to={`/minutes/${item.roomCode}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      <FileText className="h-4 w-4" />
                      Mở chi tiết
                    </Link>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
