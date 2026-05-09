'use client';

import { File, Plus, Minus, FileEdit } from 'lucide-react';
import type { CommitFile } from '@/lib/api';

type DiffViewerProps = {
  files: CommitFile[];
};

export function DiffViewer({ files }: DiffViewerProps) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{files.length} archivos cambiados</span>
        <span className="flex items-center gap-1 text-green-500">
          <Plus className="h-3 w-3" />
          {files.reduce((sum, f) => sum + (f.additions || 0), 0)} adiciones
        </span>
        <span className="flex items-center gap-1 text-red-500">
          <Minus className="h-3 w-3" />
          {files.reduce((sum, f) => sum + (f.deletions || 0), 0)} eliminaciones
        </span>
      </div>

      {/* File diffs */}
      <div className="space-y-3">
        {files.map((file, index) => (
          <FileDiff key={index} file={file} />
        ))}
      </div>
    </div>
  );
}

function FileDiff({ file }: { file: CommitFile }) {
  const statusColors: Record<string, string> = {
    added: 'text-green-500 bg-green-500/10',
    modified: 'text-yellow-500 bg-yellow-500/10',
    deleted: 'text-red-500 bg-red-500/10',
    renamed: 'text-blue-500 bg-blue-500/10',
  };

  const statusLabels: Record<string, string> = {
    added: 'Agregado',
    modified: 'Modificado',
    deleted: 'Eliminado',
    renamed: 'Renombrado',
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* File header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2">
          <File className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-mono">{file.filename}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-xs font-medium ${
              statusColors[file.status] || 'text-muted-foreground bg-muted'
            }`}
          >
            {statusLabels[file.status] || file.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-500">+{file.additions || 0}</span>
          <span className="text-red-500">-{file.deletions || 0}</span>
        </div>
      </div>

      {/* Patch content */}
      {file.patch && (
        <div className="overflow-x-auto">
          <pre className="text-xs p-4 font-mono">
            {file.patch.split('\n').map((line, i) => {
              let className = '';
              if (line.startsWith('+') && !line.startsWith('+++')) {
                className = 'bg-green-500/10 text-green-700 dark:text-green-400';
              } else if (line.startsWith('-') && !line.startsWith('---')) {
                className = 'bg-red-500/10 text-red-700 dark:text-red-400';
              } else if (line.startsWith('@@')) {
                className = 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
              }

              return (
                <div key={i} className={`px-2 ${className}`}>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      )}
    </div>
  );
}
