'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { GitBranch, Plus, Trash2, Check } from 'lucide-react';
import {
  listBranches,
  createBranch,
  deleteBranch,
  type BranchDTO,
  type ListBranchesBody,
} from '@/lib/api/repository-api';
import { useAuth } from '@/lib/auth';

type BranchManagerProps = {
  owner: string;
  repo: string;
  defaultBranch: string;
  onBranchChange?: (branch: string) => void;
};

export function BranchManager({ owner, repo, defaultBranch, onBranchChange }: BranchManagerProps) {
  const { token, isAuthenticated } = useAuth();
  const [branches, setBranches] = useState<BranchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);

  // Create branch state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [fromBranch, setFromBranch] = useState(defaultBranch);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete branch state
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadBranches = async () => {
    setLoading(true);
    try {
      const res = await listBranches(owner, repo, token || undefined);
      setBranches(res.branches || []);
      // Update fromBranch default when branches load
      if (res.branches && res.branches.length > 0) {
        const defaultB = res.branches.find(b => b.isDefault);
        if (defaultB) {
          setFromBranch(defaultB.name);
        }
      }
    } catch (err) {
      console.error('Error loading branches:', err);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, [owner, repo, token]);

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      setCreateError('El nombre de la rama es requerido');
      return;
    }
    if (!token) {
      setCreateError('Debes iniciar sesión para crear ramas');
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      await createBranch(owner, repo, token, {
        name: newBranchName.trim(),
        fromBranch: fromBranch,
      });

      setNewBranchName('');
      setShowCreateDialog(false);
      await loadBranches();
    } catch (err) {
      console.error('Error creating branch:', err);
      setCreateError(err instanceof Error ? err.message : 'Error al crear la rama');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBranch = async (branchName: string) => {
    if (!token) return;

    setDeleting(branchName);
    try {
      await deleteBranch(owner, repo, branchName, token);
      await loadBranches();

      // If deleted branch was selected, switch to default
      if (selectedBranch === branchName) {
        setSelectedBranch(defaultBranch);
        onBranchChange?.(defaultBranch);
      }
    } catch (err) {
      console.error('Error deleting branch:', err);
      alert('Error al eliminar la rama');
    } finally {
      setDeleting(null);
    }
  };

  const handleSelectBranch = (branchName: string) => {
    setSelectedBranch(branchName);
    onBranchChange?.(branchName);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <GitBranch className="h-4 w-4" />
        <span>Cargando ramas...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Ramas ({branches.length})
          </CardTitle>

          {isAuthenticated && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <Plus className="h-3 w-3" />
                  Nueva
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear nueva rama</DialogTitle>
                  <DialogDescription>
                    Crea una nueva rama a partir de una rama existente.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre de la rama</label>
                    <input
                      type="text"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="feature/mi-nueva-rama"
                      className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Crear desde</label>
                    <select
                      value={fromBranch}
                      onChange={(e) => setFromBranch(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm bg-background"
                    >
                      {branches.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name} {b.isDefault && '(default)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {createError && (
                    <p className="text-sm text-destructive">{createError}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    disabled={creating}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateBranch} disabled={creating}>
                    {creating ? 'Creando...' : 'Crear rama'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-1">
          {branches.map((branch) => (
            <div
              key={branch.name}
              className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                selectedBranch === branch.name
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted'
              }`}
              onClick={() => handleSelectBranch(branch.name)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {selectedBranch === branch.name && (
                  <Check className="h-3 w-3 text-primary flex-shrink-0" />
                )}
                <span className="text-sm truncate">{branch.name}</span>
                {branch.isDefault && (
                  <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded flex-shrink-0">
                    default
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <code className="text-xs text-muted-foreground font-mono">
                  {branch.commitSha?.substring(0, 7)}
                </code>

                {isAuthenticated && !branch.isDefault && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar rama</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Estás seguro de que deseas eliminar la rama <strong>{branch.name}</strong>?
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteBranch(branch.name)}
                          disabled={deleting === branch.name}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleting === branch.name ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}

          {branches.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay ramas en este repositorio.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
