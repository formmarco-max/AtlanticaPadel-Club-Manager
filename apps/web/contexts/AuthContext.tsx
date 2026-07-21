'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { api } from '@/lib/api';
import type {
  AuthContextType,
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

interface ApiResponse<T> {
  data: T;
}

const ACCESS_TOKEN_KEY = 'accessToken';
const AUTH_USER_KEY = 'authUser';
const TOKEN_EXPIRATION_KEY = 'tokenExpiresAt';

function clearStoredSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRATION_KEY);
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredSession();
    setUser(null);

    window.location.href = '/login';
  }, []);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedUser = localStorage.getItem(AUTH_USER_KEY);
      const storedExpiration = localStorage.getItem(
        TOKEN_EXPIRATION_KEY,
      );

      if (!accessToken || !storedUser || !storedExpiration) {
        clearStoredSession();
        return;
      }

      const expiresAt = Number(storedExpiration);

      if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
        clearStoredSession();
        return;
      }

      const parsedUser = JSON.parse(storedUser) as AuthUser;

      if (
        !parsedUser ||
        !parsedUser.id ||
        !parsedUser.email ||
        !parsedUser.role
      ) {
        clearStoredSession();
        return;
      }

      setUser(parsedUser);
    } catch {
      clearStoredSession();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      const response = await api.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        credentials,
      );

      const loginData = response.data.data;

      const {
        accessToken,
        expiresIn,
        user: authenticatedUser,
      } = loginData;

      const expiresAt = Date.now() + expiresIn * 1000;

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify(authenticatedUser),
      );
      localStorage.setItem(
        TOKEN_EXPIRATION_KEY,
        expiresAt.toString(),
      );

      setUser(authenticatedUser);
    },
    [],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}