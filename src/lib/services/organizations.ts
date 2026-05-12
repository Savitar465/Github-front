import type { CreateOrganizationPayload, OrganizationDTO } from "@/types/organization";

const API_BASE = process.env.NEXT_PUBLIC_ORG_API_URL ?? "http://localhost:8083";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("github_clone_token") || "";
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getToken();
  console.log("[Orgs] Token presente:", !!token, token ? `${token.substring(0, 20)}...` : "null");
  return { Authorization: `Bearer ${token}`, ...extra };
}

export async function getMyOrganizations(): Promise<OrganizationDTO[]> {
  const url = `${API_BASE}/v1/user/orgs`;
  const headers = authHeaders();

  console.log("[Orgs] ====== getMyOrganizations ======");
  console.log("[Orgs] URL:", url);
  console.log("[Orgs] API_BASE:", API_BASE);
  console.log("[Orgs] Headers:", JSON.stringify(headers));

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers,
    });
    console.log("[Orgs] Response status:", res.status, res.statusText);
    console.log("[Orgs] Response headers:", JSON.stringify(Object.fromEntries(res.headers.entries())));

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Orgs] Error response body:", errorText || "(vacío)");
      throw new Error(`Error al obtener organizaciones (${res.status})`);
    }
    const data = await res.json();
    console.log("[Orgs] Data recibida:", data);
    return data.organizations;
  } catch (err) {
    console.error("[Orgs] Fetch error:", err);
    throw err;
  }
}

export async function createOrganization(
  payload: CreateOrganizationPayload
): Promise<OrganizationDTO> {
  const url = `${API_BASE}/v1/orgs`;
  console.log("[Orgs] createOrganization llamando a:", url, payload);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    });
    console.log("[Orgs] Create response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Orgs] Create error:", errorText);
      throw new Error("Error al crear organización");
    }
    return res.json();
  } catch (err) {
    console.error("[Orgs] Create fetch error:", err);
    throw err;
  }
}

export async function deleteOrganization(orgName: string): Promise<void> {
  const url = `${API_BASE}/v1/orgs/${orgName}`;
  console.log("[Orgs] deleteOrganization llamando a:", url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(),
    });
    console.log("[Orgs] Delete response status:", res.status);

    if (!res.ok) {
      const body = await res.text();
      console.error("[Orgs] Delete error:", body);
      throw new Error(`Error al eliminar organización (${res.status}): ${body || "sin respuesta"}`);
    }
  } catch (err) {
    console.error("[Orgs] Delete fetch error:", err);
    throw err;
  }
}
