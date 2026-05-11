'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { pullRequestsApi } from '@/lib/api/pullrequests';
import type { PullRequestDTO } from '@/lib/api/pullrequests';
import { RepoHeader } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  GitPullRequest,
  GitMerge,
  XCircle,
  Plus,
  Loader2,
  MessageSquare,
  GitCommit,
  AlertCircle,
} from 'lucide-react';

type PrStatus = 'open' | 'closed' | 'merged';

const statusConfig: Record<PrStatus, { icon: typeof GitPullRequest; color: string; label: string }> = {
  open: { icon: GitPullRequest, color: 'text-green-500', label: 'Abierto' },
  closed: { icon: XCircle, color: 'text-red-500', label: 'Cerrado' },
  merged: { icon: GitMerge, color: 'text-purple-500', label: 'Mergeado' },
};

export default function PullRequestsPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [pullRequests, setPullRequests] = useState<PullRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PrStatus | 'all'>('open');

  useEffect(() => {
    loadPullRequests();
  }, [owner, repo, statusFilter]);

  const loadPullRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await pullRequestsApi.listPullRequests({
        owner,
        repo,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });

      setPullRequests(response.pullRequests || []);
    } catch (err) {
      console.error('Error loading pull requests:', err);
      setError('Error al cargar pull requests. Verifica que el servicio esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status as PrStatus] || statusConfig.open;
  };

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} activeTab="pulls" />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Pull Requests</h1>

            {/* Filtros de estado */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              {(['all', 'open', 'closed', 'merged'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="text-xs"
                >
                  {status === 'all' ? 'Todos' : statusConfig[status as PrStatus]?.label || status}
                </Button>
              ))}
            </div>
          </div>

          <Button asChild className="gap-2">
            <Link href={`/${owner}/${repo}/pulls/new`}>
              <Plus className="h-4 w-4" />
              Nuevo PR
            </Link>
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Lista de PRs */}
        <div className="border rounded-lg divide-y">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : pullRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <GitPullRequest className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay pull requests {statusFilter !== 'all' && statusConfig[statusFilter as PrStatus]?.label.toLowerCase()}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href={`/${owner}/${repo}/pulls/new`}>
                  Crear el primer PR
                </Link>
              </Button>
            </div>
          ) : (
            pullRequests.map((pr) => {
              const statusInfo = getStatusInfo(pr.status || 'open');
              const StatusIcon = statusInfo.icon;
              const createdAt = pr.createdAt ? new Date(pr.createdAt) : new Date();
              const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: es });

              return (
                <Link
                  key={pr.id}
                  href={`/${owner}/${repo}/pulls/${pr.number}`}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  <StatusIcon className={`h-5 w-5 mt-0.5 ${statusInfo.color}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium hover:text-blue-500">
                        {pr.title}
                      </span>
                      {pr.hasConflicts && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Conflictos
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-muted-foreground mt-1">
                      #{pr.number} abierto {timeAgo} por {pr.author?.username || 'unknown'}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        {pr.commitsCount || 0} commits
                      </span>
                      <span>
                        {pr.sourceBranch} → {pr.targetBranch}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
