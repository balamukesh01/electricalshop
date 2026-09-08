import { useMemo, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  IndianRupee,
  Package,
  Building2,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Calendar,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { SaleRecord, Category } from '@/types';
import { useToast } from '@/components/Toast';
import { categoryIcon } from '@/components/categoryIcon';

interface Props {
  sales: SaleRecord[];
  onReset: () => void;
  onClear: () => void;
}

type GroupMode = 'company' | 'product';

export function Sales({ sales, onReset, onClear }: Props) {
  const [mode, setMode] = useState<GroupMode>('company');
  const [expanded, setExpanded] = useState<string | null>(null);
  const { push } = useToast();

  const totals = useMemo(() => {
    const revenue = sales.reduce((sum, s) => sum + s.price * s.quantity, 0);
    const units = sales.reduce((sum, s) => sum + s.quantity, 0);
    const txns = sales.length;
    const avg = txns > 0 ? revenue / txns : 0;
    return { revenue, units, txns, avg };
  }, [sales]);

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; sub?: string; category?: Category; records: SaleRecord[]; revenue: number; units: number }>();
    for (const s of sales) {
      const key = mode === 'company' ? s.company : s.productId;
      const label = mode === 'company' ? s.company : s.productName;
      const sub = mode === 'company' ? undefined : s.company;
      const category = mode === 'product' ? s.category : undefined;
      const g = map.get(key);
      if (g) {
        g.records.push(s);
        g.revenue += s.price * s.quantity;
        g.units += s.quantity;
      } else {
        map.set(key, { label, sub, category, records: [s], revenue: s.price * s.quantity, units: s.quantity });
      }
    }
    return Array.from(map.entries())
      .map(([key, val]) => ({ key, ...val }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [sales, mode]);

  const maxRevenue = Math.max(1, ...groups.map((g) => g.revenue));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Sales Track</h1>
          <p className="text-sm text-navy-500 mt-0.5">Sales history grouped by company and product</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { onClear(); push('info', 'Sales cleared', 'All sale records removed.'); }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 bg-white ring-1 ring-navy-200 hover:ring-navy-300 px-3 py-2 rounded-lg transition"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={() => { onReset(); push('info', 'Sales reset', 'Sample sales data restored.'); }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 bg-white ring-1 ring-navy-200 hover:ring-navy-300 px-3 py-2 rounded-lg transition"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${totals.revenue.toLocaleString('en-IN')}`} accent="navy" />
        <StatCard icon={ShoppingBag} label="Units Sold" value={String(totals.units)} accent="amber" />
        <StatCard icon={TrendingUp} label="Transactions" value={String(totals.txns)} accent="navy" />
        <StatCard icon={BarChart3} label="Avg / Sale" value={`₹${Math.round(totals.avg).toLocaleString('en-IN')}`} accent="amber" />
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <ModeButton active={mode === 'company'} onClick={() => { setMode('company'); setExpanded(null); }} icon={Building2} label="By Company" />
        <ModeButton active={mode === 'product'} onClick={() => { setMode('product'); setExpanded(null); }} icon={Package} label="By Product" />
      </div>

      {/* Groups */}
      <div className="space-y-2.5">
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-navy-100 p-10 text-center">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-navy-50 text-navy-400 mx-auto mb-3">
              <BarChart3 size={26} />
            </div>
            <p className="font-display font-bold text-navy-900">No sales recorded yet</p>
            <p className="text-sm text-navy-500 mt-1">Use "Give Item" on a product to record a sale.</p>
          </div>
        ) : (
          groups.map((g) => {
            const isOpen = expanded === g.key;
            const pct = Math.round((g.revenue / maxRevenue) * 100);
            const GroupIcon = mode === 'product' && g.category ? categoryIcon(g.category) : Building2;
            return (
              <div key={g.key} className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm overflow-hidden animate-fade-in">
                <button
                  onClick={() => setExpanded(isOpen ? null : g.key)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-navy-50/50 transition-colors text-left"
                >
                  <div className="grid place-items-center w-10 h-10 rounded-xl bg-navy-50 text-navy-600 shrink-0">
                    <GroupIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-display font-bold text-navy-900 truncate">{g.label}</p>
                      {g.sub && <span className="text-xs text-navy-400 shrink-0">· {g.sub}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-navy-500 mt-0.5">
                      <span>{g.records.length} txn{g.records.length === 1 ? '' : 's'}</span>
                      <span>·</span>
                      <span>{g.units} units</span>
                    </div>
                    {/* Revenue bar */}
                    <div className="mt-2 h-1.5 rounded-full bg-navy-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-extrabold text-navy-900 text-sm">
                      ₹{g.revenue.toLocaleString('en-IN')}
                    </p>
                    {isOpen ? <ChevronDown size={16} className="text-navy-400 ml-auto mt-1" /> : <ChevronRight size={16} className="text-navy-400 ml-auto mt-1" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-navy-100 divide-y divide-navy-50 animate-scale-in">
                    {g.records.map((s) => (
                      <SaleRow key={s.id} sale={s} />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SaleRow({ sale }: { sale: SaleRecord }) {
  const Icon = categoryIcon(sale.category);
  const date = new Date(sale.timestamp);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="grid place-items-center w-8 h-8 rounded-lg bg-navy-50 text-navy-500 shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-800 truncate">{sale.productName}</p>
        <div className="flex items-center gap-2 text-[11px] text-navy-400 mt-0.5">
          <span className="inline-flex items-center gap-0.5">
            <Calendar size={11} />
            {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
          </span>
          <span>·</span>
          <span>Qty {sale.quantity}</span>
          <span>·</span>
          <span>₹{sale.price}/unit</span>
        </div>
      </div>
      <p className="font-display font-bold text-navy-900 text-sm shrink-0">
        ₹{(sale.price * sale.quantity).toLocaleString('en-IN')}
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
  accent: 'navy' | 'amber';
}) {
  const bg = accent === 'navy' ? 'bg-navy-900 text-white' : 'bg-amber-400 text-navy-900';
  return (
    <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm p-4 flex items-center gap-3">
      <div className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${bg}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg font-extrabold text-navy-900 leading-none truncate">{value}</p>
        <p className="text-[11px] text-navy-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Building2;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
        active ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 ring-1 ring-navy-200 hover:ring-navy-300'
      }`}
    >
      <Icon size={15} strokeWidth={2.5} />
      {label}
    </button>
  );
}
