import { RepoHeader, DiffViewer } from '@/components/repo';
import { filesApi } from '@/lib/api';
import type { CommitDTO, CommitFile } from '@/lib/api';
import { buildPageTitle } from '@/lib/build-page-title';
import { Metadata } from 'next';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, GitCommit, Copy, Check } from 'lucide-react';
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

// Mock commit detail
const mockCommit: CommitDTO = {
  sha: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  message: 'feat: Agregar explorador de archivos con navegación\n\nImplementa el componente FileTree con soporte para navegación entre carpetas.\n\n- Agrega iconos para diferentes tipos de archivo\n- Implementa ordenamiento (carpetas primero)\n- Agrega navegación con breadcrumbs',
  author: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
  committer: { name: 'Davichox', email: 'davi@example.com', date: '2024-01-16T14:30:00Z' },
  parents: [{ sha: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1', url: '/commit/b2c3d4...' }],
};

const mockFiles: CommitFile[] = [
  {
    filename: 'src/components/repo/file-tree.tsx',
    status: 'added',
    additions: 45,
    deletions: 0,
    changes: 45,
    patch: `@@ -0,0 +1,45 @@
+import Link from 'next/link';
+import { FileIcon } from './file-icon';
+
+export function FileTree({ entries, owner, repo }) {
+  const sorted = [...entries].sort((a, b) => {
+    if (a.type === 'dir' && b.type !== 'dir') return -1;
+    return a.name.localeCompare(b.name);
+  });
+
+  return (
+    <div className="border rounded-lg">
+      {sorted.map((entry) => (
+        <FileRow key={entry.sha} entry={entry} />
+      ))}
+    </div>
+  );
+}`,
  },
  {
    filename: 'src/components/repo/file-icon.tsx',
    status: 'added',
    additions: 32,
    deletions: 0,
    changes: 32,
    patch: `@@ -0,0 +1,32 @@
+import { File, Folder } from 'lucide-react';
+
+export function FileIcon({ name, type }) {
+  if (type === 'dir') {
+    return <Folder className="text-blue-500" />;
+  }
+  return <File className="text-muted-foreground" />;
+}`,
  },
  {
    filename: 'src/components/repo/breadcrumbs.tsx',
    status: 'modified',
    additions: 12,
    deletions: 5,
    changes: 17,
    patch: `@@ -10,8 +10,15 @@ export function Breadcrumbs({ owner, repo, path }) {
   return (
     <nav className="flex items-center gap-1">
-      <Link href={\`/\${owner}/\${repo}\`}>
+      <Link
+        href={\`/\${owner}/\${repo}\`}
+        className="font-semibold hover:underline"
+      >
         {repo}
       </Link>
+      {segments.map((segment, i) => (
+        <Segment key={i} segment={segment} />
+      ))}
     </nav>
   );
 }`,
  },
];

async function getCommitDetail(
  owner: string,
  repo: string,
  sha: string
): Promise<{ commit: CommitDTO; files: CommitFile[] }> {
  try {
    // Obtener información del commit (incluye archivos modificados)
    const commitResponse = await filesApi.getCommit({ owner, repo, sha });

    return {
      commit: commitResponse.commit,
      files: commitResponse.files || [],
    };
  } catch (error) {
    console.error('Error fetching commit:', error);
    return { commit: mockCommit, files: mockFiles };
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

              {commit.parents && commit.parents.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>Parent:</span>
                  <Link
                    href={`/${owner}/${repo}/commit/${commit.parents[0].sha}`}
                    className="font-mono text-blue-500 hover:underline"
                  >
                    {commit.parents[0].sha.slice(0, 7)}
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
