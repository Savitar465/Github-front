import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/common/empty-state";
import { PageContainer } from "@/components/common/page-container";
import { buildPageTitle } from "@/lib/build-page-title";
import { DashboardHeader } from "./_components/dashboard-header";
import { MetricCard } from "./_components/metric-card";
import { getDashboardSummary } from "@/lib/services/dashboard-summary";

export const metadata: Metadata = {
  title: buildPageTitle("Dashboard"),
  description: "Ruta de ejemplo para una feature real en App Router.",
};

export default async function DashboardPage() {
  const metrics = await getDashboardSummary();

  return (
    <PageContainer
      title="Dashboard"
      description="Ejemplo de feature con componentes y utilidades aisladas por modulo."
    >
      <DashboardHeader subtitle="Datos mock para demostrar estructura por features." />

      {metrics.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="Sin metricas"
          message="Cuando conectes tu API, muestra aqui el resumen de negocio."
        />
      )}

      <div>
        <Link
          href="/"
          className="inline-flex rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Volver al inicio
        </Link>
      </div>
    </PageContainer>
  );
}

