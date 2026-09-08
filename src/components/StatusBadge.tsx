import { Check, AlertTriangle, XCircle } from 'lucide-react';
import { StockStatus } from '@/types';

interface Props {
  status: StockStatus;
  size?: 'sm' | 'md';
}

const CONFIG: Record<StockStatus, { label: string; classes: string; Icon: typeof Check }> = {
  available: {
    label: 'Available',
    classes: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
    Icon: Check,
  },
  low: {
    label: 'Low Stock',
    classes: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    Icon: AlertTriangle,
  },
  out: {
    label: 'Out of Stock',
    classes: 'bg-red-100 text-red-800 ring-red-600/20',
    Icon: XCircle,
  },
};

export function StatusBadge({ status, size = 'md' }: Props) {
  const { label, classes, Icon } = CONFIG[status];
  const sizing = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  const iconSize = size === 'sm' ? 12 : 14;
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ring-inset ${classes} ${sizing}`}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {label}
    </span>
  );
}
