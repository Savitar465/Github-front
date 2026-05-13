'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Tag,
} from 'lucide-react';

import { RepoHeader } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { listIssues, createIssue } from '@/lib/services/issues';
import type { IssueDTO, CreateIssuePayload } from '@/types/issue';

type Filter = 'all' | 'OPEN' | 'CLOSED';

export default function RepoIssuesPage() {
  const params = useParams();
  const owner = params.owner as string;
  const repo = params.repo as string;

  const [issues, setIssues] = useState<IssueDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Create issue state
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadIssues();
  }, [owner, repo, filter]);

  async function loadIssues() {
    setLoading(true);
    setError(null);
    try {
      const data = await listIssues(owner, repo, {
        state: filter === 'all' ? undefined : filter,
      });
      setIssues(data.issues || []);
    } catch (err) {
      console.error('Error loading issues:', err);
      setError('Error al cargar issues. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const payload: CreateIssuePayload = {
        title: newTitle.trim(),
        body: newBody.trim() || undefined,
      };
      const newIssue = await createIssue(owner, repo, payload);
      setIssues((prev) => [newIssue, ...prev]);
      setShowCreate(false);
      setNewTitle('');
      setNewBody('');
    } catch (err) {
      console.error('Error creating issue:', err);
    } finally {
      setCreating(false);
    }
  }

  const filteredIssues = searchQuery.trim()
    ? issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.body?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : issues;

  const openCount = issues.filter((i) => i.state === 'OPEN').length;
  const closedCount = issues.filter((i) => i.state === 'CLOSED').length;

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} activeTab="issues" />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Issues</h1>

            {/* Filtros de estado */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={filter === 'OPEN' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('OPEN')}
                className="text-xs gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Abiertos ({openCount})
              </Button>
              <Button
                variant={filter === 'CLOSED' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('CLOSED')}
                className="text-xs gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                Cerrados ({closedCount})
              </Button>
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
                className="text-xs"
              >
                Todos
              </Button>
            </div>
          </div>

          <Button onClick={() => setShowCreate(!showCreate)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Issue
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Create issue form */}
        {showCreate && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  placeholder="Título del issue"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border px-3 py-2 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={creating || !newTitle.trim()}>
                    {creating ? 'Creando...' : 'Crear Issue'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Lista de issues */}
        <div className="border rounded-lg divide-y">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay issues {filter === 'OPEN' ? 'abiertos' : filter === 'CLOSED' ? 'cerrados' : ''}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowCreate(true)}
              >
                Crear el primer issue
              </Button>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const createdAt = new Date(issue.createdAt);
              const timeAgo = formatDistanceToNow(createdAt, {
                addSuffix: true,
                locale: es,
              });

              return (
                <Link
                  key={issue.id}
                  href={`/${owner}/${repo}/issues/${issue.number}`}
                  className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
                >
                  {issue.state === 'OPEN' ? (
                    <AlertCircle className="h-5 w-5 mt-0.5 text-green-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-purple-500" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium hover:text-blue-500">
                        {issue.title}
                      </span>
                      {issue.labels?.map((label) => (
                        <span
                          key={label.id}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${label.color}20`,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground mt-1">
                      #{issue.number} abierto {timeAgo} por{' '}
                      {issue.author?.username || 'unknown'}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {issue.commentsCount > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {issue.commentsCount}
                        </span>
                      )}
                      {issue.assignee && (
                        <span>Asignado a: {issue.assignee.username}</span>
                      )}
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
