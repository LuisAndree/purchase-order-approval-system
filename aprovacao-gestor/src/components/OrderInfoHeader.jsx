import PropTypes from 'prop-types';
import { CalendarDays, Building2 } from 'lucide-react';
import { formatDate } from '../utils/format';

function Field({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <dt className="text-sm font-medium text-slate-600 sm:w-28 sm:shrink-0 lg:w-auto">{label}</dt>
      <dd className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-900">
        <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        {children}
      </dd>
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

export default function OrderInfoHeader({ orderId, orderDate, supplier }) {
  return (
    <header className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Pedido de compra
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">Pedido N° {orderId}</p>
      </div>

      <dl className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:gap-x-10">
        <Field label="Data do pedido" icon={CalendarDays}>
          {formatDate(orderDate)}
        </Field>
        <Field label="Fornecedor" icon={Building2}>
          {supplier}
        </Field>
      </dl>
    </header>
  );
}

OrderInfoHeader.propTypes = {
  orderId: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  supplier: PropTypes.string.isRequired,
};
