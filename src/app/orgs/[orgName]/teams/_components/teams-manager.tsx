"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { createTeam, deleteTeam } from "@/lib/services/teams";
import type { CreateTeamPayload, TeamDTO } from "@/types/team";
import { CreateTeamForm } from "./create-team-form";
import { TeamCard } from "./team-card";

type TeamsManagerProps = {
  orgName: string;
  initialTeams: TeamDTO[];
};

export function TeamsManager({ orgName, initialTeams }: TeamsManagerProps) {
  const [teams, setTeams] = useState<TeamDTO[]>(initialTeams);
  const [showCreate, setShowCreate] = useState(false);
  const [pendingTeamId, setPendingTeamId] = useState<string | undefined>();

  async function handleCreate(payload: CreateTeamPayload) {
    const newTeam = await createTeam(orgName, payload);
    setTeams((prev) => [newTeam, ...prev]);
    setShowCreate(false);
  }

  async function handleDelete(teamId: string) {
    setPendingTeamId(teamId);
    try {
      await deleteTeam(orgName, teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
    } finally {
      setPendingTeamId(undefined);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {teams.length} {teams.length === 1 ? "equipo" : "equipos"}
        </p>
        <Button size="sm" onClick={() => setShowCreate((v) => !v)}>
          <Plus className="size-4" />
          Nuevo equipo
        </Button>
      </div>

      {showCreate && (
        <CreateTeamForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
      )}

      {teams.length === 0 && !showCreate ? (
        <EmptyState
          title="Sin equipos"
          message="Crea el primer equipo para organizar el acceso a los repositorios."
        />
      ) : (
        <ul className="divide-y divide-border">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              orgName={orgName}
              onDelete={handleDelete}
              isPending={pendingTeamId === team.id}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
