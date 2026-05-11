import { RepoHeader, BranchSelector, Breadcrumbs, CodeViewer } from '@/components/repo';
import { FileActions } from '@/components/repo/file-actions';
import { filesApi } from '@/lib/api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';

// Removed embedded mock file contents — file content will be loaded from API at runtime.
async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<{ content: string; size: number; sha: string } | null> {
  try {
    const response = await filesApi.getFileContent({
      owner,
      repo,
      filePath: path,
      ref: branch,
    });

    if (response.file?.content) {
      // Decodificar base64 (compatible con Node.js server-side)
      const content = Buffer.from(response.file.content, 'base64').toString('utf-8');
      return {
        content,
        size: response.file.size || 0,
        sha: response.file.sha,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching file:', error);
    // If backend fails, return null so the UI shows an empty/not-found state.
    return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default async function BlobPage({ params }: PageProps) {
  const { owner, repo, branch, path } = await params;
  const pathString = path.join('/');
  const filename = path[path.length - 1];

  const file = await getFileContent(owner, repo, pathString, branch);
  const lineCount = file?.content.split('\n').length || 0;

  return (
    <div className="min-h-screen">
      <RepoHeader
        owner={owner}
        repo={repo}
        defaultBranch={branch}
        activeTab="code"
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Branch selector and breadcrumbs */}
        <div className="flex items-center gap-4 mb-4">
          <BranchSelector currentBranch={branch} />
          <Breadcrumbs owner={owner} repo={repo} path={pathString} branch={branch} />
        </div>

        {/* File viewer */}
        <div className="border rounded-lg overflow-hidden">
          {/* File header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">{filename}</span>
              <span className="text-muted-foreground">{lineCount} líneas</span>
              <span className="text-muted-foreground">{formatFileSize(file?.size || 0)}</span>
            </div>
            <FileActions
              owner={owner}
              repo={repo}
              branch={branch}
              path={pathString}
              sha={file?.sha || ''}
              content={file?.content || ''}
            />
          </div>

          {/* Code content */}
          {file && (
            <CodeViewer
              code={file.content}
              filename={filename}
              showLineNumbers={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
