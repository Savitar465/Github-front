import { RepoHeader, DiffViewer } from '@/components/repo';
import { getCommit, type CommitDTO, type CommitFileChangeDTO } from '@/lib/api/repository-api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, GitCommit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ owner: string; repo: string; sha: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo, sha } = await params;
  return {
    title: buildPageTitle(`Commit ${sha.slice(0, 7)} - ${owner}/${repo}`),
  };
}

async function getCommitDetail(
  owner: string,
  repo: string,
  sha: string
): Promise<{ commit: CommitDTO; files: CommitFileChangeDTO[] }> {
  try {
    const commit = await getCommit(owner, repo, sha);
    return {
      commit,
      files: commit.files || [],
    };
  } catch (error) {
    console.error('Error fetching commit:', error);
    const fallbackCommit: CommitDTO = {
      sha: sha,
      shortSha: sha.slice(0, 7),
      message: '',
      title: '',
      author: { name: 'Unknown', email: '', date: new Date().toISOString() },
      committer: { name: 'Unknown', email: '', date: new Date().toISOString() },
      authorDate: new Date().toISOString(),
      committerDate: new Date().toISOString(),
      parentShas: [],
    };
    return { commit: fallbackCommit, files: [] };
  }
}

export default async function CommitDetailPage({ params }: PageProps) {
  const { owner, repo, sha } = await params;

  const { commit, files } = await getCommitDetail(owner, repo, sha);

  const [title, ...bodyLines] = commit.message.split('\n');
  const body = bodyLines.join('\n').trim();
  const commitDate = new Date(commit.author.date);
  const timeAgo = formatDistanceToNow(commitDate, { addSuffix: true, locale: es });

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        activeTab="commits"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Commit header */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="p-6 bg-muted/30">
            <h1 className="text-xl font-semibold mb-2">{title}</h1>

            {body && (
              <pre className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                {body}
              </pre>
            )}

            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {commit.author.name[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{commit.author.name}</div>
                  <div className="text-xs text-muted-foreground">{commit.author.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={commit.author.date}>{timeAgo}</time>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-muted/50 border-t flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 font-mono">
                <GitCommit className="h-4 w-4" />
                <span>{commit.sha}</span>
              </div>

              {commit.parentShas && commit.parentShas.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Parent:</span>
                  <Link
                    href={`/${owner}/${repo}/commit/${commit.parentShas[0]}`}
                    className="font-mono text-blue-500 hover:underline"
                  >
                    {commit.parentShas[0].slice(0, 7)}
                  </Link>
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copiar SHA
            </Button>
          </div>
        </div>

        {/* File changes */}
        <DiffViewer files={files} />
      </div>
    </div>
  );
}
