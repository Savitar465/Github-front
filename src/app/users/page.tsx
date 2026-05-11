'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/api/users';
import type { UserResponse, UserRequest } from '@/lib/api/users';
import { useAuth } from '@/lib/auth';
import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '@/components/ui/alert-dialog';
import { Users, Plus, Pencil, Trash2, Loader2, Search, Eye } from 'lucide-react';

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Modal de crear/editar
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<UserRequest>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  // Modal de eliminar
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal de ver detalle
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserResponse | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await usersApi.getListUsers({
        page,
        pageSize,
      });

      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Error al cargar usuarios. Verifica que el servicio esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadUsers();
    }
  }, [page, isAuthenticated, authLoading]);

  // Buscar usuarios
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const response = await usersApi.searchUsers({
        searchRequest: {
          filters: [
            {
              key: 'username',
              operator: 'LIKE',
              fieldType: 'STRING',
              value: searchTerm,
            },
          ],
          page: 0,
          size: pageSize,
        },
      });

      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Error al buscar usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Ver detalle de usuario
  const handleView = async (userId: string) => {
    setLoadingUser(true);
    setViewDialogOpen(true);

    try {
      const user = await usersApi.getUser({ userId });
      setViewingUser(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Error al cargar detalle del usuario');
      setViewDialogOpen(false);
    } finally {
      setLoadingUser(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
    setDialogOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (user: UserResponse) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '',
    });
    setDialogOpen(true);
  };

  // Guardar usuario (crear o editar)
  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        await usersApi.editUser({
          userId: editingUser.userId,
          userRequest: formData,
        });
      } else {
        await usersApi.createUser({
          userRequest: formData,
        });
      }

      setDialogOpen(false);
      loadUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  // Confirmar eliminación
  const handleDeleteConfirm = (user: UserResponse) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Eliminar usuario
  const handleDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      await usersApi.deleteUser({
        userId: userToDelete.userId,
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error al eliminar usuario');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
          <p className="text-muted-foreground mb-4">
            Debes iniciar sesión para gestionar usuarios.
          </p>
          <Button onClick={() => router.push('/login')}>
            Iniciar sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Buscar por username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">
            {error}
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Creado</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.createdDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleView(user.userId)}
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(user)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => handleDeleteConfirm(user)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>

      {/* Dialog crear/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? 'Modifica los datos del usuario.'
                : 'Completa los datos para crear un nuevo usuario.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña {editingUser && '(dejar vacío para no cambiar)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario{' '}
              <strong>{userToDelete?.username}</strong>. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
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

      {/* Dialog ver detalle */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de Usuario</DialogTitle>
            <DialogDescription>
              Información completa del usuario.
            </DialogDescription>
          </DialogHeader>

          {loadingUser ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : viewingUser ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-medium">
                  {viewingUser.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewingUser.firstName} {viewingUser.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">@{viewingUser.username}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <p className="font-mono text-xs">{viewingUser.userId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p>{viewingUser.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Creado por:</span>
                  <p>{viewingUser.createdByUser}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha creación:</span>
                  <p>{viewingUser.createdDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Modificado por:</span>
                  <p>{viewingUser.modifiedByUser}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Última modificación:</span>
                  <p>{viewingUser.modifiedDate}</p>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Cerrar
            </Button>
            {viewingUser && (
              <Button onClick={() => {
                setViewDialogOpen(false);
                handleEdit(viewingUser);
              }}>
                Editar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
