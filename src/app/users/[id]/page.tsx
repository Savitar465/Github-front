"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, type UserDTO } from '@/lib/api/users-api';
import { useAuth } from '@/lib/auth';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { token, isLoading } = useAuth();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const u = await getUser(id, token!);
        if (!cancelled) setUser(u);
      } catch {
        // fallback handled
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (!isLoading) load();
    return () => { cancelled = true; };
  }, [id, token, isLoading]);

  return (
    <div className="p-6">
      <button className="mb-4 text-sm text-muted-foreground" onClick={() => router.back()}>← Volver</button>
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando...</div>
      ) : user ? (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{user.fullName ?? user.username}</h2>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="text-sm">Rol: <span className="font-medium">{user.role}</span></div>
          <div className="text-xs text-muted-foreground">Id: {user.usuarioKyId}</div>
        </div>
      ) : (
        <div className="text-sm text-destructive">Usuario no encontrado</div>
      )}
    </div>
  );
}
