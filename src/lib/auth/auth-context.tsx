'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { UserManager, User as OidcUser, WebStorageStateStore } from 'oidc-client-ts';
import { useRouter } from 'next/navigation';
import { setupGlobalAuthHandler } from './global-auth-handler';

type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  loginWithKeycloak: () => Promise<void>;
  handleUnauthorized: () => void;
  isTokenExpired: () => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'github_clone_token';
const USER_KEY = 'github_clone_user';

// URL del microservicio de usuarios
const USERS_API_URL = process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:8081';

// Configuración de Keycloak OIDC
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'github-files';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'github-front';
const USE_KEYCLOAK = process.env.NEXT_PUBLIC_USE_KEYCLOAK === 'true';
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Crear UserManager solo si estamos en el cliente
let userManager: UserManager | null = null;

function getUserManager(): UserManager | null {
  if (typeof window === 'undefined') return null;

  if (!userManager && USE_KEYCLOAK) {
    userManager = new UserManager({
      authority: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
      client_id: KEYCLOAK_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      post_logout_redirect_uri: window.location.origin,
      response_type: 'code',
      scope: 'openid profile email',
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      automaticSilentRenew: true,
    });
  }

  return userManager;
}

function parseOidcUser(oidcUser: OidcUser): User {
  const profile = oidcUser.profile;
  return {
    id: profile.sub,
    username: profile.preferred_username || profile.sub,
    email: profile.email || '',
    name: profile.name || profile.preferred_username || 'Usuario',
    avatarUrl: undefined,
  };
}

// Helper function to check if JWT token is expired
function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;

    // Check if token expires in less than 30 seconds (buffer time)
    const expiresAt = payload.exp * 1000;
    return Date.now() >= expiresAt - 30000;
  } catch {
    return true;
  }
}

// Helper para guardar/eliminar token en cookie via API
async function setTokenCookie(token: string): Promise<void> {
  try {
    await fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error('[Auth] Error setting token cookie:', error);
  }
}

