'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, FilePlus, FolderPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { filesApi } from '@/lib/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CreateActionsProps = {
  owner: string;
  repo: string;
  branch: string;
  currentPath?: string;
};

export function CreateActions({ owner, repo, branch, currentPath = '' }: CreateActionsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return null;
  }

  const newFilePath = currentPath
    ? `/${owner}/${repo}/new/${branch}/${currentPath}`
    : `/${owner}/${repo}/new/${branch}`;

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      setError('El nombre de la carpeta es requerido');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const fullPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      const message = commitMessage.trim() || `Create folder ${folderName}`;

      await filesApi.createFolder({
        owner,
        repo,
        createFolderBody: {
          path: fullPath,
          message,
          branch,
        },
      });

      setFolderDialogOpen(false);
      setFolderName('');
      setCommitMessage('');

      // Navegar a la nueva carpeta
      router.push(`/${owner}/${repo}/tree/${branch}/${fullPath}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Error al crear la carpeta. Verifica que no exista.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Crear
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={newFilePath} className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Nuevo archivo
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setFolderDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            Nueva carpeta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva carpeta</DialogTitle>
            <DialogDescription>
              Se creará un archivo .gitkeep dentro de la carpeta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="folder-name">Nombre de la carpeta</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">
                  {currentPath ? `${currentPath}/` : ''}
                </span>
              </div>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="nueva-carpeta"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commit-message">Mensaje del commit (opcional)</Label>
              <Input
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder={`Create folder ${folderName || 'nueva-carpeta'}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFolderDialogOpen(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear carpeta'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
