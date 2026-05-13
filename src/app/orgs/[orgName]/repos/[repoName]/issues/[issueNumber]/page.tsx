import type { Metadata } from "next";
import { cookies } from "next/headers";

import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { getIssue, listIssueComments } from "@/lib/services/issues";
import type { CommentDTO } from "@/types/issue";
import { IssueDetail } from "./_components/issue-detail";

type Props = {
  params: Promise<{ orgName: string; repoName: string; issueNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgName, repoName, issueNumber } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("github_clone_token")?.value;

  try {
    const issue = await getIssue(orgName, repoName, parseInt(issueNumber, 10), token);
    return { title: buildPageTitle(`#${issueNumber} ${issue.title} · ${orgName}/${repoName}`) };
  } catch {
    return { title: buildPageTitle(`Issue #${issueNumber}`) };
  }
}

export default async function IssueDetailPage({ params }: Props) {
  const { orgName, repoName, issueNumber } = await params;
  const num = parseInt(issueNumber, 10);

  // Leer token desde cookies del servidor
  const cookieStore = await cookies();
  const token = cookieStore.get("github_clone_token")?.value;

  let issue = null;
  let initialComments: CommentDTO[] = [];
  let fetchError: string | null = null;

  try {
    const [issueData, commentsData] = await Promise.all([
      getIssue(orgName, repoName, num, token),
      listIssueComments(orgName, repoName, num, token),
    ]);
    issue = issueData;
    initialComments = commentsData.comments;
  } catch {
    fetchError = "No se pudo cargar el issue.";
  }

  return (
    <PageContainer
      title={issue ? `#${issue.number} ${issue.title}` : `Issue #${issueNumber}`}
      description={`${orgName}/${repoName}`}
    >
      {fetchError || !issue ? (
        <EmptyState title="Error al cargar" message={fetchError ?? "Issue no encontrado."} />
      ) : (
        <IssueDetail
          orgName={orgName}
          repoName={repoName}
          issue={issue}
          initialComments={initialComments}
        />
      )}
    </PageContainer>
  );
}
