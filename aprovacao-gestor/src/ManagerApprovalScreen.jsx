import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

import { fetchOrderDetails, submitApproval } from './services/approvalService';
import OrderInfoHeader from './components/OrderInfoHeader';
import OrderItemsTable from './components/OrderItemsTable';
import ManagerActionSection from './components/ManagerActionSection';

function LoadingSkeleton() {
  return (
    <div role="status" className="animate-pulse space-y-6">
      <span className="sr-only">Carregando pedido…</span>
      <div className="h-12 w-64 rounded-lg bg-slate-200" />
      <div className="flex flex-wrap gap-4">
        <div className="h-10 w-56 rounded-lg bg-slate-100" />
        <div className="h-10 w-72 rounded-lg bg-slate-100" />
      </div>
      <div className="h-72 rounded-xl bg-slate-100" />
      <div className="h-36 rounded-xl bg-slate-100" />
    </div>
  );
}

function Banner({ tone, icon: Icon, children }) {
  const tones = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    danger: 'border-red-200 bg-red-50 text-red-800',
  };
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${tones[tone]}`}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {children}
    </div>
  );
}

Banner.propTypes = {
  tone: PropTypes.oneOf(['success', 'danger']).isRequired,
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

export default function ManagerApprovalScreen({ orderId = '00001405' }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(null); // null | 'approved' | 'rejected'
  const [submitError, setSubmitError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [result, setResult] = useState(null); // { status }

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      setOrder(await fetchOrderDetails(orderId));
    } catch (err) {
      setLoadError(err.message || 'Não foi possível carregar o pedido.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCommentChange = (value) => {
    setComment(value);
    if (validationError) setValidationError('');
  };

  const handleDecision = async (status) => {
    setSubmitError('');

    if (status === 'rejected' && !comment.trim()) {
      setValidationError('Escreva a justificativa para reprovar o pedido.');
      return;
    }

    setSubmitting(status);
    try {
      await submitApproval(orderId, { status, comment: comment.trim() });
      setResult({ status });
    } catch (err) {
      setSubmitError(err.message || 'Não foi possível registrar sua decisão. Tente novamente.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <main className="min-h-screen p-3 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-900/5 sm:p-6 lg:p-8">
        {isLoading && <LoadingSkeleton />}

        {!isLoading && loadError && (
          <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
            <p className="max-w-md text-slate-700">{loadError}</p>
            <button
              type="button"
              onClick={loadOrder}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && order && (
          <>
            <OrderInfoHeader orderId={order.id} orderDate={order.orderDate} supplier={order.supplier} />
            <OrderItemsTable items={order.items} />

            {result && (
              <Banner tone={result.status === 'approved' ? 'success' : 'danger'} icon={result.status === 'approved' ? CheckCircle2 : XCircle}>
                {result.status === 'approved' ? 'Pedido aprovado com sucesso.' : 'Pedido reprovado.'}
              </Banner>
            )}

            {submitError && <Banner tone="danger" icon={AlertTriangle}>{submitError}</Banner>}

            <ManagerActionSection
              comment={comment}
              onCommentChange={handleCommentChange}
              onDecision={handleDecision}
              submitting={submitting}
              disabled={Boolean(result)}
              validationError={validationError}
            />
          </>
        )}
      </div>
    </main>
  );
}

ManagerApprovalScreen.propTypes = {
  orderId: PropTypes.string,
};
