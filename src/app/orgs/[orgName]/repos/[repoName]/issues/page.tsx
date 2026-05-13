import type { Metadata } from "next";
import { cookies } from "next/headers";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { listIssues } from "@/lib/services/issues";
import type { IssueDTO } from "@/types/issue";
import { IssuesManager } from "./_components/issues-manager";

type Props = {
  params: Promise<{ orgName: string; repoName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgName, repoName } = await params;
  return {
    title: buildPageTitle(`Issues · ${orgName}/${repoName}`),
    description: `Issues del repositorio ${orgName}/${repoName}.`,
  };
}

export default async function IssuesPage({ params }: Props) {
  const { orgName, repoName } = await params;

  // Leer token desde cookies del servidor
  const cookieStore = await cookies();
  const token = cookieStore.get("github_clone_token")?.value;

  let initialIssues: IssueDTO[] = [];
  let fetchError: string | null = null;

  try {
    const data = await listIssues(orgName, repoName, undefined, token);
    initialIssues = data.issues;
  } catch {
    fetchError = "No se pudo conectar con el servidor de issues. Verifica que el backend esté corriendo en el puerto 8091.";
  }

  return (
    <PageContainer
      title={`${orgName}/${repoName}`}
      description="Issues del repositorio"
    >
      {fetchError ? (
        <EmptyState title="Error al cargar" message={fetchError} />
      ) : (
        <IssuesManager
          orgName={orgName}
          repoName={repoName}
          initialIssues={initialIssues}
        />
      )}
    </PageContainer>
  );
}
