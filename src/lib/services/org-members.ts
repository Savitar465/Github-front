import type {
  AddMemberPayload,
  OrgMember,
  OrgMembersResponse,
  UpdateRolePayload,
} from "@/types/org-member";

const API_BASE = process.env.NEXT_PUBLIC_ORG_API_URL ?? "http://localhost:8085";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("github_clone_token") || "";
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    Authorization: `Bearer ${getToken()}`,
    ...extra,
  };
}

export async function getOrgMembers(orgName: string): Promise<OrgMember[]> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/members`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener colaboradores");
  const data: OrgMembersResponse = await res.json();
  return data.members;
}

export async function addOrgMember(
  orgName: string,
  payload: AddMemberPayload
): Promise<OrgMember> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/members`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al invitar colaborador");
  return res.json();
}

export async function updateOrgMemberRole(
  orgName: string,
  username: string,
  payload: UpdateRolePayload
): Promise<OrgMember> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/members/${username}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar rol");
  return res.json();
}

export async function removeOrgMember(orgName: string, username: string): Promise<void> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/members/${username}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar colaborador");
}
