import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/common/page-container";
import { OrgNavigator } from "./_components/org-navigator";
import { IssuesNavigator } from "./_components/issues-navigator";

export default function Home() {
  return (
    <PageContainer
      title="github-front"
      description="Mini GitHub — gestión de organizaciones, equipos, colaboradores e issues."
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Organizaciones</CardTitle>
            <CardDescription>
              Accede a los equipos y colaboradores de una organización.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrgNavigator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Issues</CardTitle>
            <CardDescription>
              Gestiona los issues de un repositorio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IssuesNavigator />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard</CardTitle>
            <CardDescription>
              Resumen de métricas del proyecto.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </PageContainer>
  );
}
