import axiosClient from "./axiosClient";

export const documentApi = {
  uploadDocuments: async (roomCode, { files = [], description } = {}) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (description && String(description).trim()) {
      formData.append("description", String(description).trim());
    }

    return axiosClient.post(`/rooms/${roomCode}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getDocuments: async (roomCode) => {
    return axiosClient.get(`/rooms/${roomCode}/documents`);
  },

  downloadDocument: async (roomCode, documentId) => {
    return axiosClient.get(`/rooms/${roomCode}/documents/${documentId}`, {
      responseType: "blob",
    });
  },

  deleteDocument: async (roomCode, documentId) => {
    return axiosClient.delete(`/rooms/${roomCode}/documents/${documentId}`);
  },
};
