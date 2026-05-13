'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Book, GitFork, Globe, Loader2, Star, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { PageContainer } from '@/components/common/page-container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listPublicRepositories, searchRepositories, type RepositoryDTO } from '@/lib/api/repository-api';
import { useAuth } from '@/lib/auth';

const languageColors: Record<string, string> = {
  Java: 'bg-orange-500',
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-red-500',
};

type SortOption = 'recent' | 'stars' | 'updated';

export default function ExplorePage() {
  const { token } = useAuth();
  const [repositories, setRepositories] = useState<RepositoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load public repositories
  useEffect(() => {
    if (searchTerm.trim()) {
      return; // Skip when searching
    }

    let cancelled = false;

    async function loadRepositories() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await listPublicRepositories({ page, perPage: 20, sort: sortBy });

        if (cancelled) return;

        setRepositories(response.repositories || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (err) {
        if (cancelled) return;
        setError('Error al cargar repositorios públicos.');
        setRepositories([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadRepositories();

    return () => {
      cancelled = true;
    };
  }, [page, sortBy, searchTerm]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await searchRepositories(token || '', searchTerm, { page: 1, perPage: 50 });
        setRepositories(response.repositories || []);
        setTotalPages(1);
      } catch (err) {
        console.error('Error searching repositories:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  return (
    <PageContainer
      title="Explorar"
      description="Descubre repositorios públicos de la comunidad."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex w-full max-w-md items-center">
            <Input
              type="search"
              placeholder="Buscar repositorios..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Sort options */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setSortBy('recent'); setPage(1); }}
              className="text-xs gap-1"
            >
              <Sparkles className="h-3 w-3" /> Recientes
            </Button>
            <Button
              variant={sortBy === 'stars' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setSortBy('stars'); setPage(1); }}
              className="text-xs gap-1"
            >
              <TrendingUp className="h-3 w-3" /> Populares
            </Button>
            <Button
              variant={sortBy === 'updated' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => { setSortBy('updated'); setPage(1); }}
              className="text-xs gap-1"
            >
              <Clock className="h-3 w-3" /> Actualizados
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-3xl border border-dashed px-4 py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando repositorios públicos...
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : repositories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            No hay repositorios públicos para mostrar.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {repositories.map((repo) => (
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
                        <span className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                          <Globe className="h-3 w-3" />
                          Público
                        </span>
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
                        <span>por {repo.ownerUsername}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Star className="h-4 w-4" /> Star
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5" asChild>
                        <Link href={`/${repo.ownerUsername}/${repo.name}`}>
                          <Book className="h-4 w-4" />
                          Ver
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
