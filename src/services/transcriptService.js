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

  async downloadPdfSummary(roomCode) {
    return axiosClient.get(`/rooms/${roomCode}/summary/download`, {
      responseType: 'blob'
    });
  },
};
