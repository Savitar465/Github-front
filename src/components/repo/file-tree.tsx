import Link from 'next/link';
import { FileIcon } from './file-icon';
import type { DirectoryEntryDTO } from '@/lib/api';

type FileTreeProps = {
  entries: DirectoryEntryDTO[];
  owner: string;
  repo: string;
  branch?: string;
  currentPath?: string;
};

export function FileTree({ entries, owner, repo, branch = 'main' }: FileTreeProps) {
  // Ordenar: carpetas primero, luego archivos alfabéticamente
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.type === 'dir' && b.type !== 'dir') return -1;
    if (a.type !== 'dir' && b.type === 'dir') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="divide-y divide-border">
        {sortedEntries.map((entry) => {
          const isDir = entry.type === 'dir';
          const href = isDir
            ? `/${owner}/${repo}/tree/${branch}/${entry.path}`
            : `/${owner}/${repo}/blob/${branch}/${entry.path}`;

          return (
            <div
              key={entry.sha}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Link href={href} className="flex items-center gap-3 group">
                  <FileIcon name={entry.name} type={isDir ? 'dir' : 'file'} />
                  <span className="text-sm group-hover:text-blue-500 group-hover:underline">{entry.name}</span>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {!isDir && entry.size !== undefined ? (
                  <span className="text-xs text-muted-foreground">{formatFileSize(entry.size)}</span>
                ) : (
                  <span className="text-xs text-muted-foreground">{isDir ? 'Directory' : ''}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
