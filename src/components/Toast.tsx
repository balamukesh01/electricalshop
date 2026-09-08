import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react';

type ToastKind = 'success' | 'warn' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface ToastCtx {
  push: (kind: ToastKind, title: string, message?: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useToast must be used within ToastProvider');
  return c;
}

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  warn: AlertTriangle,
  error: XCircle,
  info: Info,
};

const ACCENT: Record<ToastKind, string> = {
  success: 'border-l-emerald-500 bg-emerald-50',
  warn: 'border-l-amber-500 bg-amber-50',
  error: 'border-l-red-500 bg-red-50',
  info: 'border-l-navy-500 bg-navy-50',
};

const ICON_COLOR: Record<ToastKind, string> = {
  success: 'text-emerald-600',
  warn: 'text-amber-600',
  error: 'text-red-600',
  info: 'text-navy-600',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, kind, title, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 ${ACCENT[t.kind]} shadow-lg shadow-navy-900/10 p-3.5 animate-slide-in`}
            >
              <Icon size={20} className={`mt-0.5 shrink-0 ${ICON_COLOR[t.kind]}`} strokeWidth={2.2} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-900">{t.title}</p>
                {t.message && <p className="text-xs text-navy-600 mt-0.5">{t.message}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 text-navy-400 hover:text-navy-700 transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
