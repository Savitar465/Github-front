function getRepositoryApiUrl(): string {
  const isServer = typeof window === 'undefined';
  const envUrl = process.env.NEXT_PUBLIC_REPOSITORY_API_URL || '/api/repository';
  const proxyPath = '/api/repository';

  // On server: if envUrl is relative use the Next.js proxy on localhost:3000,
  // otherwise use the absolute backend URL configured in env.
  if (isServer) {
    if (!envUrl.startsWith('http')) {
      return `http://localhost:3000${envUrl}`;
    }
    return envUrl;
  }

  // On client (browser): always use the same-origin Next.js proxy path to avoid CORS.
  // If the env var contains a relative path, prefer it; otherwise fall back to the proxyPath.
  return envUrl.startsWith('/') ? envUrl : proxyPath;
}

// ============ Types ============

export type RepositoryVisibility = 'public' | 'private';

export type RepositoryDTO = {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  visibility: RepositoryVisibility;
  ownerId: string;
  ownerUsername: string;
  starsCount: number;
  forksCount: number;
  defaultBranch: string;
  language?: string;
  hasIssues: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ListRepositoriesBody = {
  repositories: RepositoryDTO[];
  pagination: PaginationMeta;
};

export type CreateRepositoryBody = {
  name: string;
  description?: string;
  visibility: RepositoryVisibility;
  initWithReadme?: boolean;
  language?: string;
};

export type UpdateRepositoryBody = {
  description?: string;
  visibility?: RepositoryVisibility;
  hasIssues?: boolean;
  language?: string;
};

export type ForkRepositoryBody = {
  name?: string;
  targetOwner?: string;
};

export type BranchDTO = {
  name: string;
  isDefault: boolean;
  commitSha: string;
};

export type ListBranchesBody = {
  branches: BranchDTO[];
};

export type CollaboratorRole = 'read' | 'write' | 'admin' | 'maintain';

export type CollaboratorDTO = {
  userId: string;
  username: string;
  role: CollaboratorRole;
  avatarUrl?: string;
  addedAt: string;
};

export type ListCollaboratorsBody = {
  collaborators: CollaboratorDTO[];
};

export type ListRepositoryForksBody = {
  repositories: RepositoryDTO[];
};

// ============ HTTP Request Helper ============

async function repositoryRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const baseUrl = getRepositoryApiUrl();
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let errorMessage = `Repository API request failed (${response.status})`;

    if (contentType.includes('application/json')) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (body?.message) {
        errorMessage = body.message;
      }
    } else {
      const text = await response.text().catch(() => '');
      if (text) {
        errorMessage = text;
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// ============ Repository API Functions ============

export function listRepositories(
  token: string,
  params: { visibility?: RepositoryVisibility; page?: number; perPage?: number } = {}
) {
  const searchParams = new URLSearchParams();

  if (params.visibility) searchParams.set('visibility', params.visibility);
  if (typeof params.page === 'number') searchParams.set('page', String(params.page));
  if (typeof params.perPage === 'number') searchParams.set('perPage', String(params.perPage));

  const query = searchParams.toString();
  return repositoryRequest<ListRepositoriesBody>(
    `/v1/repos${query ? `?${query}` : ''}`,
    { method: 'GET' },
    token
  );
}

export function getRepository(owner: string, repo: string, token?: string) {
  return repositoryRequest<RepositoryDTO>(`/v1/repos/${owner}/${repo}`, { method: 'GET' }, token);
}

export function createRepository(token: string, body: CreateRepositoryBody) {
  return repositoryRequest<RepositoryDTO>(
    '/v1/repos',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}

export function updateRepository(owner: string, repo: string, token: string, body: UpdateRepositoryBody) {
  return repositoryRequest<RepositoryDTO>(
    `/v1/repos/${owner}/${repo}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
    token
  );
}

export function deleteRepository(owner: string, repo: string, token: string) {
  return repositoryRequest<void>(`/v1/repos/${owner}/${repo}`, { method: 'DELETE' }, token);
}

export function forkRepository(owner: string, repo: string, token: string, body: ForkRepositoryBody = {}) {
  return repositoryRequest<RepositoryDTO>(
    `/v1/repos/${owner}/${repo}/forks`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}

export function listRepositoryForks(owner: string, repo: string, token?: string) {
  return repositoryRequest<ListRepositoryForksBody>(
    `/v1/repos/${owner}/${repo}/forks`,
    { method: 'GET' },
    token
  );
}

// ============ Branch API Functions ============

export function listBranches(owner: string, repo: string, token?: string) {
  return repositoryRequest<ListBranchesBody>(
    `/v1/repos/${owner}/${repo}/branches`,
    { method: 'GET' },
    token
  );
}

export function getBranch(owner: string, repo: string, branch: string, token?: string) {
  return repositoryRequest<BranchDTO>(
    `/v1/repos/${owner}/${repo}/branches/${branch}`,
    { method: 'GET' },
    token
  );
}

export type CreateBranchBody = {
  name: string;
  source?: string; // branch or commit sha to branch from (defaults to defaultBranch)
};

// Create a new branch from a source (branch name or commit sha)
export function createBranch(owner: string, repo: string, token: string, body: CreateBranchBody) {
  return repositoryRequest<BranchDTO>(
    `/v1/repos/${owner}/${repo}/branches`,
    { method: 'POST', body: JSON.stringify(body) },
    token
  );
}

// Delete a branch
export function deleteBranch(owner: string, repo: string, branch: string, token: string) {
  return repositoryRequest<void>(`/v1/repos/${owner}/${repo}/branches/${encodeURIComponent(branch)}`, { method: 'DELETE' }, token);
}

// ============ Collaborator API Functions ============

export function listCollaborators(owner: string, repo: string, token?: string) {
  return repositoryRequest<ListCollaboratorsBody>(
    `/v1/repos/${owner}/${repo}/collaborators`,
    { method: 'GET' },
    token
  );
}

export function getCollaborator(owner: string, repo: string, collaboratorUsername: string, token?: string) {
  return repositoryRequest<CollaboratorDTO>(
    `/v1/repos/${owner}/${repo}/collaborators/${collaboratorUsername}`,
    { method: 'GET' },
    token
  );
}

// ============ Content API Functions ============

export type UploadFileBody = {
  content: string; // base64 encoded content
  message: string;
  branch?: string;
};

export type FileEntryDTO = {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
  size?: number;
  url?: string;
};

export type GetRepoContentsBody = {
  entries: FileEntryDTO[];
  truncated?: boolean;
};

export function uploadFile(
  owner: string,
  repo: string,
  path: string,
  token: string,
  body: UploadFileBody
) {
  return repositoryRequest<FileEntryDTO>(
    `/v1/repos/${owner}/${repo}/contents?path=${encodeURIComponent(path)}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    token
  );
}

export function deleteFile(
  owner: string,
  repo: string,
  path: string,
  message: string,
  token: string,
  branch?: string
) {
  const params = new URLSearchParams();
  params.set('path', path);
  params.set('message', message);
  if (branch) params.set('branch', branch);

  return repositoryRequest<void>(
    `/v1/repos/${owner}/${repo}/contents?${params.toString()}`,
    { method: 'DELETE' },
    token
  );
}

export function getRepoContents(
  owner: string,
  repo: string,
  token?: string,
  path?: string,
  ref?: string
) {
  const params = new URLSearchParams();
  if (path) params.set('path', path);
  if (ref) params.set('ref', ref);
  const query = params.toString();

  return repositoryRequest<GetRepoContentsBody>(
    `/v1/repos/${owner}/${repo}/contents${query ? `?${query}` : ''}`,
    { method: 'GET' },
    token
  );
}
