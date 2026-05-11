/**
 * API Client para Github-pullrequest-ms
 *
 * Este cliente fue generado automáticamente desde OpenAPI/Smithy.
 * NO editar los archivos en pullrequest-client/ directamente.
 */

import { Configuration, DefaultApi } from './pullrequest-client';

// URL del backend de pull requests
const PR_API_URL = process.env.NEXT_PUBLIC_PR_API_URL || 'http://localhost:8082/api';

// Token key para localStorage (debe coincidir con auth-context)
const TOKEN_KEY = 'github_clone_token';

// Función para obtener el token actual
function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(TOKEN_KEY) || undefined;
}

// Configuración del cliente con autenticación dinámica
const configuration = new Configuration({
  basePath: PR_API_URL,
  accessToken: async () => {
    const token = getAccessToken();
    return token || '';
  },
});

// Instancia singleton del cliente
export const pullRequestsApi = new DefaultApi(configuration);

// Factory para crear instancia con token específico (útil para SSR)
export function createPullRequestsApiClient(token?: string) {
  const config = new Configuration({
    basePath: PR_API_URL,
    accessToken: token ? async () => token : undefined,
  });
  return new DefaultApi(config);
}

// Re-exportar tipos para uso conveniente
export * from './pullrequest-client/models';
