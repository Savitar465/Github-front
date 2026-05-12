'use client';

import { useState, useEffect } from 'react';
import { RepoHeader, BranchSelector } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, GitPullRequest, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { compareBranches, listBranches, type BranchCompareResponse } from '@/lib/api/repository-api';

export default function ComparePage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [branches, setBranches] = useState<string[]>(['main']);
  const [baseBranch, setBaseBranch] = useState('main');
  const [headBranch, setHeadBranch] = useState('');
  const [comparison, setComparison] = useState<BranchCompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar branches al montar
  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await listBranches(owner, repo);
        const branchNames = res.branches.map(b => b.name);
        setBranches(branchNames);
        if (branchNames.length > 0) {
          setBaseBranch(branchNames[0]);
          if (branchNames.length > 1) {
            setHeadBranch(branchNames[1]);
          }
        }
      } catch (err) {
        console.error('Error loading branches:', err);
      }
    }
    loadBranches();
  }, [owner, repo]);

  const handleCompare = async () => {
    if (!baseBranch || !headBranch) {
      setError('Selecciona ambas branches');
      return;
    }
    if (baseBranch === headBranch) {
      setError('Las branches base y compare deben ser diferentes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await compareBranches(owner, repo, baseBranch, headBranch);
      setComparison(result);
    } catch (err) {
      console.error('Error comparing branches:', err);
      setError('Error al comparar branches. Intenta de nuevo más tarde.');
      setComparison(null);
    } finally {
      setLoading(false);
    }
  };

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
              <select
                value={baseBranch}
                onChange={(e) => setBaseBranch(e.target.value)}
                className="rounded-md border px-3 py-1 text-sm bg-background"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
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
              <select
                value={headBranch}
                onChange={(e) => setHeadBranch(e.target.value)}
                className="rounded-md border px-3 py-1 text-sm bg-background"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleCompare} disabled={loading || !headBranch}>
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
                <span className="font-semibold">{comparison.totalCommits}</span>
                {' '}commits
              </span>
              <span>
                <span className="font-semibold">{comparison.filesChanged}</span>
                {' '}archivos cambiados
              </span>
              <span className="text-green-500">
                +{comparison.additions}
              </span>
              <span className="text-red-500">
                -{comparison.deletions}
              </span>
            </div>
          )}
        </div>

        {/* Create PR button */}
        {comparison && comparison.totalCommits > 0 && (
          <div className="mb-6">
            <Button className="gap-2" asChild>
              <a href={`/${owner}/${repo}/pulls/new?base=${baseBranch}&head=${headBranch}`}>
                <GitPullRequest className="h-4 w-4" />
                Crear Pull Request
              </a>
            </Button>
          </div>
        )}

        {/* Commits */}
        {comparison && comparison.commits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Commits ({comparison.commits.length})
            </h3>
            <div className="border rounded-lg divide-y">
              {comparison.commits.map((commit) => (
                <div key={commit.sha} className="p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{commit.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {commit.author} &middot; {new Date(commit.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {commit.shortSha}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File changes */}
        {comparison && comparison.files.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Archivos cambiados ({comparison.files.length})
            </h3>
            <div className="border rounded-lg divide-y">
              {comparison.files.map((file) => (
                <div key={file.path} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{file.path}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">+{file.additions}</span>
                      <span className="text-red-500">-{file.deletions}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{file.changeType}</span>
                    </div>
                  </div>
                  {file.patch && (
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto font-mono whitespace-pre-wrap">
                      {file.patch}
                    </pre>
                  )}
                </div>
              ))}
            </div>
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
