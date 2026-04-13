import type { DashboardMetric } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardMetric[]> {
  return [
    { label: "Proyectos activos", value: 6 },
    { label: "Tickets abiertos", value: 14 },
    { label: "Deploys esta semana", value: 9 },
  ];
}

