"use client";

import { useState } from "react";
import { UserMinus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { addTeamMember, removeTeamMember } from "@/lib/services/teams";
import type { TeamMemberDTO } from "@/types/team";

type TeamMembersTabProps = {
  orgName: string;
  teamId: string;
  initialMembers: TeamMemberDTO[];
};

export function TeamMembersTab({ orgName, teamId, initialMembers }: TeamMembersTabProps) {
  const [members, setMembers] = useState<TeamMemberDTO[]>(initialMembers);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addTeamMember(orgName, teamId, username.trim());
      setMembers((prev) => [
        ...prev,
        {
          userId: crypto.randomUUID(),
          username: username.trim(),
          addedAt: new Date().toISOString(),
        },
      ]);
      setUsername("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar miembro");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(memberUsername: string) {
    setPendingUsername(memberUsername);
    setError(null);
    try {
      await removeTeamMember(orgName, teamId, memberUsername);
      setMembers((prev) => prev.filter((m) => m.username !== memberUsername));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al quitar miembro");
    } finally {
      setPendingUsername(undefined);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="Agregar miembro por username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={loading || !username.trim()}>
          {loading ? "Agregando..." : "Agregar"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {members.length === 0 ? (
        <EmptyState title="Sin miembros" message="Este equipo no tiene miembros todavía." />
      ) : (
        <ul className="divide-y divide-border">
          {members.map((member) => (
            <li key={member.userId} className="flex items-center gap-3 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium uppercase text-muted-foreground">
                {member.username[0]}
              </div>
              <span className="flex-1 text-sm font-medium text-foreground">
                {member.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(member.addedAt).toLocaleDateString("es")}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemove(member.username)}
                disabled={pendingUsername === member.username}
                aria-label={`Quitar a ${member.username}`}
              >
                <UserMinus className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
