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

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "";

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return { Authorization: `Bearer ${API_TOKEN}`, ...extra };
}

export async function listIssues(
  owner: string,
  repo: string,
  params?: { state?: string; label?: string; assignee?: string; page?: number; perPage?: number }
): Promise<ListIssuesBody> {
  const query = new URLSearchParams();
  if (params?.state) query.set("state", params.state);
  if (params?.label) query.set("label", params.label);
  if (params?.assignee) query.set("assignee", params.assignee);
  if (params?.page) query.set("page", String(params.page));
  if (params?.perPage) query.set("perPage", String(params.perPage));
  const qs = query.toString();
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues${qs ? `?${qs}` : ""}`,
    { cache: "no-store", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Error al obtener issues");
  return res.json();
}

export async function createIssue(
  owner: string,
  repo: string,
  payload: CreateIssuePayload
): Promise<IssueDTO> {
  const res = await fetch(`${API_BASE}/v1/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear issue");
  return res.json();
}

export async function getIssue(
  owner: string,
  repo: string,
  issueNumber: number
): Promise<IssueDTO> {
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}`,
    { cache: "no-store", headers: authHeaders() }
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
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Error al actualizar issue");
  return res.json();
}

export async function listIssueComments(
  owner: string,
  repo: string,
  issueNumber: number
): Promise<ListIssueCommentsBody> {
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    { cache: "no-store", headers: authHeaders() }
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
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Error al crear comentario");
  return res.json();
}

export async function listLabels(owner: string, repo: string): Promise<ListLabelsBody> {
  const res = await fetch(
    `${API_BASE}/v1/repos/${owner}/${repo}/labels`,
    { cache: "no-store", headers: authHeaders() }
  );
  if (!res.ok) throw new Error("Error al obtener labels");
  return res.json();
}

export async function createLabel(
  owner: string,
  repo: string,
  payload: CreateLabelPayload
): Promise<LabelDTO> {
  const res = await fetch(`${API_BASE}/v1/repos/${owner}/${repo}/labels`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al crear label");
  return res.json();
}
