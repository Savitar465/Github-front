'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { Loader2 } from 'lucide-react';

const KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8180';
const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'github-files';
const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'github-front';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const userManager = new UserManager({
          authority: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}`,
          client_id: KEYCLOAK_CLIENT_ID,
          redirect_uri: `${window.location.origin}/auth/callback`,
          response_type: 'code',
          scope: 'openid profile email',
          userStore: new WebStorageStateStore({ store: window.localStorage }),
        });

        await userManager.signinRedirectCallback();
        router.push('/repos');
      } catch (err) {
        console.error('Error handling auth callback:', err);
        setError('Error al procesar la autenticación. Por favor intenta de nuevo.');
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-destructive mb-2">Error de autenticación</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <a href="/login" className="text-blue-500 hover:underline">
            Volver al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Procesando autenticación...</p>
      </div>
    </div>
  );
}
