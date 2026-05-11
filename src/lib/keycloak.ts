interface CachedToken {
  value: string;
  expiresAt: number;
}

let cache: CachedToken | null = null;

export async function getServiceToken(): Promise<string> {
  const now = Date.now();

  if (cache && cache.expiresAt > now + 30_000) {
    return cache.value;
  }

  const res = await fetch(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      }).toString(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("[keycloak] Token request failed:", body);
    throw new Error(`Keycloak token request failed: ${res.status}`);
  }

  const data = await res.json();
  cache = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return cache.value;
}
