import PropTypes from 'prop-types';
import { Check, X, Loader2 } from 'lucide-react';

const baseButton =
  'inline-flex h-12 w-full items-center justify-between gap-3 rounded-lg px-5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50';

function ActionButton({ label, busyLabel, icon: Icon, busy, disabled, onClick, className }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${baseButton} ${className}`}>
      {busy ? busyLabel : label}
      {busy ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  busyLabel: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  busy: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default function ManagerActionSection({
  comment,
  onCommentChange,
  onDecision,
  submitting = null, // null | 'approved' | 'rejected'
  disabled = false,
  validationError = '',
}) {
  const locked = submitting !== null || disabled;

  return (
    <section
      aria-label="Decisão do gestor"
      className="grid gap-x-5 gap-y-1.5 border-t border-slate-200 pt-6 lg:grid-cols-[minmax(0,1fr)_15rem]"
    >
      <label htmlFor="manager-comment" className="text-sm font-medium text-slate-700">
        Comentários
      </label>

      {/* No desktop: 108px = 2 botões de 48px (h-12) + 12px de espaço (gap-3) */}
      <textarea
        id="manager-comment"
        rows={4}
        maxLength={500}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        disabled={locked}
        placeholder="Observações a serem consideradas (opcional)."
        aria-invalid={Boolean(validationError)}
        aria-describedby={validationError ? 'comment-error' : undefined}
        className={`block w-full resize-y rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 lg:col-start-1 lg:row-start-2 lg:h-[108px] lg:resize-none ${
          validationError
            ? 'border-red-400 focus:ring-red-200'
            : 'border-slate-300 focus:border-slate-500 focus:ring-slate-200'
        }`}
      />

      <div className="flex justify-between gap-3 text-xs lg:col-start-1 lg:row-start-3">
        <p id="comment-error" className="text-red-600">
          {validationError}
        </p>
        <span className="ml-auto text-slate-400 tabular-nums">{comment.length}/500</span>
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:col-start-2 lg:row-start-2 lg:mt-0">
        <ActionButton
          label="Aprovar"
          busyLabel="Aprovando…"
          icon={Check}
          busy={submitting === 'approved'}
          disabled={locked}
          onClick={() => onDecision('approved')}
          className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-300"
        />
        <ActionButton
          label="Reprovar"
          busyLabel="Reprovando…"
          icon={X}
          busy={submitting === 'rejected'}
          disabled={locked}
          onClick={() => onDecision('rejected')}
          className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-300"
        />
      </div>
    </section>
  );
}

ManagerActionSection.propTypes = {
  comment: PropTypes.string.isRequired,
  onCommentChange: PropTypes.func.isRequired,
  onDecision: PropTypes.func.isRequired,
  submitting: PropTypes.oneOf([null, 'approved', 'rejected']),
  disabled: PropTypes.bool,
  validationError: PropTypes.string,
};
