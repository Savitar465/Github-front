import type { Metadata } from "next";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { getMyOrganizations } from "@/lib/services/organizations";
import { OrgsManager } from "./_components/orgs-manager";

export const metadata: Metadata = {
  title: buildPageTitle("Organizaciones"),
  description: "Gestiona tus organizaciones.",
};

export default async function OrgsPage() {
  let orgs = [];
  let fetchError: string | null = null;

  try {
    orgs = await getMyOrganizations();
  } catch {
    fetchError = "No se pudo conectar con el servidor.";
  }

  return (
    <PageContainer
      title="Organizaciones"
      description="Tus organizaciones y sus equipos y colaboradores."
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <OrgsManager initialOrgs={orgs} />
      )}
    </PageContainer>
  );
}
