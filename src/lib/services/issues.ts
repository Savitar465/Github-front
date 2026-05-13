import type {
  CommentDTO,
  CreateCommentPayload,
  CreateIssuePayload,
  CreateLabelPayload,
  IssueDTO,
  LabelDTO,
  ListIssueCommentsBody,
  ListIssuesBody,
  ListLabelsBody,
  UpdateIssuePayload,
} from "@/types/issue";

const API_BASE =
  typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_ISSUES_API_URL ?? "")
    : "/issues";

function getClientToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("github_clone_token") || "";
}

function buildAuthHeaders(token?: string, extra?: Record<string, string>): Record<string, string> {
  const authToken = token || getClientToken();
  if (authToken) {
    return { Authorization: `Bearer ${authToken}`, ...extra };
  }
  return extra || {};
}

// Server-side function accepts token parameter
export async function listIssues(
  owner: string,
  repo: string,
  params?: { state?: string; label?: string; assignee?: string; page?: number; perPage?: number },
  token?: string
): Promise<ListIssuesBody> {
  const query = new URLSearchParams();
  if (params?.state) query.set("state", params.state);
  if (params?.label) query.set("label", params.label);
  if (params?.assignee) query.set("assignee", params.assignee);
  if (params?.page) query.set("page", String(params.page));
  if (params?.perPage) query.set("perPage", String(params.perPage));
  const qs = query.toString();
  const url = `${API_BASE}/v1/repos/${owner}/${repo}/issues${qs ? `?${qs}` : ""}`;

  console.log("[Issues] ====== listIssues ======");
  console.log("[Issues] API_BASE:", API_BASE);
  console.log("[Issues] URL:", url);
  console.log("[Issues] isServer:", typeof window === "undefined");
  console.log("[Issues] Has token param:", !!token);

  try {
    const headers = buildAuthHeaders(token);
    console.log("[Issues] Has auth header:", !!headers.Authorization);
    const res = await fetch(url, { cache: "no-store", headers });
    console.log("[Issues] Response status:", res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Issues] Error response:", errorText);
      throw new Error("Error al obtener issues");
    }
    return res.json();
  } catch (err) {
    console.error("[Issues] Fetch error:", err);
    throw err;
  }
}

export async function createIssue(
  owner: string,
  repo: string,
  payload: CreateIssuePayload
): Promise<IssueDTO> {
  const headers = buildAuthHeaders(undefined, { "Content-Type": "application/json" });
  const res = await fetch(`${API_BASE}/v1/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear issue");
  return res.json();
}

export async function getIssue(
  owner: string,
  repo: string,
  issueNumber: number,
  token?: string
): Promise<IssueDTO> {
  const headers = buildAuthHeaders(token);
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}`,
    { cache: "no-store", headers }
  );
  if (!res.ok) throw new Error("Error al obtener issue");
  return res.json();
}

export async function updateIssue(
  owner: string,
  repo: string,
  issueNumber: number,
  payload: UpdateIssuePayload
): Promise<IssueDTO> {
  const headers = buildAuthHeaders(undefined, { "Content-Type": "application/json" });
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Error al actualizar issue");
  return res.json();
}

export async function listIssueComments(
  owner: string,
  repo: string,
  issueNumber: number,
  token?: string
): Promise<ListIssueCommentsBody> {
  const headers = buildAuthHeaders(token);
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    { cache: "no-store", headers }
  );
  if (!res.ok) throw new Error("Error al obtener comentarios");
  return res.json();
}

export async function createIssueComment(
  owner: string,
  repo: string,
  issueNumber: number,
  payload: CreateCommentPayload
): Promise<CommentDTO> {
  const headers = buildAuthHeaders(undefined, { "Content-Type": "application/json" });
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Error al crear comentario");
  return res.json();
}

export async function listLabels(
  owner: string,
  repo: string,
  token?: string
): Promise<ListLabelsBody> {
  const headers = buildAuthHeaders(token);
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/labels`,
    { cache: "no-store", headers }
  );
  if (!res.ok) throw new Error("Error al obtener labels");
  return res.json();
}

export async function createLabel(
  owner: string,
  repo: string,
  payload: CreateLabelPayload
): Promise<LabelDTO> {
  const headers = buildAuthHeaders(undefined, { "Content-Type": "application/json" });
  const res = await fetch(`${API_BASE}/v1/repos/${owner}/${repo}/labels`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear label");
  return res.json();
}
