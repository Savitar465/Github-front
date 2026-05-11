'use client';

import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Acceso restringido</h1>
        <p className="text-muted-foreground mb-4">
          Debes iniciar sesión para ver tu perfil.
        </p>
        <Button onClick={() => router.push('/login')}>Iniciar sesión</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-medium">
            {user.name[0].toUpperCase()}
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">ID de usuario</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Correo electrónico</p>
              <p className="text-sm">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Nombre de usuario</p>
              <p className="text-sm">{user.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
