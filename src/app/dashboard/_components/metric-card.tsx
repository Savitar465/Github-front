import { formatNumber } from "@/utils/format-number";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type MetricCardProps = Readonly<{
  label: string;
  value: number;
}>;

export function MetricCard({ label, value }: Readonly<MetricCardProps>) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{formatNumber(value)}</CardTitle>
      </CardHeader>
    </Card>
  );
}

