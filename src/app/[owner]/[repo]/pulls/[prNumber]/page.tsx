'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { pullRequestsApi, closePullRequest } from '@/lib/api/pullrequests';
import type { PullRequestDTO, PullRequestCommentDTO } from '@/lib/api/pullrequests';
import { RepoHeader } from '@/components/repo';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  GitPullRequest,
  GitMerge,
  XCircle,
  Loader2,
  MessageSquare,
  GitCommit,
  Check,
  X,
  AlertCircle,
  GitBranch,
  User,
  Calendar,
} from 'lucide-react';

type ReviewDecision = 'approved' | 'changes_requested' | 'commented';
type MergeStrategy = 'merge' | 'squash' | 'rebase';

export default function PullRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const owner = params.owner as string;
  const repo = params.repo as string;
  const prNumber = parseInt(params.prNumber as string);

  const [pr, setPr] = useState<PullRequestDTO | null>(null);
  const [comments, setComments] = useState<PullRequestCommentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<ReviewDecision>('approved');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Merge
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>('merge');
  const [mergeMessage, setMergeMessage] = useState('');
  const [merging, setMerging] = useState(false);
  const [mergeability, setMergeability] = useState<{ mergeable: boolean; reason?: string } | null>(null);

  // Comment
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Close
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    loadPullRequest();
    loadComments();
  }, [owner, repo, prNumber]);

  const loadPullRequest = async () => {
    setLoading(true);
    try {
      const response = await pullRequestsApi.getPullRequest({ owner, repo, prNumber });
      setPr(response);

      // Cargar mergeability si está abierto
      if (response.status === 'open') {
        try {
          const mergeabilityResponse = await pullRequestsApi.getPullRequestMergeability({ owner, repo, prNumber });
          setMergeability(mergeabilityResponse);
        } catch {
          // Ignorar error de mergeability
        }
      }
    } catch (err) {
      console.error('Error loading PR:', err);
      setError('Error al cargar el pull request');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await pullRequestsApi.listPullRequestComments({ owner, repo, prNumber });
      setComments(response.comments || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleReview = async () => {
    setSubmittingReview(true);
    try {
      await pullRequestsApi.reviewPullRequest({
        owner,
        repo,
        prNumber,
        reviewPullRequestBody: {
          decision: reviewDecision,
          comment: reviewComment || undefined,
        },
      });
      setReviewDialogOpen(false);
      setReviewComment('');
      loadPullRequest();
      loadComments();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Error al enviar la revisión');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMerge = async () => {
    setMerging(true);
    try {
      await pullRequestsApi.mergePullRequest({
        owner,
        repo,
        prNumber,
        mergePullRequestBody: {
          strategy: mergeStrategy,
          commitMessage: mergeMessage || undefined,
        },
      });
      setMergeDialogOpen(false);
      loadPullRequest();
    } catch (err) {
      console.error('Error merging PR:', err);
      setError('Error al mergear el pull request');
    } finally {
      setMerging(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await pullRequestsApi.createPullRequestComment({
        owner,
        repo,
        prNumber,
        createPullRequestCommentBody: {
          body: newComment,
        },
      });
      setNewComment('');
      loadComments();
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Error al crear el comentario');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await closePullRequest(owner, repo, prNumber);
      setCloseDialogOpen(false);
      loadPullRequest();
    } catch (err) {
      console.error('Error closing PR:', err);
      setError('Error al cerrar el pull request');
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} activeTab="pulls" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!pr) {
    return (
      <div className="min-h-screen">
        <RepoHeader owner={owner} repo={repo} activeTab="pulls" />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Pull request no encontrado</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    open: { icon: GitPullRequest, color: 'text-green-500 bg-green-500/10', label: 'Abierto' },
    closed: { icon: XCircle, color: 'text-red-500 bg-red-500/10', label: 'Cerrado' },
    merged: { icon: GitMerge, color: 'text-purple-500 bg-purple-500/10', label: 'Mergeado' },
  };

  const status = statusConfig[pr.status as keyof typeof statusConfig] || statusConfig.open;
  const StatusIcon = status.icon;
  const createdAt = pr.createdAt ? new Date(pr.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: es });

  return (
    <div className="min-h-screen">
      <RepoHeader owner={owner} repo={repo} activeTab="pulls" />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Header del PR */}
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {pr.title}
                <span className="text-muted-foreground font-normal ml-2">#{pr.number}</span>
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {status.label}
                </span>

                <span className="text-sm text-muted-foreground">
                  <span className="font-medium">{pr.author?.username}</span> quiere mergear
                </span>

                <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                  {pr.sourceBranch}
                </span>
                <span className="text-sm text-muted-foreground">→</span>
                <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                  {pr.targetBranch}
                </span>
              </div>
            </div>

            {/* Acciones */}
            {isAuthenticated && pr.status === 'open' && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setReviewDialogOpen(true)}>
                  Revisar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCloseDialogOpen(true)}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <XCircle className="h-4 w-4" />
                  Cerrar
                </Button>
                <Button
                  onClick={() => setMergeDialogOpen(true)}
                  disabled={!mergeability?.mergeable}
                  className="gap-2"
                >
                  <GitMerge className="h-4 w-4" />
                  Merge
                </Button>
              </div>
            )}
          </div>

          {/* Info adicional */}
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {pr.author?.username}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {timeAgo}
            </span>
            <span className="flex items-center gap-1">
              <GitCommit className="h-4 w-4" />
              {pr.commitsCount || 0} commits
            </span>
            {pr.hasConflicts && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4" />
                Tiene conflictos
              </span>
            )}
          </div>

          {/* Descripción */}
          {pr.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm whitespace-pre-wrap">{pr.description}</p>
            </div>
          )}

          {/* Mergeability warning */}
          {mergeability && !mergeability.mergeable && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {mergeability.reason || 'Este PR no puede ser mergeado en este momento'}
            </div>
          )}
        </div>

        {/* Comentarios */}
        <div className="border rounded-lg">
          <div className="px-4 py-3 border-b bg-muted/30">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentarios ({comments.length})
            </h2>
          </div>

          <div className="divide-y">
            {comments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No hay comentarios aún
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      {comment.author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="font-medium text-sm">{comment.author?.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
                    </span>
                    {comment.filePath && (
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {comment.filePath}:{comment.lineNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm pl-8">{comment.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Agregar comentario */}
          {isAuthenticated && (
            <div className="p-4 border-t bg-muted/30">
              <Textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2"
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim() || submittingComment}
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Comentar'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog de revisión */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar Pull Request</DialogTitle>
            <DialogDescription>
              Envía tu revisión para este pull request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              {[
                { value: 'approved', label: 'Aprobar', icon: Check, color: 'text-green-500' },
                { value: 'changes_requested', label: 'Solicitar cambios', icon: X, color: 'text-red-500' },
                { value: 'commented', label: 'Comentar', icon: MessageSquare, color: 'text-blue-500' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={reviewDecision === option.value ? 'default' : 'outline'}
                  onClick={() => setReviewDecision(option.value as ReviewDecision)}
                  className="flex-1 gap-2"
                >
                  <option.icon className={`h-4 w-4 ${reviewDecision === option.value ? '' : option.color}`} />
                  {option.label}
                </Button>
              ))}
            </div>

            <Textarea
              placeholder="Comentario (opcional)"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleReview} disabled={submittingReview}>
              {submittingReview ? 'Enviando...' : 'Enviar revisión'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de merge */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Pull Request</DialogTitle>
            <DialogDescription>
              Selecciona la estrategia de merge para este PR.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {[
                { value: 'merge', label: 'Merge commit', desc: 'Crea un commit de merge' },
                { value: 'squash', label: 'Squash and merge', desc: 'Combina todos los commits en uno' },
                { value: 'rebase', label: 'Rebase and merge', desc: 'Rebase los commits sobre la rama base' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                    mergeStrategy === option.value ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="mergeStrategy"
                    value={option.value}
                    checked={mergeStrategy === option.value}
                    onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <Textarea
              placeholder="Mensaje del commit (opcional)"
              value={mergeMessage}
              onChange={(e) => setMergeMessage(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMergeDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleMerge} disabled={merging} className="gap-2">
              {merging ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mergeando...
                </>
              ) : (
                <>
                  <GitMerge className="h-4 w-4" />
                  Confirmar merge
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de cerrar */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar Pull Request</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cerrar este pull request? Esta acción se puede deshacer más tarde.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              El pull request se cerrará sin mergear los cambios.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleClose}
              disabled={closing}
              className="gap-2"
            >
              {closing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Cerrar Pull Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
