import axiosClient from '../api/axiosClient';

const ROOM_ERROR_MESSAGES = {
  ROOM_NOT_FOUND: 'Room not found or expired',
  ROOM_EXPIRED: 'Room not found or expired',
  ROOM_FULL: 'Room is full',
  ROOM_JOIN_CONFLICT: 'Room join is already in progress. Please retry shortly.',
  FORBIDDEN: 'You do not have permission to join this room',
};

const unwrapResponse = (response) => response?.data ?? response ?? {};

export const normalizeRoomError = (error) => {
  const response = error?.response;
  const payload = response?.data ?? {};
  const code = payload.code || payload.errorCode || payload.error || payload.type || payload.status;
  const fallbackMessage = payload.message || error?.message || 'Unable to process room request';

  return {
    code,
    message: ROOM_ERROR_MESSAGES[code] || fallbackMessage,
    status: response?.status,
    retryAfter: Number(response?.headers?.['retry-after']) || payload.retryAfter || null,
    raw: error,
  };
};

export const roomService = {
  async createRoom(payload) {
    const response = await axiosClient.post('/rooms/', payload);
    return unwrapResponse(response);
  },

  async checkRoomAvailability(roomCode) {
    const response = await axiosClient.get(`/rooms/${roomCode}/available`);
    return unwrapResponse(response);
  },

  async joinRoom(roomCode, payload) {
    const response = await axiosClient.post(`/rooms/${roomCode}/join`, payload);
    return unwrapResponse(response);
  },

  async acceptJoinRequest(roomCode, payload) {
    const response = await axiosClient.post(`/rooms/${roomCode}/join/accept`, payload);
    return unwrapResponse(response);
  },

  async rejectJoinRequest(roomCode, payload = {}) {
    const response = await axiosClient.post(`/rooms/${roomCode}/join/reject`, payload);
    return unwrapResponse(response);
  },
};

export const roomSessionStorage = {
  key: 'smart-meet-room-session',

  get(roomCode) {
    try {
      const stored = sessionStorage.getItem(this.key);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      if (roomCode && parsed?.roomCode !== roomCode) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  set(session) {
    if (!session) {
      return;
    }

    sessionStorage.setItem(this.key, JSON.stringify(session));
  },

  clear(roomCode) {
    if (!roomCode) {
      sessionStorage.removeItem(this.key);
      return;
    }

    const current = this.get();
    if (!current || current.roomCode === roomCode) {
      sessionStorage.removeItem(this.key);
    }
  },
};