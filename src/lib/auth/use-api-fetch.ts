'use client';

import { useCallback } from 'react';
import { useAuth } from './auth-context';
import { triggerUnauthorizedRedirect } from './global-auth-handler';

type FetchOptions = RequestInit & {
  skipAuthRedirect?: boolean;
};

/**
 * Hook that wraps fetch with automatic 401 handling.
 * When a 401 response is received, it automatically redirects to login.
 */
export function useApiFetch() {
  const { getToken, handleUnauthorized, isTokenExpired } = useAuth();

  const apiFetch = useCallback(
    async <T = unknown>(url: string, options: FetchOptions = {}): Promise<T> => {
      const { skipAuthRedirect = false, ...fetchOptions } = options;

      // Check if token is expired before making the request
      if (isTokenExpired() && !skipAuthRedirect) {
        handleUnauthorized();
        throw new Error('Token expired');
      }

      const token = getToken();

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(fetchOptions.headers || {}),
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401 && !skipAuthRedirect) {
        handleUnauthorized();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    },
    [getToken, handleUnauthorized, isTokenExpired]
  );

  return apiFetch;
}

/**
 * Global fetch wrapper that can be used outside of React components.
 * Requires setupGlobalAuthHandler to be called first (done by AuthProvider).
 */
export async function authFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    triggerUnauthorizedRedirect();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
