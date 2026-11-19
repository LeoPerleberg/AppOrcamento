export function formatMoney(value: number): string {
  const [int, dec] = Math.abs(value).toFixed(2).split('.');
  const withThousands = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}R$ ${withThousands},${dec}`;
}

export function formatNumber(value: number): string {
  return String(Number(value.toFixed(4))).replace('.', ',');
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

/** Aceita "1,5", "1.5" e "1.000,50". Retorna 0 para valores inválidos. */
export function parseNumber(text: string): number {
  let t = text.trim().replace(/\s/g, '');
  if (t.includes(',')) {
    t = t.replace(/\./g, '').replace(',', '.');
  }
  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
