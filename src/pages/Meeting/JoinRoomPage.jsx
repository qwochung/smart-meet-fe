import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Link2 } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { getStoredUser } from '../../utils/auth';
import { useJoinRoom } from '../../hooks/useJoinRoom';

const extractRoomCode = (value) => {
  const input = String(value || '').trim();

  if (!input) {
    return '';
  }

  try {
    const normalizedUrl = input.includes('://') ? input : `https://${input}`;
    const url = new URL(normalizedUrl);

    const roomCodeFromQuery = url.searchParams.get('roomCode');
    if (roomCodeFromQuery) {
      return roomCodeFromQuery.trim();
    }

    const roomMatch = url.pathname.match(/\/room\/([^/]+)/i);
    if (roomMatch?.[1]) {
      return roomMatch[1].trim();
    }

    const joinMatch = url.pathname.match(/\/join\/([^/]+)/i);
    if (joinMatch?.[1]) {
      return joinMatch[1].trim();
    }
  } catch {
    // Not a valid URL, fall back to the raw input below.
  }

  return input.replace(/\s+/g, '');
};

const getErrorMessage = (error) => {
  if (!error) {
    return '';
  }

  const messages = {
    ROOM_NOT_FOUND: 'Không tìm thấy phòng hoặc phòng đã hết hạn.',
    ROOM_EXPIRED: 'Không tìm thấy phòng hoặc phòng đã hết hạn.',
    ROOM_FULL: 'Phòng đã đủ người tham gia.',
    ROOM_JOIN_CONFLICT: 'Yêu cầu tham gia đang được xử lý, vui lòng thử lại sau.',
    FORBIDDEN: 'Bạn không có quyền tham gia phòng này.',
  };

  return messages[error.code] || error.message || 'Không thể tham gia cuộc họp.';
};

export default function JoinRoomPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = getStoredUser();
  const [roomCode, setRoomCode] = useState(searchParams.get('roomCode') || '');
  const { loading, error, joinRoom, clearError } = useJoinRoom({ currentUser });

  useEffect(() => {
    const initialRoomCode = searchParams.get('roomCode');

    if (initialRoomCode) {
      setRoomCode(initialRoomCode);
    }
  }, [searchParams]);

  const handleJoinRoom = async (event) => {
    event.preventDefault();
    clearError();

    const normalizedRoomCode = extractRoomCode(roomCode);

    if (!normalizedRoomCode) {
      return;
    }

    try {
      const result = await joinRoom({
        roomCode: normalizedRoomCode,
        role: 'PARTICIPANT',
      });

      if (result?.session?.pending) {
        navigate(`/room/${normalizedRoomCode}/waiting`, {
          replace: true,
          state: result.session,
        });
        return;
      }

      navigate(`/room/${normalizedRoomCode}`, {
        replace: true,
        state: result.session,
      });
    } catch {
      // Error is already rendered.
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Tham gia cuộc họp
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Dán mã phòng hoặc link mời từ chủ phòng để vào nhanh.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200 bg-white p-0 shadow-lg shadow-slate-200/60">
        <form onSubmit={handleJoinRoom} className="space-y-0">
          <div className="space-y-5 p-6 sm:p-8">
            <Input
              label="Mã phòng hoặc link mời"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              placeholder="VD: ABCD1234 hoặc https://.../join?roomCode=ABCD1234"
              icon={Link2}
              autoComplete="off"
              helperText="Bạn có thể dán mã phòng hoặc link copy từ chủ phòng."
              required
            />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getErrorMessage(error)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-5 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100"
              onClick={() => {
                setRoomCode('');
                clearError();
              }}
            >
              Xóa
            </Button>
            <Button type="submit" loading={loading} icon={ArrowRight} className="bg-sky-500 px-6 hover:bg-sky-600 focus:ring-sky-500">
              Vào phòng
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}