import { RepoHeader, CommitList } from '@/components/repo';
import { listCommits, type CommitDTO } from '@/lib/api/repository-api';
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

async function getCommits(
  owner: string,
  repo: string,
  page: number,
  branch?: string
): Promise<{ commits: CommitDTO[]; totalPages: number }> {
  try {
    const response = await listCommits(owner, repo, {
      branch,
      page,
      perPage: 30,
    });
    return {
      commits: response.commits,
      totalPages: response.pagination.totalPages,
    };
  } catch (error) {
    console.error('Error fetching commits:', error);
    return { commits: [], totalPages: 1 };
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
