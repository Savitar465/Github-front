/**
 * API Client para Github-pullrequest-ms
 *
 * Este cliente fue generado automáticamente desde OpenAPI/Smithy.
 * NO editar los archivos en pullrequest-client/ directamente.
 */

import { Configuration, DefaultApi, Middleware, ResponseContext } from './pullrequest-client';
import { triggerUnauthorizedRedirect } from '@/lib/auth/global-auth-handler';

// Determinar la URL base del API según el entorno
function getPullRequestApiUrl(): string {
  const isServer = typeof window === 'undefined';
  const envUrl = process.env.NEXT_PUBLIC_PR_API_URL || '/api/pullrequest';
  const proxyPath = '/api/pullrequest';

  // En servidor: usar URL directa si está configurada, sino usar proxy en localhost:3000
  if (isServer) {
    if (!envUrl.startsWith('http')) {
      return `http://localhost:3000${envUrl}`;
    }
    return envUrl;
  }

  // En cliente (navegador): siempre usar el proxy de Next.js para evitar CORS
  return envUrl.startsWith('/') ? envUrl : proxyPath;
}

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
      console.log('[PullRequestsAPI] 401 Unauthorized - redirecting to login');
      triggerUnauthorizedRedirect();
    }
    return context.response;
  },
};

// Configuración del cliente con autenticación dinámica
const configuration = new Configuration({
  basePath: getPullRequestApiUrl(),
  accessToken: async () => {
    const token = getAccessToken();
    return token || '';
  },
  middleware: [unauthorizedMiddleware],
});

// Instancia singleton del cliente
export const pullRequestsApi = new DefaultApi(configuration);

// Factory para crear instancia con token específico (útil para SSR)
export function createPullRequestsApiClient(token?: string) {
  const config = new Configuration({
    basePath: getPullRequestApiUrl(),
    accessToken: token ? async () => token : undefined,
  });
  return new DefaultApi(config);
}

// Función para cerrar un PR (no está en el cliente generado)
export async function closePullRequest(
  owner: string,
  repo: string,
  prNumber: number
): Promise<void> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : undefined;
  const basePath = getPullRequestApiUrl();

  const response = await fetch(`${basePath}/v1/repos/${owner}/${repo}/pulls/${prNumber}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status: 'closed' }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al cerrar el pull request');
  }
}

// Re-exportar tipos para uso conveniente
export * from './pullrequest-client/models';
