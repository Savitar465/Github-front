'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Book, GitFork, Globe, Loader2, Lock, Plus, Star, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/common/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { listRepositories, createRepository, deleteRepository, type RepositoryDTO } from '@/lib/api/repository-api';

const languageColors: Record<string, string> = {
  Java: 'bg-orange-500',
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-red-500',
};

type VisibilityFilter = 'all' | 'public' | 'private';

export function MyReposClient() {
  const router = useRouter();
  const { token, isLoading: authLoading, isAuthenticated, user } = useAuth();
  const [repositories, setRepositories] = useState<RepositoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');

  // Create repository state
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [initWithReadme, setInitWithReadme] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load user repositories
  useEffect(() => {
    if (authLoading || !isAuthenticated || !token) {
      return;
    }

    let cancelled = false;

    async function loadRepositories() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listRepositories(token!, {
          page: 1,
          perPage: 100,
        });

        if (cancelled) return;

        setRepositories(response.repositories || []);
      } catch (requestError) {
        if (cancelled) return;

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

  // Filter repositories based on search and visibility
  const filteredRepositories = repositories.filter(repo => {
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        repo.name.toLowerCase().includes(searchLower) ||
        repo.fullName.toLowerCase().includes(searchLower) ||
        (repo.description && repo.description.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Filter by visibility
    if (visibilityFilter !== 'all' && repo.visibility !== visibilityFilter) {
      return false;
    }

    return true;
  });

  const handleDelete = async (repo: RepositoryDTO) => {
    if (!confirm(`¿Estás seguro de eliminar el repositorio "${repo.fullName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(repo.id);
    try {
      await deleteRepository(repo.ownerUsername, repo.name, token!);
      setRepositories(prev => prev.filter(r => r.id !== repo.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error eliminando el repositorio');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
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
      // Refresh list
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
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <PageContainer title="Mis Repositorios" description="Cargando...">
        <div className="flex items-center gap-3 rounded-3xl border border-dashed px-4 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Verificando autenticación...
        </div>
      </PageContainer>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageContainer
      title="Mis Repositorios"
      description={`Repositorios de ${user?.username || 'usuario'}`}
    >
      {/* Create repository modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6">
            <h3 className="text-lg font-semibold mb-4">Crear repositorio</h3>
            <form onSubmit={handleCreate}>
              <div className="grid gap-3">
                <input
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  placeholder="Nombre del repositorio"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  placeholder="Descripción (opcional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                    />
                    <Globe className="h-4 w-4" />
                    Público
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === 'private'}
                      onChange={() => setVisibility('private')}
                    />
                    <Lock className="h-4 w-4" />
                    Privado
                  </label>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={initWithReadme}
                    onChange={(e) => setInitWithReadme(e.target.checked)}
                  />
                  Inicializar con README
                </label>

                {createError && <div className="text-sm text-destructive">{createError}</div>}

                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={creating}>
                    {creating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creando...</> : 'Crear'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex w-full max-w-md items-center">
            <Input
              type="search"
              placeholder="Buscar en mis repositorios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Visibility filter */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            {(['all', 'public', 'private'] as const).map((vis) => (
              <Button
                key={vis}
                variant={visibilityFilter === vis ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setVisibilityFilter(vis)}
                className="text-xs gap-1"
              >
                {vis === 'all' && 'Todos'}
                {vis === 'public' && <><Globe className="h-3 w-3" /> Públicos</>}
                {vis === 'private' && <><Lock className="h-3 w-3" /> Privados</>}
              </Button>
            ))}
          </div>
        </div>

        <Button className="gap-2 sm:self-start" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo repositorio
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>{repositories.length} repositorios en total</span>
        <span>•</span>
        <span>{repositories.filter(r => r.visibility === 'public').length} públicos</span>
        <span>•</span>
        <span>{repositories.filter(r => r.visibility === 'private').length} privados</span>
      </div>

      {/* Repository list */}
      {isLoading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-dashed px-4 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando tus repositorios...
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : filteredRepositories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            {searchTerm || visibilityFilter !== 'all'
              ? 'No se encontraron repositorios con los filtros aplicados.'
              : 'No tienes repositorios aún. ¡Crea tu primer repositorio!'}
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
                        {repo.name}
                      </Link>
                      {repo.visibility === 'private' ? (
                        <span className="flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">
                          <Lock className="h-3 w-3" />
                          Privado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full border border-green-500/50 bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
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
                      <span>Rama: {repo.defaultBranch}</span>
                      <span>Actualizado: {repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <Link href={`/${repo.ownerUsername}/${repo.name}`}>
                        <Book className="h-4 w-4" />
                        Abrir
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(repo)}
                      disabled={deletingId === repo.id}
                    >
                      {deletingId === repo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
