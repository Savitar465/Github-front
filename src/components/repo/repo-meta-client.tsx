"use client";

import { useEffect, useState } from "react";
import { useAuth } from '@/lib/auth';
import { getRepository, type RepositoryDTO } from '@/lib/api/repository-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = { owner: string; repo: string };

export function RepoMetaClient({ owner, repo }: Props) {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepositoryDTO | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          // Try unauthenticated fetch (some repos might be public)
          const resp = await fetch(`/api/repository/v1/repos/${owner}/${repo}`, { method: 'GET' });
          if (!resp.ok) throw new Error(`Status ${resp.status}`);
          const json = (await resp.json()) as RepositoryDTO;
          if (!cancelled) setData(json);
          return;
        }

        const repoData = await getRepository(owner, repo, token);
        if (!cancelled) setData(repoData);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error cargando repositorio');
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
    <Card>
      <CardContent className="p-3 text-sm text-destructive">Error: {error}</CardContent>
    </Card>
  );

  if (!data) return null;

  const topics = (data as unknown as { topics?: string[] }).topics ?? [];
  const tabs = [
    'Code',
    'Issues',
    'Pull requests',
    'Actions',
    'Projects',
    'Wiki',
    'Security',
    'Insights',
  ];
  const isEmpty = !data.defaultBranch;

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center text-2xl">📦</div>
            <h2 className="text-xl font-semibold">This repository is empty</h2>
            <p className="text-sm text-muted-foreground">Quick setup — if you’ve done this before you can clone the repository and push or create a new file below.</p>

            <div className="mt-4 flex gap-2">
              <Button size="sm">Create new file</Button>
              <Button variant="outline" size="sm">Upload files</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold">{(data.ownerUsername ?? owner).charAt(0).toUpperCase()}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{data.ownerUsername ?? owner}</span>
                  <h1 className="text-2xl font-semibold">{data.name ?? repo}</h1>
                </div>

                {data.description && <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>}

                {topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topics.map((t: string) => (
                      <span key={t} className="text-xs bg-slate-100 border rounded-md px-2 py-1">{t}</span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  {typeof data.starsCount === 'number' && data.starsCount > 0 && <div>★ {data.starsCount}</div>}
                  {typeof data.forksCount === 'number' && data.forksCount > 0 && <div>🍴 {data.forksCount}</div>}
                  {typeof data.watchersCount === 'number' && data.watchersCount > 0 && <div>👀 {data.watchersCount}</div>}
                  {data.language && <div>• {data.language}</div>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm">Star</Button>
              <Button variant="outline" size="sm">Watch</Button>
              <Button variant="ghost" size="sm">Fork</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <nav className="bg-white border-b">
        <ul className="flex gap-6 px-4">
          {tabs.map((t) => (
            <li key={t} className="py-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer">{t}</li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">Code</h3>
              <p className="mt-2 text-sm text-muted-foreground">Default branch: <span className="font-medium">{data.defaultBranch ?? 'main'}</span></p>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold">About</h4>
              {data.description && <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>}

              <div className="mt-3 text-sm text-muted-foreground">
                <div>Id: <span className="font-medium">{data.id}</span></div>
                <div className="mt-2">Created: <span className="font-medium">{data.createdAt ? new Date(data.createdAt).toLocaleString() : '—'}</span></div>
                <div>Updated: <span className="font-medium">{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'}</span></div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
