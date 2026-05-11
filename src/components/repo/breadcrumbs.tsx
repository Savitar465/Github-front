import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type BreadcrumbsProps = {
  owner: string;
  repo: string;
  path?: string;
  branch?: string;
};

export function Breadcrumbs({ owner, repo, path, branch = 'main' }: BreadcrumbsProps) {
  const segments = path ? path.split('/').filter(Boolean) : [];

  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto">
      <Link
        href={`/${owner}/${repo}`}
        className="font-semibold text-foreground hover:underline shrink-0"
      >
        {repo}
      </Link>

      {segments.map((segment, index) => {
        const href = `/${owner}/${repo}/tree/${branch}/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        return (
          <span key={index} className="flex items-center gap-1 shrink-0">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {isLast ? (
              <span className="text-foreground font-medium">{segment}</span>
            ) : (
              <Link href={href} className="text-blue-500 hover:underline">
                {segment}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
