import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';

/** Variação do preço unitário em relação ao último preço pago. */
function PriceVariation({ unitPrice, lastPrice, center = false }) {
  if (lastPrice == null || lastPrice === 0 || unitPrice === lastPrice) return null;

  const pct = ((unitPrice - lastPrice) / lastPrice) * 100;
  const isUp = pct > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;

  return (
    <span
      className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${center ? 'justify-center' : ''} ${
        isUp ? 'text-red-600' : 'text-emerald-600'
      }`}
      title={isUp ? 'Acima do último preço' : 'Abaixo do último preço'}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {isUp ? '+' : ''}
      {pct.toFixed(1).replace('.', ',')}%
    </span>
  );
}

PriceVariation.propTypes = {
  unitPrice: PropTypes.number.isRequired,
  lastPrice: PropTypes.number,
  center: PropTypes.bool,
};

const COLUMNS = [
  { label: 'Produto', className: 'text-left' },
  { label: 'Quantidade' },
  { label: 'Preço unitário' },
  { label: 'Preço total' },
  { label: 'Último preço' },
  { label: 'Data da última compra' },
  { label: 'Qtd. em estoque' },
  { label: 'Média de venda dos últimos 3 meses', className: 'min-w-40' },
];

const cell = 'border-b border-r border-slate-200 px-3 py-3 text-center tabular-nums last:border-r-0';

function Stat({ label, children }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium tabular-nums text-slate-900">{children}</dd>
    </div>
  );
}

Stat.propTypes = { label: PropTypes.string.isRequired, children: PropTypes.node };

export default function OrderItemsTable({ items }) {
  const orderTotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <section aria-label="Itens do pedido">
      {/* Telas grandes: tabela com cabeçalho fixo e rolagem interna */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-300 lg:block">
        <div className="max-h-[28rem] overflow-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="sticky top-0 z-10 bg-slate-100">
              <tr>
                {COLUMNS.map(({ label, className = '' }) => (
                  <th
                    key={label}
                    scope="col"
                    className={`border-b border-r border-slate-300 px-3 py-3 text-center font-semibold text-slate-700 last:border-r-0 ${className}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="[&>tr:last-child>*]:border-b-0">
              {items.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50">
                  <th scope="row" className={`${cell} text-left font-medium text-slate-900`}>
                    {item.product}
                  </th>
                  <td className={cell}>{formatNumber(item.quantity)}</td>
                  <td className={cell}>
                    {formatCurrency(item.unitPrice)}
                    <PriceVariation unitPrice={item.unitPrice} lastPrice={item.lastPrice} center />
                  </td>
                  <td className={`${cell} font-semibold text-slate-900`}>
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                  <td className={`${cell} text-slate-600`}>{formatCurrency(item.lastPrice)}</td>
                  <td className={`${cell} text-slate-600`}>{formatDate(item.lastPurchaseDate)}</td>
                  <td className={cell}>{formatNumber(item.stockQuantity)}</td>
                  <td className={cell}>{formatNumber(item.avgSales3Months)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-300 bg-slate-100 px-5 py-3">
          <span className="text-sm font-medium text-slate-600">Total do pedido</span>
          <span className="text-lg font-semibold tabular-nums text-slate-900">{formatCurrency(orderTotal)}</span>
        </div>
      </div>

      {/* Tablet e celular: um cartão por item */}
      <div className="lg:hidden">
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-slate-300 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-snug text-slate-900">{item.product}</h3>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-slate-500">Preço total</p>
                  <p className="font-semibold tabular-nums text-slate-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-200 pt-4">
                <Stat label="Quantidade">{formatNumber(item.quantity)}</Stat>
                <Stat label="Preço unitário">
                  {formatCurrency(item.unitPrice)}
                  <PriceVariation unitPrice={item.unitPrice} lastPrice={item.lastPrice} />
                </Stat>
                <Stat label="Último preço">{formatCurrency(item.lastPrice)}</Stat>
                <Stat label="Data da última compra">{formatDate(item.lastPurchaseDate)}</Stat>
                <Stat label="Qtd. em estoque">{formatNumber(item.stockQuantity)}</Stat>
                <Stat label="Média de venda (3 meses)">{formatNumber(item.avgSales3Months)}</Stat>
              </dl>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
          <span className="text-sm font-medium text-slate-600">Total do pedido</span>
          <span className="text-lg font-semibold tabular-nums text-slate-900">{formatCurrency(orderTotal)}</span>
        </div>
      </div>
    </section>
  );
}

OrderItemsTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      product: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      unitPrice: PropTypes.number.isRequired,
      lastPrice: PropTypes.number,
      lastPurchaseDate: PropTypes.string,
      stockQuantity: PropTypes.number,
      avgSales3Months: PropTypes.number,
    })
  ).isRequired,
};
