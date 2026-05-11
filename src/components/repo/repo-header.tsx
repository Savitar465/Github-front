import Link from 'next/link';
import { GitBranch, Star, GitFork, Eye, Code, History, GitCompare, Settings, GitPullRequest } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RepoHeaderProps = {
  owner: string;
  repo: string;
  description?: string;
  defaultBranch?: string;
  activeTab?: 'code' | 'commits' | 'compare' | 'pulls';
};

export function RepoHeader({
  owner,
  repo,
  description,
  defaultBranch = 'main',
  activeTab = 'code',
}: RepoHeaderProps) {
  const tabs = [
    { id: 'code', label: 'Código', icon: Code, href: `/${owner}/${repo}` },
    { id: 'pulls', label: 'Pull Requests', icon: GitPullRequest, href: `/${owner}/${repo}/pulls` },
    { id: 'commits', label: 'Commits', icon: History, href: `/${owner}/${repo}/commits` },
    { id: 'compare', label: 'Comparar', icon: GitCompare, href: `/${owner}/${repo}/compare` },
  ] as const;

  return (
    <div className="border-b">
      <div className="px-6 py-4">
        {/* Repo name and owner */}
        <div className="flex items-center gap-2 text-lg">
          <Link href={`/${owner}`} className="text-blue-500 hover:underline">
            {owner}
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href={`/${owner}/${repo}`} className="text-blue-500 hover:underline font-semibold">
            {repo}
          </Link>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Eye className="h-4 w-4" />
            Watch
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <GitFork className="h-4 w-4" />
            Fork
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Star className="h-4 w-4" />
            Star
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex px-6 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
