import axiosClient from "../api/axiosClient";

const unwrapResponse = (response) => response?.data?.data ?? response?.data ?? response ?? {};

export const transcriptService = {
  async getDraftTranscript(roomCode) {
    const response = await axiosClient.get(`/rooms/${roomCode}/transcript/draft`);
    return unwrapResponse(response);
  },

  async getFinalTranscript(roomCode) {
    const response = await axiosClient.get(`/rooms/${roomCode}/transcript/final`);
    return unwrapResponse(response);
  },

  async getMergedTranscript(roomCode) {
    const response = await axiosClient.get(`/rooms/${roomCode}/transcript/merged`);
    return unwrapResponse(response);
  },

  async finalizeTranscript(roomCode) {
    const response = await axiosClient.post(`/rooms/${roomCode}/transcript/finalize`);
    return unwrapResponse(response);
  },

  async getSummary(roomCode) {
    const response = await axiosClient.get(`/rooms/${roomCode}/summary`);
    return unwrapResponse(response);
  },

  async updateSummary(roomCode, payload) {
    const response = await axiosClient.put(`/rooms/${roomCode}/summary`, payload);
    return unwrapResponse(response);
  },

  async downloadSummary(roomCode, format = 'pdf') {
    return axiosClient.get(`/rooms/${roomCode}/summary/download`, {
      params: { format },
      responseType: 'blob',
    });
  },

  // Giữ tương thích ngược: tải PDF
  async downloadPdfSummary(roomCode) {
    return this.downloadSummary(roomCode, 'pdf');
  },
};
