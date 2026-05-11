"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getRepository, type RepositoryDTO, listBranches, listCollaborators, type BranchDTO, type CollaboratorDTO, type ListBranchesBody, type ListCollaboratorsBody } from '@/lib/api/repository-api';
import { filesApi } from '@/lib/api';
import type { DirectoryEntryDTO } from '@/lib/api/github-files-client/src/models/DirectoryEntryDTO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Props = { owner: string; repo: string };

export function RepoMetaClient({ owner, repo }: Props) {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepositoryDTO | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(String(reader.result || ''));
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

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
  const isEmpty = !data.defaultBranch;

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-slate-100 flex items-center justify-center text-2xl">📦</div>
            <h2 className="text-xl font-semibold">This repository is empty</h2>
            <p className="text-sm text-muted-foreground">Quick setup &mdash; if you&apos;ve done this before you can clone the repository and push or create a new file below.</p>

            <div className="mt-4 flex gap-2">
              <Button size="sm" asChild>
                <a href={`/${owner}/${repo}/new/${data.defaultBranch ?? 'main'}`}>Create new file</a>
              </Button>
              <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                        try {
                  for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    const base64 = await readFileAsBase64(f);
                    const content = base64.replace(/^data:.*;base64,/, '');
                    await filesApi.createFile({
                      owner,
                      repo,
                      filePath: f.name,
                      createFileBody: { content, message: `Add ${f.name}`, branch: data.defaultBranch ?? 'main' },
                    });
                  }
                  router.refresh();
                } catch (err) {
                  console.error('Error uploading files:', err);
                  setError(err instanceof Error ? err.message : 'Error uploading files');
                } finally {
                  (e.target as HTMLInputElement).value = '';
                }
              }} />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Upload files</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={async (e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          try {
            for (let i = 0; i < files.length; i++) {
              const f = files[i];
              const base64 = await readFileAsBase64(f);
              const content = base64.replace(/^data:.*;base64,/, '');
              await filesApi.createFile({
                owner,
                repo,
                filePath: f.name,
                createFileBody: { content, message: `Add ${f.name}`, branch: data.defaultBranch ?? 'main' },
              });
            }
            router.refresh();
          } catch (err) {
            console.error('Error uploading files:', err);
            setError(err instanceof Error ? err.message : 'Error uploading files');
          } finally {
            (e.target as HTMLInputElement).value = '';
          }
        }}
        style={{ display: 'none' }}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Main content area - Code browser */}
        <div className="col-span-2">
          <div className="space-y-4">
            {/* Topics */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.map((t: string) => (
                  <span key={t} className="text-xs bg-slate-100 border border-slate-300 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            )}

            {/* Branch selector and file browser */}
            <div>
              <BranchSelector owner={owner} repo={repo} defaultBranch={data.defaultBranch || 'main'} token={token || undefined} />
            </div>

            <div className="mt-4">
              <FileBrowser owner={owner} repo={repo} defaultBranch={data.defaultBranch || 'main'} token={token || undefined} />
            </div>
          </div>
        </div>

        {/* Sidebar - About */}
        <aside>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">About</h4>
                {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
              </div>

              {/* Language */}
              {data.language && (
                <div className="text-sm text-muted-foreground">
                  Language: <span className="font-medium">{data.language}</span>
                </div>
              )}

              {/* Collaborators */}
              <div className="pt-2 border-t">
                <CollaboratorsPanel owner={owner} repo={repo} token={token || undefined} />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function BranchSelector({ owner, repo, defaultBranch, token }: { owner: string; repo: string; defaultBranch: string; token?: string }) {
  const [branches, setBranches] = useState<string[]>([]);
  const [selected, setSelected] = useState(defaultBranch);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await listBranches(owner, repo, token).catch(() => ({ branches: [] } as ListBranchesBody));
        if (!cancelled) setBranches((res.branches || []).map((b: BranchDTO) => b.name));
      } catch {
        if (!cancelled) setBranches([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [owner, repo, token]);

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-muted-foreground">Branch:</label>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="rounded-md border px-3 py-1 text-sm">
        {branches.length === 0 ? <option>{defaultBranch}</option> : branches.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
    </div>
  );
}

function CollaboratorsPanel({ owner, repo, token }: { owner: string; repo: string; token?: string }) {
  const [collaborators, setCollaborators] = useState<CollaboratorDTO[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await listCollaborators(owner, repo, token).catch(() => ({ collaborators: [] } as ListCollaboratorsBody));
        if (!cancelled) setCollaborators(res.collaborators || []);
      } catch {
        if (!cancelled) setCollaborators([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [owner, repo, token]);

  const show: CollaboratorDTO[] = collaborators.length > 0 ? collaborators : [{ username: 'octocat', avatarUrl: undefined, role: 'admin', userId: '0', addedAt: new Date().toISOString() }];

  return (
    <div>
      <h5 className="text-sm font-semibold mb-3">Collaborators</h5>
      <div className="space-y-2">
        {show.map((c) => (
          <div key={c.username} className="flex items-center gap-2">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatarUrl} alt={c.username} className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">{c.username.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <div className="text-xs font-medium">{c.username}</div>
              <div className="text-xs text-muted-foreground">{c.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileBrowser({ owner, repo, defaultBranch, token }: { owner: string; repo: string; defaultBranch: string; token?: string }) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<DirectoryEntryDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const proxyUrl = `/api/repository/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents?path=`;
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        let resp = await fetch(proxyUrl, { method: 'GET', headers });

        if (resp.status === 404) {
          const backendUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/,'') || 'http://localhost:8090'}/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents?path=`;
          resp = await fetch(backendUrl, { method: 'GET', headers });
        }

        if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          throw new Error(text || `Response returned an error code (${resp.status})`);
        }

        const json = await resp.json();
        if (!cancelled) setEntries(json.contents || null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error loading content');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [owner, repo, defaultBranch, token]);

  if (loading) return <div className="mt-4 text-sm text-muted-foreground">Loading...</div>;
  if (error) return <div className="mt-4 text-sm text-destructive">{error}</div>;

  if (!entries || entries.length === 0) {
    return (
      <div className="mt-6 p-6 border rounded-md bg-white">
        <h2 className="text-lg font-semibold">This repository is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Create a new file, upload files, or import code from another repository.</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm">Create new file</Button>
          <Button variant="outline" size="sm">Upload files</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="border rounded-md bg-white">
        <ul>
          {entries.map((e) => (
            <li key={e.path} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0 hover:bg-slate-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-sm font-medium flex-shrink-0">
                  {e.type === 'dir' ? '📁' : '📄'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{e.name}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right flex-shrink-0">{e.size != null ? `${e.size} bytes` : ''}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
