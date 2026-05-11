function getRepositoryApiUrl(): string {
  const isServer = typeof window === 'undefined';
  const envUrl = process.env.NEXT_PUBLIC_REPOSITORY_API_URL || '/api/repository';

  // En servidor: si la URL es relativa, usar http://localhost:3000 + ruta relativa
  // Esto accede al proxy de Next.js en el mismo servidor
  if (isServer && !envUrl.startsWith('http')) {
    return `http://localhost:3000${envUrl}`;
  }

  // En cliente o si ya es URL absoluta: usar tal cual
  return envUrl;
}

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

export function getRepository(owner: string, repo: string, token: string) {
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