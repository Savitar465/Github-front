"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createIssueComment } from "@/lib/services/issues";
import type { CommentDTO, CreateCommentPayload } from "@/types/issue";

type CommentsSectionProps = {
  orgName: string;
  repoName: string;
  issueNumber: number;
  initialComments: CommentDTO[];
};

export function CommentsSection({
  orgName,
  repoName,
  issueNumber,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentDTO[]>(initialComments);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CreateCommentPayload = { body: body.trim() };
      const comment = await createIssueComment(orgName, repoName, issueNumber, payload);
      setComments((prev) => [...prev, comment]);
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar comentario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Comentarios ({comments.length})
      </h3>

      {comments.length > 0 && (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {comment.author.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString("es", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <Label htmlFor="comment-body">Agregar comentario</Label>
        <textarea
          id="comment-body"
          placeholder="Escribe un comentario..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={loading}
          rows={3}
          className="w-full rounded-xl border border-transparent bg-input/50 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={loading || !body.trim()}>
            {loading ? "Publicando..." : "Comentar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
