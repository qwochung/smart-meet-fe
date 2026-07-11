import axiosClient from './axiosClient';

export const roomApi = {
  // Hàm tạo phòng mới
  createRoom: async (payload) => {
    return await axiosClient.post('/rooms/', payload);
  },

  // Hàm lấy thông tin phòng bằng roomCode
  getRoomByCode: async (roomCode) => {
    return await axiosClient.get(`/rooms/${roomCode}/available`);
  },

  acceptJoinRequest: async (roomCode, data) => {
    return await axiosClient.post(`/rooms/${roomCode}/join/accept`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  rejectJoinRequest: async (roomCode, data) => {
    return await axiosClient.post(`/rooms/${roomCode}/join/reject`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  endRoom: async (roomCode) => {
    return await axiosClient.post(`/rooms/${roomCode}/end`);
  },

  getRoomMinutes: async (params) => {
    return await axiosClient.get('/rooms/minutes', { params });
  },

  getDashboard: async () => {
    return await axiosClient.get('/rooms/dashboard');
  },

  scheduleMeetings: async (payload) => {
    return await axiosClient.post('/rooms/schedule', payload);
  }
};