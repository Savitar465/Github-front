"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/common/empty-state";
import { PermissionBadge } from "@/components/common/permission-badge";
import { addTeamRepo, removeTeamRepo } from "@/lib/services/teams";
import type { TeamPermission, TeamRepoDTO } from "@/types/team";

const PERMISSIONS: { value: TeamPermission; label: string }[] = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "admin", label: "Admin" },
];

type TeamReposTabProps = {
  orgName: string;
  teamId: string;
  initialRepos: TeamRepoDTO[];
};

export function TeamReposTab({ orgName, teamId, initialRepos }: TeamReposTabProps) {
  const [repos, setRepos] = useState<TeamRepoDTO[]>(initialRepos);
  const [repoName, setRepoName] = useState("");
  const [permission, setPermission] = useState<TeamPermission>("read");
  const [loading, setLoading] = useState(false);
  const [pendingRepoName, setPendingRepoName] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!repoName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await addTeamRepo(orgName, teamId, repoName.trim(), { permission });
      setRepos((prev) => [
        ...prev,
        {
          repoId: crypto.randomUUID(),
          repoName: repoName.trim(),
          fullName: `${orgName}/${repoName.trim()}`,
          permission,
          assignedAt: new Date().toISOString(),
        },
      ]);
      setRepoName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar repositorio");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(name: string) {
    setPendingRepoName(name);
    setError(null);
    try {
      await removeTeamRepo(orgName, teamId, name);
      setRepos((prev) => prev.filter((r) => r.repoName !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al quitar repositorio");
    } finally {
      setPendingRepoName(undefined);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="repo-name">Nombre del repositorio</Label>
          <Input
            id="repo-name"
            placeholder="nombre-del-repo"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="repo-permission">Permiso</Label>
          <select
            id="repo-permission"
            value={permission}
            onChange={(e) => setPermission(e.target.value as TeamPermission)}
            disabled={loading}
            className="h-9 rounded-3xl border border-transparent bg-input/50 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
          >
            {PERMISSIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="sm" disabled={loading || !repoName.trim()}>
          {loading ? "Asignando..." : "Asignar repo"}
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {repos.length === 0 ? (
        <EmptyState
          title="Sin repositorios"
          message="Este equipo no tiene repositorios asignados todavía."
        />
      ) : (
        <ul className="divide-y divide-border">
          {repos.map((repo) => (
            <li key={repo.repoId} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{repo.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  Asignado {new Date(repo.assignedAt).toLocaleDateString("es")}
                </p>
              </div>
              <PermissionBadge permission={repo.permission} />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleRemove(repo.repoName)}
                disabled={pendingRepoName === repo.repoName}
                aria-label={`Quitar repo ${repo.repoName}`}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
