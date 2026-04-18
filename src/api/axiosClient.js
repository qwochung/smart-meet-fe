import axios from 'axios';
import apiConfig from '../configs/apiConfig';

const axiosClient = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho request: Tự động đính kèm Token
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor cho response: Xử lý lỗi chung (như 401 Unauthorized)
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle refresh token hoặc redirect về login ở đây
    throw error;
  }
);

export default axiosClient;