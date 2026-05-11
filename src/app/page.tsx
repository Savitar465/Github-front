import Link from "next/link";
import { GitBranch, FileCode, History, Shield, Zap, Cloud } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileCode,
    title: "Explorador de Archivos",
    description: "Navega por la estructura de tu repositorio con un explorador intuitivo y syntax highlighting.",
  },
  {
    icon: History,
    title: "Historial de Commits",
    description: "Visualiza el historial completo de cambios con diffs detallados y navegación temporal.",
  },
  {
    icon: GitBranch,
    title: "Comparación de Branches",
    description: "Compara diferentes ramas y visualiza los cambios antes de hacer merge.",
  },
  {
    icon: Shield,
    title: "Autenticación Segura",
    description: "Sistema de autenticación con JWT y soporte para OAuth2/Keycloak.",
  },
  {
    icon: Zap,
    title: "Alto Rendimiento",
    description: "Construido con Next.js 16 y React 19 para máxima velocidad y SEO.",
  },
  {
    icon: Cloud,
    title: "Arquitectura Cloud",
    description: "Diseñado para microservicios con API REST generada desde Smithy.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground shadow-lg">
              <GithubIcon className="h-8 w-8 text-background" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                GitHubX
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Plataforma de gestión de repositorios construida con arquitectura de microservicios.
              Proyecto para Arquitectura en la Nube y Microservicios.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/repos">
                  <FileCode className="h-5 w-5" />
                  Explorar Repositorios
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/login">
                  Iniciar Sesión
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Características</h2>
          <p className="mt-2 text-muted-foreground">
            Todo lo que necesitas para gestionar tus repositorios de código
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="group hover:border-foreground/20 transition-colors">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-foreground/10 transition-colors">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Arquitectura del Sistema</h2>
              <p className="mt-4 text-muted-foreground">
                Sistema completo de microservicios diseñado siguiendo las mejores prácticas
                de arquitectura cloud-native.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  { title: "Frontend", desc: "Next.js 16 + React 19 + TypeScript" },
                  { title: "Backend", desc: "Java 21 + Spring Boot 3 + PostgreSQL" },
                  { title: "API Definition", desc: "Smithy 2.0 con generación OpenAPI" },
                  { title: "Autenticación", desc: "OAuth2 + JWT con Keycloak" },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <span className="font-medium">{item.title}:</span>{" "}
                      <span className="text-muted-foreground">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="p-6">
              <pre className="text-xs sm:text-sm font-mono text-muted-foreground overflow-x-auto">
{`┌─────────────────────────────────┐
│         Frontend (Next.js)      │
│    ┌─────────────────────┐      │
│    │  Generated TS Client │      │
│    └──────────┬──────────┘      │
└───────────────┼─────────────────┘
                │ HTTP/REST
                ▼
┌─────────────────────────────────┐
│     API Gateway / Keycloak      │
└───────────────┬─────────────────┘
                │
    ┌───────────┼───────────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Files  │ │ Users  │ │ Repos  │
│   MS   │ │   MS   │ │   MS   │
└────────┘ └────────┘ └────────┘
    │           │           │
    └───────────┴───────────┘
                │
        ┌───────┴───────┐
        │  PostgreSQL   │
        └───────────────┘`}
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            ¿Listo para comenzar?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Explora los repositorios o inicia sesión para acceder a todas las funcionalidades.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/repos">Ver Repositorios</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/davichox/github-files-ms">Repo de Ejemplo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer removed per UI request */}
    </div>
  );
}
