"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleDot, CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateIssue, createIssueComment } from "@/lib/services/issues";
import type { CommentDTO, IssueDTO } from "@/types/issue";

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

function UserAvatar({ username }: { username: string }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase text-muted-foreground">
      {username.charAt(0)}
    </div>
  );
}

type IssueDetailProps = {
  orgName: string;
  repoName: string;
  issue: IssueDTO;
  initialComments: CommentDTO[];
};

export function IssueDetail({
  orgName,
  repoName,
  issue: initialIssue,
  initialComments,
}: IssueDetailProps) {
  const [issue, setIssue] = useState<IssueDTO>(initialIssue);
  const [comments, setComments] = useState<CommentDTO[]>(initialComments);
  const [toggling, setToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const isOpen = issue.state === "OPEN";

  async function handleToggleState() {
    setToggling(true);
    setToggleError(null);
    try {
      const updated = await updateIssue(orgName, repoName, issue.number, {
        state: isOpen ? "CLOSED" : "OPEN",
      });
      setIssue(updated);
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : "Failed to update issue");
    } finally {
      setToggling(false);
    }
  }

  async function handleSubmitComment(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setCommentLoading(true);
    setCommentError(null);
    try {
      const comment = await createIssueComment(orgName, repoName, issue.number, {
        body: commentBody.trim(),
      });
      setComments((prev) => [...prev, comment]);
      setCommentBody("");
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={`/orgs/${orgName}/repos/${repoName}/issues`}>
          <ArrowLeft className="size-4" />
          Back to issues
        </Link>
      </Button>

      {/* Title + state header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold leading-tight">
          {issue.title}{" "}
          <span className="font-normal text-muted-foreground">#{issue.number}</span>
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
              isOpen
                ? "bg-green-500/15 text-green-600"
                : "bg-purple-500/15 text-purple-600"
            }`}
          >
            {isOpen ? (
              <CircleDot className="size-3.5" />
            ) : (
              <CircleCheck className="size-3.5" />
            )}
            {isOpen ? "Open" : "Closed"}
          </span>
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{issue.author.username}</span>
            {" opened this issue "}
            {formatRelativeTime(issue.createdAt)}
            {" · "}
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <hr className="border-border" />

      {/* Two-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: main content */}
        <div className="min-w-0 flex-1 space-y-4">
          {/* Issue body post */}
          <div className="flex gap-3">
            <UserAvatar username={issue.author.username} />
            <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{issue.author.username}</span>
                  {" commented "}
                  {formatRelativeTime(issue.createdAt)}
                </p>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  Author
                </span>
              </div>
              <div className="p-4">
                {issue.body ? (
                  <p className="whitespace-pre-wrap text-sm">{issue.body}</p>
                ) : (
                  <p className="text-sm italic text-muted-foreground">No description provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Comments */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <UserAvatar username={comment.author.username} />
              <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-border">
                <div className="border-b border-border bg-muted/30 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{comment.author.username}</span>
                    {" commented "}
                    {formatRelativeTime(comment.createdAt)}
                  </p>
                </div>
                <div className="p-4">
                  <p className="whitespace-pre-wrap text-sm">{comment.body}</p>
                </div>
              </div>
            </div>
          ))}

          {/* New comment form */}
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              U
            </div>
            <form onSubmit={handleSubmitComment} className="min-w-0 flex-1 space-y-3">
              <div className="overflow-hidden rounded-lg border border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
                <div className="flex border-b border-border bg-muted/20 px-1 pt-1">
                  <span className="border-b-2 border-primary px-3 py-1 text-xs font-medium text-foreground">
                    Write
                  </span>
                  <span className="px-3 py-1 text-xs text-muted-foreground">Preview</span>
                </div>
                <textarea
                  placeholder="Leave a comment"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  disabled={commentLoading}
                  rows={4}
                  className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
                />
                <div className="flex items-center gap-3 border-t border-border bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="cursor-default font-bold">B</span>
                  <span className="cursor-default italic">I</span>
                  <span className="cursor-default font-mono">{"<>"}</span>
                  <span className="cursor-default">🔗</span>
                </div>
              </div>

              {(commentError || toggleError) && (
                <p className="text-sm text-destructive">{commentError ?? toggleError}</p>
              )}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleState}
                  disabled={toggling}
                >
                  {toggling ? "..." : isOpen ? "Close issue" : "Reopen issue"}
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={commentLoading || !commentBody.trim()}
                >
                  {commentLoading ? "Posting..." : "Comment"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: sidebar */}
        <aside className="shrink-0 space-y-4 lg:w-60">
          {/* Assignees */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assignees
            </h3>
            {issue.assignee ? (
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold uppercase">
                  {issue.assignee.username.charAt(0)}
                </div>
                <span className="text-sm">{issue.assignee.username}</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No one assigned</p>
            )}
          </div>

          <hr className="border-border" />

          {/* Labels */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Labels
            </h3>
            {issue.labels.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {issue.labels.map((label) => (
                  <span
                    key={label.id}
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${label.color}33`,
                      color: label.color,
                      border: `1px solid ${label.color}66`,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">None yet</p>
            )}
          </div>

          <hr className="border-border" />

          {/* Timeline */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Timeline
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Created</span>
                <span className="text-right text-foreground">
                  {formatRelativeTime(issue.createdAt)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-right text-foreground">
                  {formatRelativeTime(issue.updatedAt)}
                </span>
              </div>
              {issue.closedAt && (
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">Closed</span>
                  <span className="text-right text-foreground">
                    {formatRelativeTime(issue.closedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
