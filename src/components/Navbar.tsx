import { Zap, Search, Package, Menu, BarChart3 } from 'lucide-react';
import { Session } from '@/store';

export type View = 'search' | 'inventory' | 'sales';

interface Props {
  view: View;
  setView: (v: View) => void;
  session: Session;
  onOpenMenu: () => void;
}

export function Navbar({ view, setView, session, onOpenMenu }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-navy-900 text-white shadow-lg shadow-navy-900/10">
      <div className="absolute top-0 left-0 right-0 h-1 hazard-stripe" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="grid place-items-center w-9 h-9 rounded-lg bg-amber-400 text-navy-900 shrink-0">
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="font-display font-extrabold tracking-tight leading-none truncate">VoltLoc</p>
            <p className="text-[10px] text-navy-300 leading-none mt-0.5 hidden sm:block">Electrical Shop Locator</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          <NavButton active={view === 'search'} onClick={() => setView('search')} icon={Search} label="Search" />
          <NavButton active={view === 'inventory'} onClick={() => setView('inventory')} icon={Package} label="Inventory" />
          <NavButton active={view === 'sales'} onClick={() => setView('sales')} icon={BarChart3} label="Sales" />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-sm mr-1">
            <div className="grid place-items-center w-8 h-8 rounded-full bg-amber-400 text-navy-900 font-display font-extrabold text-xs">
              {session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-white text-xs">{session.name}</p>
              <p className="text-[10px] text-navy-300 capitalize">{session.role}</p>
            </div>
          </div>
          <button
            onClick={onOpenMenu}
            className="grid place-items-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Open menu"
            title="Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Search;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        active ? 'bg-amber-400 text-navy-900' : 'text-navy-100 hover:bg-white/10'
      }`}
    >
      <Icon size={16} strokeWidth={2.5} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
