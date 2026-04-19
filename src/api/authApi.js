import axiosClient from './axiosClient';
import { tokenStorage } from './tokenStorage';

export const extractTokens = (responseData = {}) => {
  const accessToken = responseData?.data?.accessToken;
  const refreshToken = responseData?.data?.refreshToken;

  return {
    accessToken,
    refreshToken,
  };
};

export const authApi = {
  register: (payload) => axiosClient.post('/auth/register', payload),
  login: (payload) => axiosClient.post('/auth/login', payload),
  logout: (payload) => axiosClient.post('/auth/logout', payload),
  refreshToken: (payload) => axiosClient.post('/auth/refresh', payload),
  verifyEmail: (token) => axiosClient.get('/auth/verify-email', { params: { token } }),
  forgotPassword: (payload) => axiosClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => axiosClient.post('/auth/reset-password', payload),
  persistTokensFromResponse: (responseData) => {
    const tokens = extractTokens(responseData);
    tokenStorage.setTokens(tokens);
    return tokens;
  },
};
