'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { pullRequestsApi } from '@/lib/api/pullrequests';
import { listBranches } from '@/lib/api/repository-api';
import { RepoHeader } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { GitPullRequest, Loader2, ArrowLeft, GitBranch } from 'lucide-react';
import Link from 'next/link';

type Branch = {
  name: string;
  isDefault?: boolean;
};

export default function NewPullRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, getToken } = useAuth();

  const owner = params.owner as string;
  const repo = params.repo as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [targetBranch, setTargetBranch] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ramas del repositorio
  useEffect(() => {
    async function loadBranches() {
      try {
        setLoadingBranches(true);
        const token = getToken() || undefined;
        const data = await listBranches(owner, repo, token);
        setBranches(data.branches || []);

        // Establecer rama destino por defecto (main o master)
        const defaultBranch = data.branches?.find((b: Branch) => b.isDefault)
          || data.branches?.find((b: Branch) => b.name === 'main')
          || data.branches?.find((b: Branch) => b.name === 'master')
          || data.branches?.[0];

        if (defaultBranch) {
          setTargetBranch(defaultBranch.name);
        }
      } catch (err) {
        console.error('Error loading branches:', err);
        setError('Error al cargar las ramas del repositorio');
      } finally {
        setLoadingBranches(false);
      }
    }

    if (owner && repo) {
      loadBranches();
    }
  }, [owner, repo, getToken]);

  const handleCreate = async () => {
    if (!title.trim() || !sourceBranch.trim() || !targetBranch.trim()) {
      setError('El título, rama origen y rama destino son requeridos');
      return;
    }

    if (sourceBranch === targetBranch) {
      setError('La rama origen y destino deben ser diferentes');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await pullRequestsApi.createPullRequest({
        owner,
        repo,
        createPullRequestBody: {
          title,
          description: description || undefined,
          sourceBranch,
          targetBranch,
        },
      });

      // Redirigir al PR creado
      router.push(`/${owner}/${repo}/pulls/${response.number}`);
    } catch (err: any) {
      console.error('Error creating PR:', err);
      setError(err?.message || 'Error al crear el pull request');
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} activeTab="pulls" />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <GitPullRequest className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground mb-4">
            Debes iniciar sesión para crear un pull request.
          </p>
          <Button onClick={() => router.push('/login')}>
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} activeTab="pulls" />

      <div className="max-w-3xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${owner}/${repo}/pulls`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Crear Pull Request</h1>
            <p className="text-sm text-muted-foreground">
              Compara cambios entre ramas y crea un pull request
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario */}
        <div className="border rounded-lg p-6 space-y-6">
          {/* Ramas */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="targetBranch" className="text-xs text-muted-foreground mb-1 block">
                Base (destino)
              </Label>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                {loadingBranches ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                  </div>
                ) : (
                  <select
                    id="targetBranch"
                    value={targetBranch}
                    onChange={(e) => setTargetBranch(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Selecciona rama destino</option>
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name} {branch.isDefault && '(default)'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="text-2xl text-muted-foreground">←</div>

            <div className="flex-1">
              <Label htmlFor="sourceBranch" className="text-xs text-muted-foreground mb-1 block">
                Compare (origen)
              </Label>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                {loadingBranches ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                  </div>
                ) : (
                  <select
                    id="sourceBranch"
                    value={sourceBranch}
                    onChange={(e) => setSourceBranch(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-mono shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Selecciona rama origen</option>
                    {branches
                      .filter((b) => b.name !== targetBranch)
                      .map((branch) => (
                        <option key={branch.name} value={branch.name}>
                          {branch.name} {branch.isDefault && '(default)'}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Agrega un título descriptivo para tu PR"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los cambios que estás proponiendo..."
              rows={6}
            />
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href={`/${owner}/${repo}/pulls`}>
                Cancelar
              </Link>
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || loadingBranches || !sourceBranch || !targetBranch}
              className="gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <GitPullRequest className="h-4 w-4" />
                  Crear Pull Request
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
