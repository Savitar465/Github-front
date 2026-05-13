"use client";

import { useState } from "react";
import Link from "next/link";
import { UserMinus, AlertTriangle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addTeamMember, removeTeamMember, NotOrgMemberError } from "@/lib/services/teams";
import type { TeamMemberDTO } from "@/types/team";

type TeamMembersTabProps = {
  orgName: string;
  teamId: string;
  initialMembers: TeamMemberDTO[];
};

type NotOrgMemberWarning = {
  username: string;
  orgName: string;
};

export function TeamMembersTab({ orgName, teamId, initialMembers }: TeamMembersTabProps) {
  const [members, setMembers] = useState<TeamMemberDTO[]>(initialMembers);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [notOrgMemberWarning, setNotOrgMemberWarning] = useState<NotOrgMemberWarning | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setNotOrgMemberWarning(null);
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
      if (err instanceof NotOrgMemberError) {
        setNotOrgMemberWarning({ username: err.username, orgName: err.orgName });
      } else {
        setError(err instanceof Error ? err.message : "Error al agregar miembro");
      }
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

      {notOrgMemberWarning && (
        <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Usuario no es miembro de la organización
          </AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <p className="mb-3">
              El usuario <strong>&quot;{notOrgMemberWarning.username}&quot;</strong> no es miembro de la organización{" "}
              <strong>&quot;{notOrgMemberWarning.orgName}&quot;</strong>. Primero debe agregarlo como miembro de la organización.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30">
                <Link href={`/orgs/${notOrgMemberWarning.orgName}/members`}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar a la organización
                </Link>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setNotOrgMemberWarning(null)}
                className="text-amber-600 hover:text-amber-700"
              >
                Cerrar
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