async function deleteTokenCookie(): Promise<void> {
  try {
    await fetch('/api/auth/token', { method: 'DELETE' });
  } catch (error) {
    console.error('[Auth] Error deleting token cookie:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const hasRedirected = useRef(false);

  // Cargar sesión existente
  useEffect(() => {
    async function loadSession() {
      if (USE_KEYCLOAK) {
        // Intentar cargar usuario de Keycloak
        const um = getUserManager();
        if (um) {
          try {
            const oidcUser = await um.getUser();
            if (oidcUser && !oidcUser.expired) {
              setState({
                user: parseOidcUser(oidcUser),
                token: oidcUser.access_token,
                isLoading: false,
                isAuthenticated: true,
              });
              return;
            }
          } catch (error) {
            console.error('Error loading OIDC user:', error);
          }
        }
      } else {
        // Modo mock - cargar desde localStorage
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            setState({
              user,
              token: storedToken,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          } catch {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      }

      setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
    }

    loadSession();
  }, []);

  // Login con Keycloak (redirect)
  const loginWithKeycloak = useCallback(async () => {
    const um = getUserManager();
    if (um) {
      await um.signinRedirect();
    }
  }, []);

  // Login con usuario/contraseña (mock o Resource Owner Password)
  const login = useCallback(async (username?: string, password?: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    console.log('[Auth] Login attempt:', { username, USE_KEYCLOAK, USE_MOCK_AUTH, USERS_API_URL });

    try {
      if (USE_KEYCLOAK && username && password) {
        console.log('[Auth] Using Keycloak direct login');
        // Resource Owner Password Grant (si está habilitado en Keycloak)
        const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: KEYCLOAK_CLIENT_ID,
            username,
            password,
            scope: 'openid profile email',
          }),
        });

        if (!response.ok) {
          throw new Error('Credenciales inválidas');
        }

        const data = await response.json();

        // Decodificar el token para obtener info del usuario
        const tokenParts = data.access_token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));

        const user: User = {
          id: payload.sub,
          username: payload.preferred_username || payload.sub,
          email: payload.email || '',
          name: payload.name || payload.preferred_username || 'Usuario',
        };

        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        await setTokenCookie(data.access_token);

        setState({
          user,
          token: data.access_token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else if (USE_MOCK_AUTH) {
        // Mock login para desarrollo (demo/demo)
        console.log('[Auth] Using MOCK auth');
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (username === 'demo' && password === 'demo') {
          const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_for_dev';
          const mockUser: User = {
            id: '1',
            username: 'demo',
            email: 'demo@example.com',
            name: 'Demo User',
          };

          localStorage.setItem(TOKEN_KEY, mockToken);
          localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
          await setTokenCookie(mockToken);

          setState({
            user: mockUser,
            token: mockToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          throw new Error('Credenciales inválidas');
        }
      } else {
        // Login via Users microservice
        const loginUrl = `${USERS_API_URL}/v1/auth/login`;
        console.log('[Auth] Using Users microservice:', loginUrl);
        console.log('[Auth] Request body:', { username, password: '***' });

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        console.log('[Auth] Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Auth] Login failed:', response.status, errorText);
          throw new Error('Credenciales inválidas');
        }

        const data = await response.json();
        console.log('[Auth] Login successful, token received');

        // Decodificar el access_token para obtener info del usuario
        const tokenParts = data.access_token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));

        const user: User = {
          id: payload.sub,
          username: payload.preferred_username || payload.sub,
          email: payload.email || '',
          name: payload.name || payload.preferred_username || 'Usuario',
        };

        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        await setTokenCookie(data.access_token);

        setState({
          user,
          token: data.access_token,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('[Auth] Login error:', error);
      setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    if (USE_KEYCLOAK) {
      const um = getUserManager();
      if (um) {
        try {
          await um.signoutRedirect();
        } catch (error) {
          console.error('Error during logout:', error);
        }
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    await deleteTokenCookie();
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  const getToken = useCallback(() => {
    return state.token;
  }, [state.token]);

  // Check if current token is expired
  const isTokenExpired = useCallback(() => {
    if (!state.token) return true;
    return isJwtExpired(state.token);
  }, [state.token]);

  // Handle 401 Unauthorized - redirect to login
  const handleUnauthorized = useCallback(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;

    console.log('[Auth] Token expired or unauthorized, redirecting to login...');

    // Clear auth state
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    deleteTokenCookie(); // Fire and forget
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });

    // Redirect to login
    router.push('/login');

    // Reset redirect flag after a delay
    setTimeout(() => {
      hasRedirected.current = false;
    }, 2000);
  }, [router]);

  // Setup Keycloak event listeners for token expiration
  useEffect(() => {
    if (!USE_KEYCLOAK) return;

    const um = getUserManager();
    if (!um) return;

    // Token expired event
    const handleTokenExpired = () => {
      console.log('[Auth] Keycloak token expired');
      handleUnauthorized();
    };

    // Silent renew error event
    const handleSilentRenewError = (error: Error) => {
      console.error('[Auth] Silent renew failed:', error);
      handleUnauthorized();
    };

    um.events.addAccessTokenExpired(handleTokenExpired);
    um.events.addSilentRenewError(handleSilentRenewError);

    return () => {
      um.events.removeAccessTokenExpired(handleTokenExpired);
      um.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [handleUnauthorized]);

  // Periodic token expiration check (for non-Keycloak mode)
  useEffect(() => {
    if (USE_KEYCLOAK || !state.isAuthenticated || !state.token) return;

    const checkInterval = setInterval(() => {
      if (isJwtExpired(state.token!)) {
        console.log('[Auth] Token expired (periodic check)');
        handleUnauthorized();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [state.isAuthenticated, state.token, handleUnauthorized]);

  // Setup global auth handler for non-hook API calls
  useEffect(() => {
    setupGlobalAuthHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, getToken, loginWithKeycloak, handleUnauthorized, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
