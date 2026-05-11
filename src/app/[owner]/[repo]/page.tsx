// import { notFound } from 'next/navigation';
import { RepoHeader, FileTree, BranchSelector, Breadcrumbs } from '@/components/repo';
import { RepoMetaClient } from '@/components/repo/repo-meta-client';
import { CreateActions } from '@/components/repo/create-actions';
import { filesApi } from '@/lib/api';
import type { DirectoryEntryDTO } from '@/lib/api';
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
    description: `Explorar el repositorio ${owner}/${repo}`,
  };
}

// Mock data para desarrollo (cuando el backend no está disponible)
const mockEntries: DirectoryEntryDTO[] = [
  { name: 'src', path: 'src', sha: '1', type: 'dir' },
  { name: 'docs', path: 'docs', sha: '2', type: 'dir' },
  { name: 'tests', path: 'tests', sha: '3', type: 'dir' },
  { name: '.gitignore', path: '.gitignore', sha: '4', type: 'file', size: 234 },
  { name: 'README.md', path: 'README.md', sha: '5', type: 'file', size: 1540 },
  { name: 'package.json', path: 'package.json', sha: '6', type: 'file', size: 892 },
  { name: 'tsconfig.json', path: 'tsconfig.json', sha: '7', type: 'file', size: 456 },
];

async function getRepoContents(owner: string, repo: string, ref?: string): Promise<DirectoryEntryDTO[]> {
  try {
    const response = await filesApi.getRepositoryContents({
      owner,
      repo,
      ref: ref || 'main',
    });
    return response.entries || [];
  } catch (error) {
    // Log error for debugging but fallback to mock data
    if (error instanceof Error) {
      console.warn(`Could not fetch ${owner}/${repo} contents from backend: ${error.message}. Using mock data.`);
    }
    // Retornar mock data en desarrollo
    return mockEntries;
  }
}

export default async function RepoPage({ params, searchParams }: PageProps) {
  const { owner, repo } = await params;
  const { ref } = await searchParams;
  const branch = ref || 'main';

  const entries = await getRepoContents(owner, repo, branch);

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        description="Repositorio de ejemplo"
        defaultBranch={branch}
        activeTab="code"
      />

      {/* Repository metadata fetched from repository-service */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <RepoMetaClient owner={owner} repo={repo} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Branch selector, breadcrumbs and create button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <BranchSelector currentBranch={branch} />
            <Breadcrumbs owner={owner} repo={repo} branch={branch} />
          </div>
          <CreateActions owner={owner} repo={repo} branch={branch} />
        </div>

        {/* File tree */}
        <FileTree
          entries={entries}
          owner={owner}
          repo={repo}
          branch={branch}
        />

        {/* README section */}
        <div className="mt-6 border rounded-lg">
          <div className="px-4 py-3 bg-muted/50 border-b">
            <h3 className="text-sm font-semibold">README.md</h3>
          </div>
          <div className="p-6 prose dark:prose-invert max-w-none">
            <h1>{repo}</h1>
            <p>Descripción del repositorio y documentación principal.</p>
            <h2>Instalación</h2>
            <pre><code>npm install</code></pre>
            <h2>Uso</h2>
            <pre><code>npm run dev</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
