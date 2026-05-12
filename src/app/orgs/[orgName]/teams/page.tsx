'use client';

import { useEffect, useState, useCallback, use } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { getOrgTeams } from "@/lib/services/teams";
import { TeamsManager } from "./_components/teams-manager";
import type { TeamDTO } from '@/types/team';
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ orgName: string }>;
};

export default function OrgTeamsPage({ params }: Props) {
  const { orgName } = use(params);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getOrgTeams(orgName);
      setTeams(data);
    } catch (err) {
      console.error("[TeamsPage] Error:", err);
      setFetchError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [orgName]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      setFetchError("Debes iniciar sesión para ver los equipos.");
      return;
    }

    loadTeams();
  }, [authLoading, isAuthenticated, loadTeams]);

  if (authLoading || loading) {
    return (
      <PageContainer
        title="Equipos"
        description={`Organiza el acceso a los repositorios de ${orgName} mediante equipos.`}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Equipos"
      description={`Organiza el acceso a los repositorios de ${orgName} mediante equipos.`}
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <TeamsManager orgName={orgName} initialTeams={teams} />
      )}
    </PageContainer>
  );
}
