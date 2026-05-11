"use client";
import Link from 'next/link';
import React from 'react';
import type { UserDTO } from '@/lib/api/users-api';

export function UserList({ users }: { users: UserDTO[] }) {
  if (!users || users.length === 0) return <div className="text-sm text-muted-foreground">No users</div>;
  return (
    <div className="space-y-2">
      {users.map((u) => (
        <div key={u.usuarioKyId} className="p-3 border rounded-md flex items-center justify-between">
          <div>
            <div className="font-medium">{u.fullName ?? u.username}</div>
            <div className="text-xs text-muted-foreground">{u.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/users/${u.usuarioKyId}`} className="text-sm text-primary">Ver</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;
