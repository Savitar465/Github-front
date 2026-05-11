import type { CreateOrganizationPayload, OrganizationDTO } from "@/types/organization";

const API_BASE = typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "") : "";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { Authorization: `Bearer ${API_TOKEN}`, ...extra };
}

export async function getMyOrganizations(): Promise<OrganizationDTO[]> {
  const res = await fetch(`${API_BASE}/v1/user/orgs`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener organizaciones");
  const data = await res.json();
  return data.organizations;
}

export async function createOrganization(
  payload: CreateOrganizationPayload
): Promise<OrganizationDTO> {
  const res = await fetch(`${API_BASE}/v1/orgs`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear organización");
  return res.json();
}

export async function deleteOrganization(orgName: string): Promise<void> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error al eliminar organización (${res.status}): ${body || "sin respuesta"}`);
  }
}
