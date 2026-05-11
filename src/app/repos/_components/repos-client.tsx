'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Book, GitFork, Globe, Loader2, Lock, Plus, Star } from 'lucide-react';
import { PageContainer } from '@/components/common/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { listRepositories, createRepository, type RepositoryDTO } from '@/lib/api/repository-api';

const languageColors: Record<string, string> = {
  Java: 'bg-orange-500',
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-red-500',
};

export function ReposClient() {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [repositories, setRepositories] = useState<RepositoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Create repository state
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [initWithReadme, setInitWithReadme] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated || !token) {
      setRepositories([]);
      setError('Inicia sesión para ver tus repositorios.');
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadRepositories() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listRepositories(token, { page: 1, perPage: 100 });

        if (cancelled) {
          return;
        }

        setRepositories(response.repositories || []);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        const message = requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar los repositorios.';
        setError(message);
        setRepositories([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRepositories();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, token]);

  const filteredRepositories = repositories.filter((repo) => {
    const haystack = [repo.fullName, repo.description, repo.language, repo.visibility]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(searchTerm.toLowerCase());
  });

  return (
    <PageContainer
      title="Repositorios"
      description="Explora los repositorios disponibles desde el backend de repository."
    >
      {/* Create repository form/modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6">
            <h3 className="text-lg font-semibold mb-4">Crear repositorio</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim()) {
                  setCreateError('El nombre es requerido');
                  return;
                }
                setCreating(true);
                setCreateError(null);
                try {
                  await createRepository(token!, {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    visibility,
                    initWithReadme,
                  });
                  // refresh list
                  const resp = await listRepositories(token!, { page: 1, perPage: 100 });
                  setRepositories(resp.repositories || []);
                  setCreateOpen(false);
                  setName('');
                  setDescription('');
                } catch (err) {
                  setCreateError(err instanceof Error ? err.message : 'Error creando el repositorio');
                } finally {
                  setCreating(false);
                }
              }}
            >
              <div className="grid gap-2">
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Nombre del repositorio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Descripción (opcional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => setVisibility('public')} />
                    Público
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
                    Privado
                  </label>
                  <label className="flex items-center gap-2 ml-4">
                    <input type="checkbox" checked={initWithReadme} onChange={(e) => setInitWithReadme(e.target.checked)} />
                    Inicializar con README
                  </label>
                </div>

                {createError && <div className="text-sm text-destructive">{createError}</div>}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={creating}>{creating ? 'Creando...' : 'Crear'}</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-md items-center gap-3">
          <Input
            type="search"
            placeholder="Buscar repositorio..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full"
          />
        </div>

        <Button className="gap-2 sm:self-start" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo repositorio
        </Button>
      </div>

      {authLoading || isLoading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-dashed px-4 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando repositorios desde el backend...
        </div>
      ) : error && !isAuthenticated ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="mt-4">
              <Button asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : filteredRepositories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No hay repositorios para mostrar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRepositories.map((repo) => (
            <Card key={repo.id} className="hover:border-muted-foreground/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/${repo.ownerUsername}/${repo.name}`}
                        className="text-lg font-semibold text-blue-500 hover:underline"
                      >
                        {repo.fullName}
                      </Link>
                      {repo.visibility === 'private' ? (
                        <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                          <Lock className="h-3 w-3" />
                          Privado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                          <Globe className="h-3 w-3" />
                          Público
                        </span>
                      )}
                    </div>

                    {repo.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{repo.description}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span className={`h-3 w-3 rounded-full ${languageColors[repo.language] || 'bg-gray-500'}`} />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {repo.starsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3.5 w-3.5" />
                        {repo.forksCount}
                      </span>
                      <span>Default branch: {repo.defaultBranch}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <Link href={`/${repo.ownerUsername}/${repo.name}`}>
                      <Book className="h-4 w-4" />
                      Abrir
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}