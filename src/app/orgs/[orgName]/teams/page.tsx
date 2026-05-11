import type { Metadata } from "next";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { getOrgTeams } from "@/lib/services/teams";
import { TeamsManager } from "./_components/teams-manager";

type Props = {
  params: Promise<{ orgName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgName } = await params;
  return {
    title: buildPageTitle(`Equipos · ${orgName}`),
    description: `Gestiona los equipos de la organización ${orgName}.`,
  };
}

export default async function OrgTeamsPage({ params }: Props) {
  const { orgName } = await params;

  let teams = [];
  let fetchError: string | null = null;

  try {
    teams = await getOrgTeams(orgName);
  } catch {
    fetchError = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
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
