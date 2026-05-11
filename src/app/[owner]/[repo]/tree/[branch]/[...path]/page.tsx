import { RepoHeader, FileTree, BranchSelector, Breadcrumbs } from '@/components/repo';
import { CreateActions } from '@/components/repo/create-actions';
import { filesApi } from '@/lib/api';
import type { DirectoryEntryDTO } from '@/lib/api';
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

// Mock data
const mockEntries: Record<string, DirectoryEntryDTO[]> = {
  src: [
    { name: 'components', path: 'src/components', sha: '10', type: 'dir' },
    { name: 'lib', path: 'src/lib', sha: '11', type: 'dir' },
    { name: 'app', path: 'src/app', sha: '12', type: 'dir' },
    { name: 'index.ts', path: 'src/index.ts', sha: '13', type: 'file', size: 156 },
  ],
  docs: [
    { name: 'api.md', path: 'docs/api.md', sha: '20', type: 'file', size: 2340 },
    { name: 'getting-started.md', path: 'docs/getting-started.md', sha: '21', type: 'file', size: 1890 },
  ],
};

async function getDirectoryContents(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<DirectoryEntryDTO[]> {
  try {
    const response = await filesApi.getRepositoryContents({
      owner,
      repo,
      path,
      ref: branch,
    });
    return response.entries || [];
  } catch (error) {
    console.error('Error fetching directory:', error);
    // Mock data para desarrollo
    const key = path.split('/').pop() || '';
    return mockEntries[key] || [];
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
