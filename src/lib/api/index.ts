/**
 * API Client para Github-files-ms
 *
 * Este cliente fue generado automáticamente desde Smithy/OpenAPI.
 * NO editar los archivos en github-files-client/ directamente.
 *
 * Para regenerar:
 * cd C:/Python/Github-files-ms/smithy
 * ./gradlew.bat generateFilesTypeScriptClient --no-daemon
 */

import { DefaultApi, Configuration } from './github-files-client/src';

// Token key para localStorage (debe coincidir con auth-context)
const TOKEN_KEY = 'github_clone_token';

// Función para obtener la URL base del API
function getApiBaseUrl(): string {
  const isServer = typeof window === 'undefined';
  const envUrl = process.env.NEXT_PUBLIC_API_URL || '/api/files';
  const proxyPath = '/api/files';

  // En servidor: si la URL es relativa, usar http://localhost:3000 + ruta relativa
  // Esto accede al proxy de Next.js en el mismo servidor. Si se configuró una URL
  // absoluta en env, úsala para llamadas SSR.
  if (isServer) {
    if (!envUrl.startsWith('http')) {
      return `http://localhost:3000${envUrl}`;
    }
    return envUrl;
  }

  // En cliente (browser): siempre usar la ruta proxy de la misma origin para evitar CORS.
  return envUrl.startsWith('/') ? envUrl : proxyPath;
}

// Función para obtener el token actual
function getAccessToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(TOKEN_KEY) || undefined;
}

// Configuración del cliente con autenticación dinámica
const configuration = new Configuration({
  basePath: getApiBaseUrl(),
  accessToken: async () => {
    const token = getAccessToken();
    return token || '';
  },
});

// Instancia singleton del cliente
export const filesApi = new DefaultApi(configuration);

// Factory para crear instancia con token específico (útil para SSR)
export function createApiClient(token?: string) {
  const config = new Configuration({
    basePath: getApiBaseUrl(),
    accessToken: token ? async () => token : undefined,
  });
  return new DefaultApi(config);
}

// Re-exportar tipos para uso conveniente
export * from './github-files-client/src/models';
export type {
  CompareCommitsRequest,
  CreateFileRequest,
  CreateFolderRequest,
  DeleteFileRequest,
  GetCommitRequest,
  GetCommitDiffRequest,
  GetFileContentRequest,
  GetRawFileRequest,
  GetRepositoryContentsRequest,
  ListCommitsRequest,
  UpdateFileRequest,
} from './github-files-client/src/apis/DefaultApi';
