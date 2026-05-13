import Link from 'next/link';
import { GitCommit, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { CommitDTO } from '@/lib/api/repository-api';

type CommitListProps = {
  commits: CommitDTO[];
  owner: string;
  repo: string;
};

export function CommitList({ commits, owner, repo }: CommitListProps) {
  return (
    <div className="border rounded-lg overflow-hidden divide-y divide-border">
      {commits.map((commit) => (
        <CommitItem key={commit.sha} commit={commit} owner={owner} repo={repo} />
      ))}
    </div>
  );
}

type CommitItemProps = {
  commit: CommitDTO;
  owner: string;
  repo: string;
};

function CommitItem({ commit, owner, repo }: CommitItemProps) {
  const shortSha = commit.sha.slice(0, 7);
  const commitDate = new Date(commit.author.date);
  const timeAgo = formatDistanceToNow(commitDate, { addSuffix: true, locale: es });

  // Separar título del mensaje (primera línea)
  const [title, ...bodyLines] = commit.message.split('\n');
  const hasBody = bodyLines.some((line) => line.trim());

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            href={`/${owner}/${repo}/commit/${commit.sha}`}
            className="font-medium text-sm hover:text-blue-500 hover:underline line-clamp-2"
          >
            {title}
          </Link>

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{commit.author.name}</span>
            </div>
            <span>·</span>
            <time dateTime={commit.author.date}>{timeAgo}</time>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${owner}/${repo}/commit/${commit.sha}`}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-muted hover:bg-muted/80 rounded-md text-xs font-mono transition-colors"
          >
            <GitCommit className="h-3 w-3" />
            {shortSha}
          </Link>
        </div>
      </div>
    </div>
  );
}
