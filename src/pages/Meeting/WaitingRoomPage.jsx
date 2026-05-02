import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getStoredUser } from '../../utils/auth';
import { roomSessionStorage, normalizeRoomError } from '../../services/roomService';
import WaitingScreen from '../../components/meeting/WaitingScreen';

export default function WaitingRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomCode } = useParams();
  const currentUser = getStoredUser();
  const session = useMemo(() => location.state || roomSessionStorage.get(roomCode), [location.state, roomCode]);
  const [status, setStatus] = useState('Waiting for host approval...');

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!session?.roomCode && roomCode) {
      roomSessionStorage.set({
        roomCode,
        role: 'PARTICIPANT',
        pending: true,
        userId: currentUser?.id,
        userName: currentUser?.name,
      });
    }
  }, [session, roomCode, currentUser]);

  const { connectionState } = useWebSocket({
    roomCode,
    userId: currentUser?.id,
    role: 'PARTICIPANT',
    enabled: Boolean(roomCode && currentUser?.id),
    onMessage: (message) => {
      if (message.type === 'JOIN_APPROVED') {
        const nextSession = {
          ...roomSessionStorage.get(roomCode),
          roomCode,
          role: 'PARTICIPANT',
          pending: false,
          approved: true,
          livekitToken: message.livekitToken || message.token,
          livekitHost: message.livekitHost || message.livekitUrl,
        };

        roomSessionStorage.set(nextSession);
        navigate(`/room/${roomCode}`, {
          replace: true,
          state: nextSession,
        });
      }

      if (message.type === 'JOIN_REJECTED') {
        roomSessionStorage.clear(roomCode);
        navigate('/join/denied', {
          replace: true,
          state: {
            roomCode,
            roomName: session?.roomName,
          },
        });
      }
    },
    onError: (event) => {
      const normalized = normalizeRoomError(event);
      setStatus(normalized.message);
    },
  });

  if (!roomCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <WaitingScreen
        roomCode={roomCode}
        roomName={session?.roomName}
        status={connectionState === 'connected' ? status : 'Connecting to approval channel...'}
      />
    </div>
  );
}