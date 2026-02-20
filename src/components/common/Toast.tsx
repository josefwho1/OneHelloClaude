import { useAppState } from '../../hooks/useAppState';
import { X } from 'lucide-react';

export function Toast() {
  const { state, hideToast } = useAppState();

  if (!state.toast) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-toast">
      <div className="bg-text text-white rounded-2xl px-5 py-4 shadow-lg flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{state.toast.message}</span>
        <div className="flex items-center gap-2 shrink-0">
          {state.toast.action && (
            <button
              onClick={() => {
                state.toast?.action?.onClick();
                hideToast();
              }}
              className="text-primary-light font-semibold text-sm hover:text-primary whitespace-nowrap"
            >
              {state.toast.action.label}
            </button>
          )}
          <button onClick={hideToast} className="text-white/60 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
