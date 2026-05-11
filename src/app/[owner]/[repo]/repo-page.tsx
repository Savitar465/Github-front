"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/lib/auth';
import { getRepository, type RepositoryDTO } from '@/lib/api/repository-api';
import { RepoHeader } from '@/components/repo/repo-header';
import { RepoMetaClient } from '@/components/repo/repo-meta-client';
import { Card, CardContent } from '@/components/ui/card';

type RepoPageClientProps = {
  owner: string;
  repo: string;
  defaultBranch: string;
};

export function RepoPageClient({ owner, repo, defaultBranch }: RepoPageClientProps) {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [data, setData] = useState<RepositoryDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          const resp = await fetch(`/api/repository/v1/repos/${owner}/${repo}`, { method: 'GET' });
          if (!resp.ok) throw new Error(`Status ${resp.status}`);
          const json = (await resp.json()) as RepositoryDTO;
          if (!cancelled) setData(json);
          return;
        }

        const repoData = await getRepository(owner, repo, token);
        if (!cancelled) setData(repoData);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error loading repository');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, owner, repo, token]);

  if (loading) return null;
  if (error) return (
    <Card className="m-6">
      <CardContent className="p-3 text-sm text-destructive">Error: {error}</CardContent>
    </Card>
  );

  if (!data) return null;

  const watchersCount = (data as unknown as { watchersCount?: number }).watchersCount ?? 0;

  return (
    <>
      <RepoHeader
        owner={owner}
        repo={repo}
        description={data.description}
        defaultBranch={defaultBranch}
        activeTab="code"
        starsCount={data.starsCount ?? 0}
        forksCount={data.forksCount ?? 0}
        watchersCount={watchersCount}
      />
      <RepoMetaClient owner={owner} repo={repo} />
    </>
  );
}
