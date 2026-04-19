import { authApi, extractTokens } from '../api/authApi';
import { tokenStorage } from '../api/tokenStorage';

export const isAuthenticated = () => tokenStorage.hasAccessToken();

export const persistAuthTokens = (responseData) => {
  const tokens = extractTokens(responseData);
  tokenStorage.setTokens(tokens);
  return tokens;
};

export const clearAuthTokens = () => {
  tokenStorage.clearTokens();
};

export const logout = async () => {
  const refreshToken = tokenStorage.getRefreshToken();

  try {
    if (refreshToken) {
      await authApi.logout({ refreshToken });
    }
  } catch (error) {
    // Ignore logout API failure and clear local session anyway.
  } finally {
    tokenStorage.clearTokens();
  }
};
