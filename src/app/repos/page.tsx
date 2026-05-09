import Link from 'next/link';
import { Book, GitFork, Star, Lock, Globe } from 'lucide-react';
import { PageContainer } from '@/components/common/page-container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { buildPageTitle } from '@/lib/build-page-title';

export const metadata = {
  title: buildPageTitle('Repositorios'),
  description: 'Lista de repositorios disponibles',
};

// Datos de repositorios - cuando se implemente el endpoint GET /repos, usar API
const mockRepos = [
  {
    id: 1,
    owner: 'demo-user',
    name: 'demo-repo',
    description: 'Repositorio de demostración con datos de prueba',
    visibility: 'public',
    stars: 5,
    forks: 1,
    language: 'Java',
    updatedAt: '2026-05-08',
  },
  {
    id: 2,
    owner: 'davichox',
    name: 'github-front',
    description: 'Frontend Next.js para GitHubX - Arquitectura Cloud',
    visibility: 'public',
    stars: 12,
    forks: 3,
    language: 'TypeScript',
    updatedAt: '2026-05-08',
  },
  {
    id: 3,
    owner: 'davichox',
    name: 'github-files-ms',
    description: 'Microservicio de archivos con Spring Boot y Smithy',
    visibility: 'public',
    stars: 18,
    forks: 5,
    language: 'Java',
    updatedAt: '2026-05-08',
  },
  {
    id: 4,
    owner: 'davichox',
    name: 'api-gateway',
    description: 'API Gateway centralizado para microservicios',
    visibility: 'private',
    stars: 3,
    forks: 0,
    language: 'Java',
    updatedAt: '2026-05-08',
  },
];

const languageColors: Record<string, string> = {
  Java: 'bg-orange-500',
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-500',
  Python: 'bg-green-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-red-500',
};

export default function ReposPage() {
  return (
    <PageContainer
      title="Repositorios"
      description="Explora los repositorios disponibles"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Buscar repositorio..."
            className="px-4 py-2 border rounded-lg bg-background text-sm w-64 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button className="gap-2">
          <Book className="h-4 w-4" />
          Nuevo repositorio
        </Button>
      </div>

      <div className="space-y-4">
        {mockRepos.map((repo) => (
          <Card key={repo.id} className="hover:border-muted-foreground/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/${repo.owner}/${repo.name}`}
                      className="text-lg font-semibold text-blue-500 hover:underline"
                    >
                      {repo.owner}/{repo.name}
                    </Link>
                    {repo.visibility === 'private' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs border rounded-full">
                        <Lock className="h-3 w-3" />
                        Privado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 text-xs border rounded-full">
                        <Globe className="h-3 w-3" />
                        Público
                      </span>
                    )}
                  </div>

                  {repo.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            languageColors[repo.language] || 'bg-gray-500'
                          }`}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forks}
                    </span>
                    <span>Actualizado el {repo.updatedAt}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="gap-1.5">
                  <Star className="h-4 w-4" />
                  Star
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
