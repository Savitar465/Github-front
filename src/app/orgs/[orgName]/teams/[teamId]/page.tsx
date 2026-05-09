import type { Metadata } from "next";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { getTeam, getTeamMembers, getTeamRepos } from "@/lib/services/teams";
import { TeamDetail } from "./_components/team-detail";

type Props = {
  params: Promise<{ orgName: string; teamId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgName, teamId } = await params;
  try {
    const team = await getTeam(orgName, teamId);
    return { title: buildPageTitle(`${team.name} · ${orgName}`) };
  } catch {
    return { title: buildPageTitle("Equipo") };
  }
}

export default async function TeamDetailPage({ params }: Props) {
  const { orgName, teamId } = await params;

  let team = null;
  let members = [];
  let repos = [];
  let fetchError: string | null = null;

  try {
    [team, members, repos] = await Promise.all([
      getTeam(orgName, teamId),
      getTeamMembers(orgName, teamId),
      getTeamRepos(orgName, teamId),
    ]);
  } catch {
    fetchError = "No se pudo cargar el equipo.";
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
