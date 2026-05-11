import { RepoHeader, CommitList } from '@/components/repo';
import { filesApi } from '@/lib/api';
import type { CommitDTO } from '@/lib/api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ page?: string; branch?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: buildPageTitle(`Commits - ${owner}/${repo}`),
  };
}

// Mock commits
const mockCommits: CommitDTO[] = [
  {
    sha: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    message: 'feat: Agregar explorador de archivos con navegación\n\nImplementa el componente FileTree con soporte para navegación entre carpetas.',
    author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
    committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
    parents: [{ sha: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1' }],
  },
  {
    sha: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
    message: 'feat: Implementar syntax highlighting para visor de código',
    author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T18:45:00Z' },
    committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T18:45:00Z' },
    parents: [{ sha: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2' }],
  },
  {
    sha: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    message: 'fix: Corregir rutas de navegación en breadcrumbs',
    author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T10:20:00Z' },
    committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T10:20:00Z' },
    parents: [{ sha: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3' }],
  },
  {
    sha: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
    message: 'refactor: Reorganizar estructura de componentes',
    author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-14T16:00:00Z' },
    committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-14T16:00:00Z' },
    parents: [{ sha: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4' }],
  },
  {
    sha: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4',
    message: 'docs: Actualizar documentación de instalación',
    author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-13T09:15:00Z' },
    committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-13T09:15:00Z' },
    parents: [],
  },
];

async function getCommits(
  owner: string,
  repo: string,
  page: number,
  branch?: string
): Promise<{ commits: CommitDTO[]; totalPages: number }> {
  try {
    const response = await filesApi.listCommits({
      owner,
      repo,
      sha: branch,
      page,
      perPage: 30,
    });
    return {
      commits: response.commits,
      totalPages: response.pagination.totalPages,
    };
  } catch (error) {
    console.error('Error fetching commits:', error);
    return { commits: mockCommits, totalPages: 1 };
  }
}

export default async function CommitsPage({ params, searchParams }: PageProps) {
  const { owner, repo } = await params;
  const { page: pageStr, branch } = await searchParams;
  const page = parseInt(pageStr || '1', 10);
  const currentBranch = branch || 'main';

  const { commits, totalPages } = await getCommits(owner, repo, page, currentBranch);

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        defaultBranch={currentBranch}
        activeTab="commits"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Historial de commits
          </h2>
          <div className="text-sm text-muted-foreground">
            Mostrando commits en <span className="font-medium">{currentBranch}</span>
          </div>
        </div>

        <CommitList commits={commits} owner={owner} repo={repo} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={`/${owner}/${repo}/commits?page=${page - 1}&branch=${currentBranch}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </>
              )}
            </Button>

            <span className="text-sm text-muted-foreground px-4">
              Página {page} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild={page < totalPages}
            >
              {page < totalPages ? (
                <Link href={`/${owner}/${repo}/commits?page=${page + 1}&branch=${currentBranch}`}>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              ) : (
                <>
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
