import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'github_clone_token';

/**
 * Obtiene el token de autenticación desde las cookies del servidor.
 * Solo funciona en Server Components, Server Actions y Route Handlers.
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(TOKEN_COOKIE_NAME);
    return tokenCookie?.value || null;
  } catch (error) {
    console.error('[ServerAuth] Error reading token from cookies:', error);
    return null;
  }
}

/**
 * Obtiene los headers de autorización para peticiones desde el servidor.
 */
export async function getServerAuthHeaders(): Promise<Record<string, string>> {
  const token = await getServerToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
