/**
 * API Client para Github-ms-users
 *
 * Este cliente fue generado automáticamente desde OpenAPI.
 * NO editar los archivos en users-client/ directamente.
 */

import {
  Configuration,
  UserControllerApi,
  KeycloakRolesControllerApi,
  KeycloakPermissionsControllerApi,
  KeycloakClientesControllerApi,
  Middleware,
  ResponseContext,
} from './users-client';
import { triggerUnauthorizedRedirect } from '@/lib/auth/global-auth-handler';

// URL del backend de usuarios
// Relative path — Next.js rewrites proxy this to NEXT_PUBLIC_USERS_API_URL at runtime.
const USERS_API_URL = '/api/users';

// Token key para localStorage (debe coincidir con auth-context)
const TOKEN_KEY = 'github_clone_token';

// Función para obtener el token actual
function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(TOKEN_KEY) || undefined;
}

// Middleware para manejar errores 401 y redirigir al login
const unauthorizedMiddleware: Middleware = {
  post: async (context: ResponseContext): Promise<Response | void> => {
    if (context.response.status === 401) {
      console.log('[UsersAPI] 401 Unauthorized - redirecting to login');
      triggerUnauthorizedRedirect();
    }
    return context.response;
  },
};

// Configuración del cliente con autenticación dinámica
const configuration = new Configuration({
  basePath: USERS_API_URL,
  accessToken: async () => {
    const token = getAccessToken();
    return token || '';
  },
  middleware: [unauthorizedMiddleware],
});

// Instancias singleton de los clientes
export const usersApi = new UserControllerApi(configuration);
export const keycloakRolesApi = new KeycloakRolesControllerApi(configuration);
export const keycloakPermissionsApi = new KeycloakPermissionsControllerApi(configuration);
export const keycloakClientsApi = new KeycloakClientesControllerApi(configuration);

// Factory para crear instancia con token específico (útil para SSR)
export function createUsersApiClient(token?: string) {
  const config = new Configuration({
    basePath: USERS_API_URL,
    accessToken: token ? async () => token : undefined,
  });
  return {
    users: new UserControllerApi(config),
    roles: new KeycloakRolesControllerApi(config),
    permissions: new KeycloakPermissionsControllerApi(config),
    clients: new KeycloakClientesControllerApi(config),
  };
}

// Re-exportar tipos para uso conveniente
export * from './users-client/models';
