import { createContext, useContext, useMemo, useState } from 'react';
import { clearAuthTokens, clearStoredUser, getStoredUser, isAuthenticated, logout as performLogout, persistAuthSession, setStoredUser } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  const setSession = (responseData) => {
    const session = persistAuthSession(responseData);

    setAuthenticated(Boolean(session.accessToken));
    setUser(session.user);

    return session;
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    setStoredUser(nextUser);
  };

  const clearSession = () => {
    clearAuthTokens();
    clearStoredUser();
    setUser(null);
    setAuthenticated(false);
  };

  const signOut = async () => {
    await performLogout();
    clearSession();
  };

  const value = useMemo(
    () => ({
      user,
      setUser: updateUser,
      setSession,
      signOut,
      isAuthenticated: authenticated,
      clearSession,
    }),
    [authenticated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
