import type {
  AddTeamRepoPayload,
  CreateTeamPayload,
  TeamDTO,
  TeamMemberDTO,
  TeamRepoDTO,
  UpdateTeamPayload,
} from "@/types/team";

const API_BASE = typeof window === "undefined" ? (process.env.NEXT_PUBLIC_API_URL ?? "") : "";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { Authorization: `Bearer ${API_TOKEN}`, ...extra };
}

export async function getOrgTeams(orgName: string): Promise<TeamDTO[]> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener equipos");
  const data = await res.json();
  return data.teams;
}

export async function getTeam(orgName: string, teamId: string): Promise<TeamDTO> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams/${teamId}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener equipo");
  return res.json();
}

export async function createTeam(orgName: string, payload: CreateTeamPayload): Promise<TeamDTO> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear equipo");
  return res.json();
}

export async function updateTeam(
  orgName: string,
  teamId: string,
  payload: UpdateTeamPayload
): Promise<TeamDTO> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams/${teamId}`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar equipo");
  return res.json();
}

export async function deleteTeam(orgName: string, teamId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams/${teamId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar equipo");
}

export async function getTeamMembers(orgName: string, teamId: string): Promise<TeamMemberDTO[]> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/members`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener miembros del equipo");
  const data = await res.json();
  return data.members;
}

export async function addTeamMember(
  orgName: string,
  teamId: string,
  username: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/members/${username}`,
    { method: "PUT", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Error al agregar miembro al equipo");
}

export async function removeTeamMember(
  orgName: string,
  teamId: string,
  username: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/members/${username}`,
    { method: "DELETE", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Error al quitar miembro del equipo");
}

export async function getTeamRepos(orgName: string, teamId: string): Promise<TeamRepoDTO[]> {
  const res = await fetch(`${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/repos`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener repos del equipo");
  const data = await res.json();
  return data.repos;
}

export async function addTeamRepo(
  orgName: string,
  teamId: string,
  repoName: string,
  payload: AddTeamRepoPayload
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/repos/${repoName}`,
    {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Error al asignar repo al equipo");
}

export async function removeTeamRepo(
  orgName: string,
  teamId: string,
  repoName: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/v1/orgs/${orgName}/teams/${teamId}/repos/${repoName}`,
    { method: "DELETE", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Error al quitar repo del equipo");
}
