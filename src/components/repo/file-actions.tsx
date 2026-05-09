'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Copy, Pencil, Trash2, Check } from 'lucide-react';
import { filesApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type FileActionsProps = {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  sha: string;
  content: string;
  downloadUrl?: string;
};

export function FileActions({
  owner,
  repo,
  branch,
  path,
  sha,
  content,
  downloadUrl,
}: FileActionsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    router.push(`/${owner}/${repo}/edit/${branch}/${path}`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await filesApi.deleteFile({
        owner,
        repo,
        filePath: path,
        sha,
        message: `Delete ${path}`,
        branch,
      });

      // Navegar al directorio padre
      const parentPath = path.split('/').slice(0, -1).join('/');
      if (parentPath) {
        router.push(`/${owner}/${repo}/tree/${branch}/${parentPath}`);
      } else {
        router.push(`/${owner}/${repo}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error al eliminar el archivo');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Usar el endpoint real de descarga del API
      const response = await filesApi.getRawFile({
        owner,
        repo,
        path,
        ref: branch,
      });

      // El response es un Blob
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: descargar el contenido local
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" onClick={handleDownload} title="Descargar">
        <Download className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="icon-sm" onClick={handleCopy} title="Copiar">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>

      {isAuthenticated && (
        <>
          <Button variant="ghost" size="icon-sm" onClick={handleEdit} title="Editar">
            <Pencil className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="text-destructive" title="Eliminar">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción eliminará permanentemente <strong>{path}</strong> del repositorio.
                  Se creará un commit de eliminación.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
