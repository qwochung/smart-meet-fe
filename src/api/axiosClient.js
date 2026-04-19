import axios from 'axios';
import apiConfig from '../configs/apiConfig';
import { tokenStorage } from './tokenStorage';

const axiosClient = axios.create({
  baseURL: apiConfig.apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: apiConfig.apiURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isAuthPath = (url = '') =>
  url.includes('/auth/login') ||
  url.includes('/auth/register') ||
  url.includes('/auth/refresh') ||
  url.includes('/auth/logout') ||
  url.includes('/auth/forgot-password') ||
  url.includes('/auth/reset-password') ||
  url.includes('/auth/verify-email');

const extractAccessToken = (responseData = {}) => responseData?.data?.accessToken;

const extractRefreshToken = (responseData = {}) => responseData?.data?.refreshToken;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, accessToken = null) => {
  failedQueue.forEach((queueItem) => {
    if (error) {
      queueItem.reject(error);
      return;
    }

    queueItem.resolve(accessToken);
  });
  failedQueue = [];
};

// Interceptor cho request: Tự động đính kèm Token
axiosClient.interceptors.request.use(async (config) => {
  const token = tokenStorage.getAccessToken();
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
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      throw error;
    }

    const shouldHandle401 =
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthPath(originalRequest.url || '');

    if (!shouldHandle401) {
      throw error;
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clearTokens();
      window.location.href = '/auth/login';
      throw error;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post('/auth/refresh', {
        refreshToken,
      });

      const responseData = refreshResponse?.data || {};
      const newAccessToken = extractAccessToken(responseData);
      const newRefreshToken = extractRefreshToken(responseData);

      if (!newAccessToken) {
        throw new Error('Refresh response does not contain access token');
      }

      tokenStorage.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || refreshToken,
      });

      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clearTokens();
      window.location.href = '/auth/login';
      throw refreshError;
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;