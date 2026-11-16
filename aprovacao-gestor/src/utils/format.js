const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const numberFormatter = new Intl.NumberFormat('pt-BR');

export const formatCurrency = (value) =>
  value == null ? '—' : currencyFormatter.format(value);

export const formatNumber = (value) =>
  value == null ? '—' : numberFormatter.format(value);

/** Aceita 'YYYY-MM-DD' ou ISO completo. Evita o deslocamento de fuso em datas puras. */
export function formatDate(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
