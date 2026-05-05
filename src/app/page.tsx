import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/common/page-container";

const quickStart = [
  "Edita src/app/page.tsx para personalizar tu portada.",
  "Crea features en src/app/<feature>/ con _components privados.",
  "Manten componentes globales en src/components y logica compartida en src/lib.",
];

export default function Home() {
  return (
    <PageContainer
      title="Bienvenido a github-front"
      description="Template de inicio con App Router, ruta real /dashboard y estructura por features en src/."
    >
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Frontend base</p>
        <p className="max-w-2xl text-muted-foreground">
          Esta home muestra la base del proyecto con carpetas globales para UI,
          hooks, tipos, utilidades y una feature real para dashboard.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Checklist de inicio</CardTitle>
          <CardDescription>Una base rapida para empezar a construir sobre este template.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
          {quickStart.map((item) => (
            <li key={item} className="list-inside list-disc">
              {item}
            </li>
          ))}
          </ul>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard</CardTitle>
            <CardDescription>
              Ruta real por feature con _components privados y servicios compartidos.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/dashboard">Ir al dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Docs Next.js</CardTitle>
            <CardDescription>Referencia oficial para App Router.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="secondary">
              <a href="https://nextjs.org/docs/app" target="_blank" rel="noopener noreferrer">
                Abrir documentacion
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Documentacion local</CardTitle>
            <CardDescription>
              Revisa `docs/README.md`, `docs/estructura-del-proyecto.md` y
              `docs/contribucion.md` para el onboarding del equipo.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </PageContainer>
  );
}
