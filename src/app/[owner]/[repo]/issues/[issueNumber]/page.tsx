'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Loader2,
  MessageSquare,
  Send,
  Tag,
  User,
  X,
} from 'lucide-react';

import { RepoHeader } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  getIssue,
  updateIssue,
  listIssueComments,
  createIssueComment,
} from '@/lib/services/issues';
import type { IssueDTO, CommentDTO, UpdateIssuePayload } from '@/types/issue';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const owner = params.owner as string;
  const repo = params.repo as string;
  const issueNumber = parseInt(params.issueNumber as string, 10);

  const [issue, setIssue] = useState<IssueDTO | null>(null);
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [owner, repo, issueNumber]);

  async function loadIssue() {
    setLoading(true);
    setError(null);
    try {
      const [issueData, commentsData] = await Promise.all([
        getIssue(owner, repo, issueNumber),
        listIssueComments(owner, repo, issueNumber),
      ]);
      setIssue(issueData);
      setComments(commentsData.comments || []);
      setEditTitle(issueData.title);
      setEditBody(issueData.body || '');
    } catch (err) {
      console.error('Error loading issue:', err);
      setError('Error al cargar el issue.');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleState() {
    if (!issue) return;
    setSaving(true);
    try {
      const newState = issue.state === 'OPEN' ? 'CLOSED' : 'OPEN';
      const updated = await updateIssue(owner, repo, issueNumber, {
        state: newState,
      });
      setIssue(updated);
    } catch (err) {
      console.error('Error updating issue:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveEdit() {
    if (!issue) return;
    setSaving(true);
    try {
      const payload: UpdateIssuePayload = {};
      if (editTitle !== issue.title) payload.title = editTitle;
      if (editBody !== (issue.body || '')) payload.body = editBody;

      const updated = await updateIssue(owner, repo, issueNumber, payload);
      setIssue(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving issue:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      const comment = await createIssueComment(owner, repo, issueNumber, {
        body: newComment.trim(),
      });
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setAddingComment(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} activeTab="issues" />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} activeTab="issues" />
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error || 'Issue no encontrado'}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const createdAt = new Date(issue.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: es });

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} activeTab="issues" />

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back link */}
        <Link
          href={`/${owner}/${repo}/issues`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a issues
        </Link>

        {/* Issue header */}
        <div className="mb-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-semibold"
              />
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                  {issue.title}
                  <span className="text-muted-foreground font-normal">
                    #{issue.number}
                  </span>
                </h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      issue.state === 'OPEN'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-purple-500/20 text-purple-600'
                    }`}
                  >
                    {issue.state === 'OPEN' ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {issue.state === 'OPEN' ? 'Abierto' : 'Cerrado'}
                  </span>
                  <span>
                    {issue.author?.username} abrió este issue {timeAgo}
                  </span>
                  <span>· {comments.length} comentarios</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant={issue.state === 'OPEN' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={handleToggleState}
                  disabled={saving}
                >
                  {issue.state === 'OPEN' ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cerrar
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Reabrir
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Labels */}
        {issue.labels && issue.labels.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {issue.labels.map((label) => (
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
        )}

        {/* Assignee */}
        {issue.assignee && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            Asignado a: <span className="font-medium">{issue.assignee.username}</span>
          </div>
        )}

        {/* Issue body */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {issue.author?.username}
              </span>
              comentó {timeAgo}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full min-h-[150px] rounded-md border px-3 py-2 text-sm"
                placeholder="Descripción del issue..."
              />
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {issue.body || (
                  <span className="text-muted-foreground italic">
                    Sin descripción
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comentarios ({comments.length})
          </h2>

          {comments.map((comment) => {
            const commentTime = formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: es,
            });
            return (
              <Card key={comment.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {comment.author?.username}
                    </span>
                    comentó {commentTime}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {comment.body}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Add comment form */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleAddComment} className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full min-h-[100px] rounded-md border px-3 py-2 text-sm"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={addingComment || !newComment.trim()}
                    className="gap-2"
                  >
                    {addingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Comentar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
