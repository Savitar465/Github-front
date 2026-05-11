'use client';

import { useState, useEffect } from 'react';
import { RepoHeader, CommitList, DiffViewer, BranchSelector } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, GitPullRequest, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { filesApi } from '@/lib/api';
import type { CommitDTO, CommitFile, CompareDTO } from '@/lib/api';

// Mock data para fallback
const mockCompare: CompareDTO = {
  commits: [
    {
      sha: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
      message: 'feat: Agregar nueva funcionalidad',
      author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
      committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
      parents: [],
    },
    {
      sha: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
      message: 'fix: Corregir bug en login',
      author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T18:45:00Z' },
      committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-15T18:45:00Z' },
      parents: [],
    },
  ],
  files: [
    {
      filename: 'src/app/login/page.tsx',
      status: 'modified',
      additions: 25,
      deletions: 10,
      changes: 35,
      patch: '@@ -1,10 +1,25 @@\n+// New login implementation',
    },
    {
      filename: 'src/lib/auth.ts',
      status: 'added',
      additions: 45,
      deletions: 0,
      changes: 45,
    },
  ],
  totalCommits: 2,
  aheadBy: 2,
  behindBy: 0,
};

export default function ComparePage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [baseBranch, setBaseBranch] = useState('main');
  const [headBranch, setHeadBranch] = useState('develop');
  const [comparison, setComparison] = useState<CompareDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (baseBranch === headBranch) {
      setError('Las branches base y compare deben ser diferentes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await filesApi.compareCommits({
        owner,
        repo,
        baseBranch,
        headBranch,
      });
      setComparison(result);
    } catch (err) {
      console.error('Error comparing branches:', err);
      setError('Error al comparar branches. Usando datos de ejemplo.');
      setComparison(mockCompare);
    } finally {
      setLoading(false);
    }
  };

  // Comparar automáticamente al cargar la página
  useEffect(() => {
    handleCompare();
  }, []);

  const swapBranches = () => {
    const temp = baseBranch;
    setBaseBranch(headBranch);
    setHeadBranch(temp);
  };

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        activeTab="compare"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Branch selectors */}
        <div className="border rounded-lg p-6 mb-6 bg-muted/30">
          <h2 className="text-lg font-semibold mb-4">Comparar cambios</h2>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">base:</span>
              <BranchSelector
                currentBranch={baseBranch}
                branches={['main', 'develop', 'feature/auth', 'feature/ui']}
                onSelect={setBaseBranch}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={swapBranches}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">compare:</span>
              <BranchSelector
                currentBranch={headBranch}
                branches={['main', 'develop', 'feature/auth', 'feature/ui']}
                onSelect={setHeadBranch}
              />
            </div>

            <Button onClick={handleCompare} disabled={loading}>
              {loading ? 'Comparando...' : 'Comparar'}
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Comparison summary */}
          {comparison && (
            <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
              <span>
                <span className="font-semibold text-green-500">{comparison.aheadBy}</span>
                {' '}commits adelante
              </span>
              <span>
                <span className="font-semibold text-orange-500">{comparison.behindBy}</span>
                {' '}commits atrás
              </span>
              <span className="text-muted-foreground">
                {comparison.files.length} archivos cambiados
              </span>
            </div>
          )}
        </div>

        {/* Create PR button */}
        {comparison && comparison.aheadBy > 0 && (
          <div className="mb-6">
            <Button className="gap-2">
              <GitPullRequest className="h-4 w-4" />
              Crear Pull Request
            </Button>
          </div>
        )}

        {/* Commits */}
        {comparison && comparison.commits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Commits ({comparison.commits.length})
            </h3>
            <CommitList commits={comparison.commits} owner={owner} repo={repo} />
          </div>
        )}

        {/* File changes */}
        {comparison && comparison.files.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Archivos cambiados ({comparison.files.length})
            </h3>
            <DiffViewer files={comparison.files} />
          </div>
        )}

        {/* Empty state */}
        {comparison && comparison.commits.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              No hay diferencias entre <span className="font-mono">{baseBranch}</span> y{' '}
              <span className="font-mono">{headBranch}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
