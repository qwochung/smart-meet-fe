import { useCallback, useMemo, useState } from 'react';
import { roomService, normalizeRoomError, roomSessionStorage } from '../services/roomService';

const normalizeJoinSession = (roomCode, response, fallbackRole, user) => {
  const payload = response?.data ?? response ?? {};

  return {
    roomCode,
    role: payload.role || fallbackRole || 'PARTICIPANT',
    pending: Boolean(payload.pending),
    livekitToken: payload.livekitToken || payload.token || '',
    livekitHost: payload.livekitHost || payload.livekitUrl || payload.livekitServer || '',
    roomName: payload.roomName || payload.name || payload.title || '',
    userId: user?.id,
    userName: user?.name || user?.fullName || user?.email || '',
    createdAt: Date.now(),
  };
};

export const useJoinRoom = ({ currentUser } = {}) => {
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [error, setError] = useState(null);
  const [joinSession, setJoinSession] = useState(() => roomSessionStorage.get());

  const clearError = useCallback(() => setError(null), []);

  const saveSession = useCallback((session) => {
    roomSessionStorage.set(session);
    setJoinSession(session);
    return session;
  }, []);

  const clearSession = useCallback((roomCode) => {
    roomSessionStorage.clear(roomCode);
    setJoinSession(null);
  }, []);

  const checkAvailability = useCallback(async (roomCode) => {
    const normalizedRoomCode = roomCode?.trim();

    if (!normalizedRoomCode) {
      const invalidError = { code: 'ROOM_NOT_FOUND', message: 'Room not found or expired' };
      setError(invalidError);
      throw invalidError;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await roomService.checkRoomAvailability(normalizedRoomCode);
      setRoomInfo(response);
      return response;
    } catch (rawError) {
      const normalizedError = normalizeRoomError(rawError);
      setRoomInfo(null);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinRoom = useCallback(async ({ roomCode, role = 'PARTICIPANT' }) => {
    const normalizedRoomCode = roomCode?.trim();

    if (!normalizedRoomCode) {
      const invalidError = { code: 'ROOM_NOT_FOUND', message: 'Room not found or expired' };
      setError(invalidError);
      throw invalidError;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await roomService.joinRoom(normalizedRoomCode, {
        userId: currentUser?.id,
        userName: currentUser?.name,
        role,
      });

      const session = normalizeJoinSession(normalizedRoomCode, response, role, currentUser);
      saveSession(session);

      return {
        room: response,
        session,
      };
    } catch (rawError) {
      const normalizedError = normalizeRoomError(rawError);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setLoading(false);
    }
  }, [currentUser, saveSession]);

  const value = useMemo(
    () => ({
      loading,
      roomInfo,
      error,
      joinSession,
      checkAvailability,
      joinRoom,
      saveSession,
      clearSession,
      clearError,
    }),
    [loading, roomInfo, error, joinSession, checkAvailability, joinRoom, saveSession, clearSession, clearError]
  );

  return value;
};