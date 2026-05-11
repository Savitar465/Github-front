import Link from "next/link";
import { CircleDot, CircleCheck, MessageSquare, ChevronRight } from "lucide-react";

import type { IssueDTO } from "@/types/issue";

type IssueCardProps = {
  orgName: string;
  repoName: string;
  issue: IssueDTO;
};

export function IssueCard({ orgName, repoName, issue }: IssueCardProps) {
  const isOpen = issue.state === "OPEN";

  return (
    <li className="flex items-start gap-3 py-3">
      <div className="mt-0.5 shrink-0">
        {isOpen ? (
          <CircleDot className="size-4 text-green-500" />
        ) : (
          <CircleCheck className="size-4 text-purple-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/orgs/${orgName}/repos/${repoName}/issues/${issue.number}`}
          className="text-sm font-medium text-foreground hover:text-primary hover:underline"
        >
          {issue.title}
        </Link>

        {issue.labels.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
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
        )}

        <p className="mt-0.5 text-xs text-muted-foreground">
          #{issue.number} por {issue.author.username}
          {issue.assignee && ` · asignado a ${issue.assignee.username}`}
          {" · "}{new Date(issue.createdAt).toLocaleDateString("es")}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {issue.commentsCount > 0 && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="size-3.5" />
            {issue.commentsCount}
          </span>
        )}
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </li>
  );
}
