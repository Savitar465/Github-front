"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GitBranch } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { getRepository, type RepositoryDTO, listBranches, listCollaborators, type BranchDTO, type CollaboratorDTO, type ListBranchesBody, type ListCollaboratorsBody, uploadFile } from '@/lib/api/repository-api';
import type { DirectoryEntryDTO } from '@/lib/api/github-files-client/src/models/DirectoryEntryDTO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BranchManager } from './branch-manager';

const GIT_HTTP_URL = process.env.NEXT_PUBLIC_GIT_HTTP_URL || 'http://localhost:9080';
const GIT_SSH_HOST = process.env.NEXT_PUBLIC_GIT_SSH_HOST || 'localhost';
const GIT_SSH_PORT = process.env.NEXT_PUBLIC_GIT_SSH_PORT || '2222';

function getCloneHttpUrl(owner: string, repo: string): string {
  return `${GIT_HTTP_URL}/${owner}/${repo}.git`;
}

function getCloneSshUrl(owner: string, repo: string): string {
  return `git@${GIT_SSH_HOST}:${GIT_SSH_PORT}/${owner}/${repo}.git`;
}

type Props = { owner: string; repo: string };

export function RepoMetaClient({ owner, repo }: Props) {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RepositoryDTO | null>(null);
  const [branchesList, setBranchesList] = useState<BranchDTO[]>([]);
  const [loadedEntries, setLoadedEntries] = useState<DirectoryEntryDTO[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

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
          if (!resp.ok) throw new Error(`Estado ${resp.status}`);
          const json = (await resp.json()) as RepositoryDTO;
            if (!cancelled) {
              setData(json);
              setCurrentBranch(json.defaultBranch || 'main');
              try {
                const bRes = await listBranches(owner, repo, undefined).catch(() => ({ branches: [] } as ListBranchesBody));
                if (!cancelled) setBranchesList(bRes.branches || []);
              } catch {}
            }
          return;
        }

        const repoData = await getRepository(owner, repo, token);
          if (!cancelled) {
            setData(repoData);
            setCurrentBranch(repoData.defaultBranch || 'main');
            try {
              const bRes = await listBranches(owner, repo, token).catch(() => ({ branches: [] } as ListBranchesBody));
              if (!cancelled) setBranchesList(bRes.branches || []);
            } catch {}
          }
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
  const showQuickSetup = (!branchesList || branchesList.length === 0) && (!loadedEntries || loadedEntries.length === 0);

  if (isEmpty) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-2xl">📦</div>
            <h2 className="text-xl font-semibold">Este repositorio está vacío</h2>
            <p className="text-sm text-muted-foreground">Configuración rápida: si ya has hecho esto antes, puedes clonar el repositorio y hacer push, o crear un nuevo archivo abajo.</p>

              <div className="mt-4 flex gap-2">
              <Button size="sm" asChild>
                <a href={`/${owner}/${repo}/new/${currentBranch || data.defaultBranch || 'main'}`}>Crear archivo</a>
              </Button>
              <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                        try {
                  if (!token) throw new Error('No autenticado');
                  for (let i = 0; i < files.length; i++) {
                    const f = files[i];
                    const base64 = await readFileAsBase64(f);
                    const content = base64.replace(/^data:.*;base64,/, '');
                    await uploadFile(owner, repo, f.name, token, {
                      content,
                      message: `Add ${f.name}`,
                      branch: currentBranch || data.defaultBranch || 'main',
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
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Subir archivos</Button>
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
            if (!token) throw new Error('No autenticado');
            for (let i = 0; i < files.length; i++) {
              const f = files[i];
              const base64 = await readFileAsBase64(f);
              const content = base64.replace(/^data:.*;base64,/, '');
              await uploadFile(owner, repo, f.name, token, {
                content,
                message: `Add ${f.name}`,
                branch: currentBranch || data.defaultBranch || 'main',
              });
            }
            // Forzar recarga del FileBrowser
            setRefreshKey(k => k + 1);
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
                  <span key={t} className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            )}

            {/* File browser */}
            <div>
              {showQuickSetup ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-start gap-4">
                      <h2 className="text-2xl font-semibold">Configuración rápida: si ya has hecho esto antes</h2>
                      <div className="w-full p-4 rounded bg-muted border border-border">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Button size="sm" variant="outline">HTTPS</Button>
                          <code className="ml-2 text-sm bg-muted text-foreground px-2 py-1 rounded font-mono border">{getCloneHttpUrl(owner, repo)}</code>
                        </div>
                        <div className="mt-4 bg-muted/80 p-3 rounded text-sm text-foreground border">
                          <pre className="whitespace-pre-wrap font-mono">{`echo "# ${repo}" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin ${getCloneHttpUrl(owner, repo)}
git push -u origin main`}</pre>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Empieza creando un nuevo archivo o subiendo un archivo existente.</p>
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <a href={`/${owner}/${repo}/new/${currentBranch || data.defaultBranch || 'main'}`}>Crear archivo</a>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Subir archivos</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Action bar for file operations */}
                  {isAuthenticated && (
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/${owner}/${repo}/new/${currentBranch || data.defaultBranch || 'main'}`}>Crear archivo</a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Subir archivos</Button>
                    </div>
                  )}
                  <FileBrowser
                    owner={owner}
                    repo={repo}
                    defaultBranch={currentBranch || data.defaultBranch || 'main'}
                    token={token || undefined}
                    onEntriesLoaded={setLoadedEntries}
                    onUploadClick={() => fileInputRef.current?.click()}
                    refreshKey={refreshKey}
                    branches={branchesList}
                    onBranchChange={(branch) => {
                      setCurrentBranch(branch);
                      setRefreshKey(k => k + 1);
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - About & Branches */}
        <aside className="space-y-4">
          {/* Branch Manager */}
          <BranchManager
            owner={owner}
            repo={repo}
            defaultBranch={currentBranch || data.defaultBranch || 'main'}
            onBranchChange={(branch) => {
              setCurrentBranch(branch);
              setRefreshKey(k => k + 1);
            }}
          />

          {/* About */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Acerca de</h4>
                {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
              </div>

              {/* Language */}
              {data.language && (
                <div className="text-sm text-muted-foreground">
                  Lenguaje: <span className="font-medium">{data.language}</span>
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

function CollaboratorsPanel({ owner, repo, token }: { owner: string; repo: string; token?: string }) {
  const [collaborators, setCollaborators] = useState<CollaboratorDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await listCollaborators(owner, repo, token).catch(() => ({ collaborators: [] } as ListCollaboratorsBody));
        if (!cancelled) setCollaborators(res.collaborators || []);
      } catch {
        if (!cancelled) setCollaborators([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [owner, repo, token]);

  // If no collaborators found, show owner as default collaborator
  const show: CollaboratorDTO[] = collaborators.length > 0
    ? collaborators
    : [{ username: owner, avatarUrl: undefined, role: 'admin', userId: '0', addedAt: new Date().toISOString() }];

  if (loading) {
    return (
      <div>
        <h5 className="text-sm font-semibold mb-3">Colaboradores</h5>
        <div className="text-xs text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div>
      <h5 className="text-sm font-semibold mb-3">Colaboradores</h5>
      <div className="space-y-2">
        {show.map((c) => (
          <div key={c.username} className="flex items-center gap-2">
            {c.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.avatarUrl} alt={c.username} className="h-6 w-6 rounded-full" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">{c.username.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <div className="text-xs font-medium text-foreground">{c.username}</div>
              <div className="text-xs text-muted-foreground">{c.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FileBrowser({ owner, repo, defaultBranch, token, onEntriesLoaded, onUploadClick, refreshKey, branches, onBranchChange }: { owner: string; repo: string; defaultBranch: string; token?: string; onEntriesLoaded?: (entries: DirectoryEntryDTO[] | null) => void; onUploadClick?: () => void; refreshKey?: number; branches?: BranchDTO[]; onBranchChange?: (branch: string) => void }) {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<DirectoryEntryDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const proxyUrl = `/api/repository/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents?path=&ref=${encodeURIComponent(defaultBranch)}`;
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        let resp = await fetch(proxyUrl, { method: 'GET', headers });

        if (resp.status === 404) {
          const backendUrl = `${process.env.NEXT_PUBLIC_REPOSITORY_API_URL?.replace(/\/+$/,'') || 'http://localhost:8090'}/v1/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents?path=&ref=${encodeURIComponent(defaultBranch)}`;
          resp = await fetch(backendUrl, { method: 'GET', headers });
        }

        if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          throw new Error(text || `Response returned an error code (${resp.status})`);
        }

        const json = await resp.json();
        if (!cancelled) {
          const contents = json.contents || null;
          setEntries(contents);
          if (onEntriesLoaded) onEntriesLoaded(contents);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error cargando el contenido');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [owner, repo, defaultBranch, token, refreshKey]);

  if (loading) return <div className="mt-4 text-sm text-muted-foreground">Cargando...</div>;
  if (error) return <div className="mt-4 text-sm text-destructive">{error}</div>;

  if (!entries || entries.length === 0) {
    return (
      <div className="mt-6 p-6 border border-border rounded-md bg-card text-card-foreground">
        <h2 className="text-lg font-semibold text-foreground">Este repositorio está vacío</h2>
        <p className="mt-2 text-sm text-muted-foreground">Crea un nuevo archivo, sube archivos o importa código desde otro repositorio.</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" asChild>
            <a href={`/${owner}/${repo}/new/${defaultBranch}`}>Crear archivo</a>
          </Button>
          <Button variant="outline" size="sm" onClick={onUploadClick}>Subir archivos</Button>
        </div>
      </div>
    );
  }

  const isDir = (type: string) => type === 'dir' || type === 'directory';

  return (
    <div className="mt-4">
      {/* Branch selector */}
      {branches && branches.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <select
            value={defaultBranch}
            onChange={(e) => onBranchChange?.(e.target.value)}
            className="text-sm font-medium border rounded-md px-3 py-1.5 bg-background hover:bg-muted cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} {b.isDefault && '(default)'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="border border-border rounded-md bg-card">
        <ul>
          {entries.map((e) => {
            const href = isDir(e.type)
              ? `/${owner}/${repo}/tree/${defaultBranch}/${e.path}`
              : `/${owner}/${repo}/blob/${defaultBranch}/${e.path}`;

            return (
              <li key={e.path} className="border-b border-border last:border-b-0">
                <Link href={href} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-sm font-medium flex-shrink-0">
                      {isDir(e.type) ? '📁' : '📄'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground truncate hover:text-blue-500 hover:underline">{e.name}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right flex-shrink-0">{e.size != null ? `${e.size} bytes` : ''}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
