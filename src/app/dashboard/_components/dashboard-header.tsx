type DashboardHeaderProps = {
  subtitle: string;
};

export function DashboardHeader({ subtitle }: DashboardHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Feature dashboard
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Resumen operativo
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400">{subtitle}</p>
    </header>
  );
}

