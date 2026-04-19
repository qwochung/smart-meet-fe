import { authApi, extractTokens } from '../api/authApi';
import { tokenStorage } from '../api/tokenStorage';

const CURRENT_USER_KEY = 'current_user';

const safeParseJson = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeUser = (candidate) => {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const firstName = candidate.firstName || candidate.givenName || candidate.firstname;
  const lastName = candidate.lastName || candidate.surname || candidate.lastname;
  const fullName = candidate.name
    || candidate.fullName
    || candidate.displayName
    || candidate.username
    || [firstName, lastName].filter(Boolean).join(' ').trim();

  const email = candidate.email || candidate.mail || candidate.username || candidate.preferred_username || '';
  const avatar = candidate.avatar || candidate.avatarUrl || candidate.photoURL || candidate.picture || '';
  const id = candidate.id || candidate.userId || candidate.sub || candidate._id || candidate.uid || '';
  const role = candidate.role || candidate.roles?.[0] || '';

  if (!id && !fullName && !email && !avatar && !role) {
    return null;
  }

  return {
    ...candidate,
    id,
    name: fullName || email || 'User',
    email,
    avatar,
    role,
  };
};

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const payload = token.split('.')[1];

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decoded = typeof window !== 'undefined' && typeof window.atob === 'function'
      ? window.atob(paddedPayload)
      : atob(paddedPayload);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const extractUserCandidates = (responseData = {}) => {
  const rootData = responseData?.data ?? responseData;

  return [
    rootData?.user,
    rootData?.currentUser,
    rootData?.userInfo,
    rootData?.profile,
    rootData?.account,
    rootData?.authUser,
    rootData?.userData,
    rootData?.userProfile,
    rootData?.data?.user,
    rootData?.data?.profile,
    rootData?.data?.account,
    rootData?.data,
    rootData,
  ];
};

export const getStoredUser = () => safeParseJson(localStorage.getItem(CURRENT_USER_KEY));

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(CURRENT_USER_KEY);
};

export const clearStoredUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const extractUserFromResponse = (responseData = {}) => {
  for (const candidate of extractUserCandidates(responseData)) {
    const normalizedUser = normalizeUser(candidate);

    if (normalizedUser) {
      return normalizedUser;
    }
  }

  return null;
};

export const extractUserFromToken = (accessToken) => normalizeUser(decodeJwtPayload(accessToken));

export const persistAuthSession = (responseData) => {
  const tokens = extractTokens(responseData);
  tokenStorage.setTokens(tokens);

  const user = extractUserFromResponse(responseData) || extractUserFromToken(tokens.accessToken);
  setStoredUser(user);

  return {
    ...tokens,
    user,
  };
};

export const isAuthenticated = () => tokenStorage.hasAccessToken();

export const persistAuthTokens = (responseData) => {
  const tokens = extractTokens(responseData);
  tokenStorage.setTokens(tokens);
  return tokens;
};

export const clearAuthTokens = () => {
  tokenStorage.clearTokens();
  clearStoredUser();
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
    clearAuthTokens();
  }
};
