'use client';

import { useEffect, useState, useCallback, use } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { getTeam, getTeamMembers, getTeamRepos } from "@/lib/services/teams";
import type { TeamDTO, TeamMemberDTO, TeamRepoDTO } from '@/types/team';
import { TeamDetail } from "./_components/team-detail";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ orgName: string; teamId: string }>;
};

export default function TeamDetailPage({ params }: Props) {
  const { orgName, teamId } = use(params);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [team, setTeam] = useState<TeamDTO | null>(null);
  const [members, setMembers] = useState<TeamMemberDTO[]>([]);
  const [repos, setRepos] = useState<TeamRepoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadTeamData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [teamData, membersData, reposData] = await Promise.all([
        getTeam(orgName, teamId),
        getTeamMembers(orgName, teamId),
        getTeamRepos(orgName, teamId),
      ]);
      setTeam(teamData);
      setMembers(membersData);
      setRepos(reposData);
    } catch (err) {
      console.error("[TeamDetailPage] Error:", err);
      setFetchError("No se pudo cargar el equipo.");
    } finally {
      setLoading(false);
    }
  }, [orgName, teamId]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setFetchError("Debes iniciar sesión para ver el equipo.");
      return;
    }

    loadTeamData();
  }, [authLoading, isAuthenticated, loadTeamData]);

  if (authLoading || loading) {
    return (
      <PageContainer title="Equipo" description="">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={team?.name ?? "Equipo"} description={team?.description}>
      {fetchError || !team ? (
        <EmptyState title="Error al cargar" message={fetchError ?? "Equipo no encontrado."} />
      ) : (
        <TeamDetail
          orgName={orgName}
          team={team}
          initialMembers={members}
          initialRepos={repos}
        />
      )}
    </PageContainer>
  );
}
