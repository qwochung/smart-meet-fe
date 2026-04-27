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

  acceptJoinRequest: async (roomCode,data) => {
    return await axiosClient.post(`/rooms/${roomCode}/user/accept`, data)
  }
};