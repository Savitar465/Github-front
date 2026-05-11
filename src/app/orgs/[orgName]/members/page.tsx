import type { Metadata } from "next";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { getOrgMembers } from "@/lib/services/org-members";
import { MembersManager } from "./_components/members-manager";

type Props = {
  params: Promise<{ orgName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgName } = await params;
  return {
    title: buildPageTitle(`Colaboradores · ${orgName}`),
    description: `Gestiona los colaboradores de la organización ${orgName}.`,
  };
}

export default async function OrgMembersPage({ params }: Props) {
  const { orgName } = await params;

  let members = [];
  let fetchError: string | null = null;

  try {
    members = await getOrgMembers(orgName);
  } catch {
    fetchError = "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
  }

  return (
    <PageContainer
      title="Colaboradores"
      description={`Gestiona quién tiene acceso a ${orgName} y con qué permisos.`}
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <MembersManager orgName={orgName} initialMembers={members} />
      )}
    </PageContainer>
  );
}
