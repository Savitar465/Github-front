import type { Metadata } from "next";

import { PageContainer } from "@/components/common/page-container";
import { IssuesNavigator } from "@/app/_components/issues-navigator";
import { buildPageTitle } from "@/lib/build-page-title";

export const metadata: Metadata = {
  title: buildPageTitle("Issues"),
  description: "Navega a los issues de un repositorio.",
};

export default function IssuesIndexPage() {
  return (
    <PageContainer
      title="Issues"
      description="Ingresa la organización y el repositorio para ver sus issues."
    >
      <div className="max-w-sm">
        <IssuesNavigator />
      </div>
    </PageContainer>
  );
}
