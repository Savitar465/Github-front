import { RepoHeader, FileTree, BranchSelector, Breadcrumbs } from '@/components/repo';
import { CreateActions } from '@/components/repo/create-actions';
import { getRepoContents } from '@/lib/api/repository-api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ owner: string; repo: string; branch: string; path: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo, path } = await params;
  const pathString = path.join('/');
  return {
    title: buildPageTitle(`${pathString} - ${owner}/${repo}`),
  };
}

// Map FileEntryDTO to DirectoryEntryDTO format expected by FileTree
type DirectoryEntry = {
  name: string;
  path: string;
  sha?: string;
  type: 'file' | 'dir';
  size?: number;
};

// Fetch directory contents from Repository API
async function getDirectoryContents(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<DirectoryEntry[]> {
  try {
    const response = await getRepoContents(owner, repo, undefined, path, branch);
    // Map contents to DirectoryEntry format expected by FileTree
    return (response.contents || []).map(entry => ({
      name: entry.name,
      path: entry.path,
      sha: entry.path, // Use path as sha if not provided
      type: entry.type === 'directory' ? 'dir' as const : 'file' as const,
      size: entry.size ?? undefined,
    }));
  } catch (error) {
    console.error('Error fetching directory:', error);
    // If backend fails, return empty directory list.
    return [];
  }
}

export default async function TreePage({ params }: PageProps) {
  const { owner, repo, branch, path } = await params;
  const pathString = path.join('/');

  const entries = await getDirectoryContents(owner, repo, pathString, branch);

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        defaultBranch={branch}
        activeTab="code"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Branch selector, breadcrumbs and create button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <BranchSelector currentBranch={branch} />
            <Breadcrumbs owner={owner} repo={repo} path={pathString} branch={branch} />
          </div>
          <CreateActions owner={owner} repo={repo} branch={branch} currentPath={pathString} />
        </div>

        {/* File tree */}
        <FileTree
          entries={entries}
          owner={owner}
          repo={repo}
          branch={branch}
          currentPath={pathString}
        />
      </div>
    </div>
  );
}
