type DashboardHeaderProps = {
  subtitle: string;
};

export function DashboardHeader({ subtitle }: DashboardHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        Feature dashboard
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Resumen operativo</h2>
      <p className="text-muted-foreground">{subtitle}</p>
    </header>
  );
}

