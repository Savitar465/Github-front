'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserManager, User as OidcUser, WebStorageStateStore } from 'oidc-client-ts';

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
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'github_clone_token';
const USER_KEY = 'github_clone_user';

// Configuración de Keycloak OIDC
const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'github-files';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'github-front';
const USE_KEYCLOAK = process.env.NEXT_PUBLIC_USE_KEYCLOAK === 'true';

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

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

    try {
      if (USE_KEYCLOAK && username && password) {
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

        setState({
          user,
          token: data.access_token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        // Mock login para desarrollo
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (username === 'demo' && password === 'demo') {
          const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_for_dev';
          const mockUser: User = {
            id: '1',
            username: 'davichox',
            email: 'davi@example.com',
            name: 'David Chavez',
            avatarUrl: undefined,
          };

          localStorage.setItem(TOKEN_KEY, mockToken);
          localStorage.setItem(USER_KEY, JSON.stringify(mockUser));

          setState({
            user: mockUser,
            token: mockToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          throw new Error('Credenciales inválidas');
        }
      }
    } catch (error) {
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
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  const getToken = useCallback(() => {
    return state.token;
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, getToken, loginWithKeycloak }}>
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
