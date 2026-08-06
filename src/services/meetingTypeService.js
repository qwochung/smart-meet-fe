import axiosClient from '../api/axiosClient';

const unwrapResponse = (response) => response?.data ?? response ?? {};

export const meetingTypeService = {
  /** Toàn bộ loại cuộc họp của user, kèm trạng thái bật/tắt. */
  async getMeetingTypes() {
    const response = await axiosClient.get('/meeting-types');
    return unwrapResponse(response);
  },

  /** Chỉ các loại đang bật — dùng cho dropdown tạo cuộc họp. */
  async getEnabledMeetingTypes() {
    const response = await axiosClient.get('/meeting-types', { params: { enabledOnly: true } });
    return unwrapResponse(response);
  },

  /** Danh mục các mục nội dung để dựng checkbox khi tạo loại tùy chỉnh. */
  async getSummaryFields() {
    const response = await axiosClient.get('/meeting-types/summary-fields');
    return unwrapResponse(response);
  },

  async createCustomType(payload) {
    const response = await axiosClient.post('/meeting-types', payload);
    return unwrapResponse(response);
  },

  async updateCustomType(id, payload) {
    const response = await axiosClient.put(`/meeting-types/${id}`, payload);
    return unwrapResponse(response);
  },

  async deleteCustomType(id) {
    const response = await axiosClient.delete(`/meeting-types/${id}`);
    return unwrapResponse(response);
  },

  /** payload: [{ typeCode, enabled }] */
  async updatePreferences(preferences) {
    const response = await axiosClient.put('/meeting-types/preferences', preferences);
    return unwrapResponse(response);
  },
};
