export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}

