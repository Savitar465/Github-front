"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollaboratorRole } from "@/types/org-member";

const ROLES: { value: CollaboratorRole; label: string }[] = [
  { value: "developer", label: "Developer" },
  { value: "reporter", label: "Reporter" },
  { value: "owner", label: "Owner" },
];

type InviteFormProps = {
  onInvite: (username: string, role: CollaboratorRole) => Promise<void>;
};

export function InviteForm({ onInvite }: InviteFormProps) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<CollaboratorRole>("developer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onInvite(username.trim(), role);
      setUsername("");
      setRole("developer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al invitar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="invite-username">Usuario o correo</Label>
          <Input
            id="invite-username"
            placeholder="username o email@ejemplo.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="invite-role">Rol</Label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as CollaboratorRole)}
            disabled={loading}
            className="h-9 rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={loading || !username.trim()}>
          {loading ? "Invitando..." : "Invitar"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
