import { RepoPageClient } from './repo-page';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ owner: string; repo: string }>;
  searchParams: Promise<{ ref?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params;
  return {
    title: buildPageTitle(`${owner}/${repo}`),
    description: `Repository ${owner}/${repo}`,
  };
}

export default async function RepoPage({ params, searchParams }: PageProps) {
  const { owner, repo } = await params;
  const { ref } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <RepoPageClient owner={owner} repo={repo} defaultBranch={ref || 'main'} />
    </div>
  );
}
