export function formatN(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "М";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.?0+$/, "") + "К";
  return n.toFixed(0);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function monthsToText(m: number): string {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  const parts: string[] = [];
  if (y > 0) parts.push(`${y} ${y === 1 ? "рік" : y < 5 ? "роки" : "років"}`);
  if (mo > 0) parts.push(`${mo} ${mo === 1 ? "місяць" : mo < 5 ? "місяці" : "місяців"}`);
  return parts.join(" і ");
}