import Link from 'next/link';
import { GitBranch, Star, GitFork, Eye, Code, History, GitCompare, Settings, GitPullRequest, CircleDot } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RepoHeaderProps = {
  owner: string;
  repo: string;
  description?: string;
  defaultBranch?: string;
  activeTab?: 'code' | 'commits' | 'compare' | 'pulls' | 'issues';
  starsCount?: number;
  forksCount?: number;
  watchersCount?: number;
};

export function RepoHeader({
  owner,
  repo,
  description,
  defaultBranch = 'main',
  activeTab = 'code',
  starsCount = 0,
  forksCount = 0,
  watchersCount = 0,
}: RepoHeaderProps) {
  const tabs = [
    { id: 'code', label: 'Código', icon: Code, href: `/${owner}/${repo}` },
    { id: 'issues', label: 'Issues', icon: CircleDot, href: `/${owner}/${repo}/issues` },
    { id: 'pulls', label: 'Pull Requests', icon: GitPullRequest, href: `/${owner}/${repo}/pulls` },
    { id: 'commits', label: 'Commits', icon: History, href: `/${owner}/${repo}/commits` },
    { id: 'compare', label: 'Comparar', icon: GitCompare, href: `/${owner}/${repo}/compare` },
  ] as const;

  return (
    <div className="border-b bg-background">
      {/* Main header */}
      <div className="px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Link href={`/${owner}`} className="text-blue-600 hover:underline">{owner}</Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/${owner}/${repo}`} className="text-foreground hover:underline">{repo}</Link>
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground rounded-full ml-2">Público</span>
            </h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              <span>Seguir</span>
              <span className="ml-1 bg-muted/50 px-2 py-0.5 rounded text-xs font-medium">{watchersCount}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Star className="h-4 w-4" />
              <span>Destacar</span>
              <span className="ml-1 bg-muted/50 px-2 py-0.5 rounded text-xs font-medium">{starsCount}</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <GitFork className="h-4 w-4" />
              <span>Bifurcar</span>
              <span className="ml-1 bg-muted/50 px-2 py-0.5 rounded text-xs font-medium">{forksCount}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex px-6 max-w-7xl mx-auto border-t">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-blue-600 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
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
