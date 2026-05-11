"use client";
import React, { useEffect, useState } from 'react';
import { listUsers, type UserDTO } from '@/lib/api/users-api';
import UserList from '@/components/users/user-list';
import { useAuth } from '@/lib/auth';

export default function UsersPage() {
  const { token, isLoading } = useAuth();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await listUsers(1, 50, token);
        if (!cancelled) setUsers(res.usuarios || []);
      } catch {
        // ignore, listUsers already falls back to mock
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (!isLoading) load();
    return () => { cancelled = true; };
  }, [token, isLoading]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Usuarios</h1>
      {loading ? <div className="text-sm text-muted-foreground">Cargando...</div> : <UserList users={users} />}
    </div>
  );
}
