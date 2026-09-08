import { useState } from 'react';
import {
  X,
  UserCircle,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Search,
  Package,
  Zap,
  ShieldCheck,
  Mail,
  Phone,
  BookOpen,
  Bell,
  Moon,
  Sun,
  Globe,
  Database,
  BarChart3,
} from 'lucide-react';
import { Session } from '@/store';
import { View } from '@/components/Navbar';

interface Props {
  open: boolean;
  onClose: () => void;
  session: Session;
  view: View;
  setView: (v: View) => void;
  onLogout: () => void;
}

type Panel = 'profile' | 'settings' | 'help' | null;

export function SideMenu({ open, onClose, session, view, setView, onLogout }: Props) {
  const [panel, setPanel] = useState<Panel>(null);

  function closeAll() {
    setPanel(null);
    onClose();
  }

  function navigate(v: View) {
    setView(v);
    closeAll();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[70] bg-navy-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAll}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[80] h-full w-[88%] max-w-md bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-2 hazard-stripe shrink-0" />

        {/* Header */}
        <div className="bg-navy-900 text-white p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-11 h-11 rounded-xl bg-amber-400 text-navy-900">
                <Zap size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-display font-extrabold text-lg leading-none">VoltLoc</p>
                <p className="text-[11px] text-navy-300 mt-1">Electrical Shop Locator</p>
              </div>
            </div>
            <button
              onClick={closeAll}
              className="grid place-items-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="grid place-items-center w-10 h-10 rounded-full bg-amber-400 text-navy-900 font-display font-extrabold text-sm shrink-0">
              {session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{session.name}</p>
              <p className="text-[11px] text-navy-300 capitalize">@{session.username} · {session.role}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {panel === null && <MenuHome session={session} view={view} navigate={navigate} setPanel={setPanel} onLogout={onLogout} />}
          {panel === 'profile' && <ProfilePanel session={session} onBack={() => setPanel(null)} />}
          {panel === 'settings' && <SettingsPanel onBack={() => setPanel(null)} />}
          {panel === 'help' && <HelpPanel onBack={() => setPanel(null)} />}
        </div>
      </aside>
    </>
  );
}

function MenuHome({
  session,
  view,
  navigate,
  setPanel,
  onLogout,
}: {
  session: Session;
  view: View;
  navigate: (v: View) => void;
  setPanel: (p: Panel) => void;
  onLogout: () => void;
}) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 mb-1.5">Navigate</p>
        <div className="space-y-1">
          <MenuRow icon={Search} label="Search" active={view === 'search'} onClick={() => navigate('search')} />
          <MenuRow icon={Package} label="Inventory" active={view === 'inventory'} onClick={() => navigate('inventory')} />
          <MenuRow icon={BarChart3} label="Sales Track" active={view === 'sales'} onClick={() => navigate('sales')} />
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-2 mb-1.5">Account</p>
        <div className="space-y-1">
          <MenuRow icon={UserCircle} label="Profile" onClick={() => setPanel('profile')} chevron />
          <MenuRow icon={Settings} label="Settings" onClick={() => setPanel('settings')} chevron />
          <MenuRow icon={LifeBuoy} label="Help Centre" onClick={() => setPanel('help')} chevron />
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>

      <p className="text-[10px] text-navy-300 text-center pt-2">VoltLoc v1.0 · Demo build</p>
    </div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  active,
  chevron,
  onClick,
}: {
  icon: typeof Search;
  label: string;
  active?: boolean;
  chevron?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
        active ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200' : 'text-navy-700 hover:bg-navy-50'
      }`}
    >
      <Icon size={18} strokeWidth={2} className={active ? 'text-amber-600' : 'text-navy-400'} />
      <span className="flex-1 text-left">{label}</span>
      {chevron && <ChevronRight size={16} className="text-navy-300" />}
    </button>
  );
}

function PanelHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="sticky top-0 bg-white border-b border-navy-100 px-4 py-3 flex items-center gap-2 z-10">
      <button
        onClick={onBack}
        className="grid place-items-center w-8 h-8 rounded-lg text-navy-500 hover:bg-navy-100 transition"
        aria-label="Back"
      >
        <ChevronRight size={18} className="rotate-180" />
      </button>
      <h3 className="font-display font-bold text-navy-900">{title}</h3>
    </div>
  );
}

function ProfilePanel({ session, onBack }: { session: Session; onBack: () => void }) {
  return (
    <div className="animate-fade-in">
      <PanelHeader title="Profile" onBack={onBack} />
      <div className="p-5 space-y-5">
        <div className="flex flex-col items-center text-center py-4">
          <div className="grid place-items-center w-20 h-20 rounded-full bg-navy-900 text-amber-400 font-display font-extrabold text-2xl shadow-lg">
            {session.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <p className="font-display font-bold text-lg text-navy-900 mt-3">{session.name}</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2.5 py-0.5 rounded-full capitalize mt-1">
            <ShieldCheck size={12} />
            {session.role}
          </span>
        </div>

        <div className="space-y-1">
          <InfoRow icon={UserCircle} label="Username" value={`@${session.username}`} />
          <InfoRow icon={ShieldCheck} label="Role" value={session.role === 'admin' ? 'Administrator' : 'Floor Staff'} />
          <InfoRow icon={Zap} label="Access" value={session.role === 'admin' ? 'Full inventory + CRUD' : 'Search + Give Item'} />
        </div>

        <div className="rounded-xl bg-navy-50 ring-1 ring-navy-100 p-4">
          <p className="text-xs font-semibold text-navy-700 mb-1">Session</p>
          <p className="text-xs text-navy-500">
            You are signed in on this device. Your session stays active until you sign out.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof UserCircle; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-navy-50 transition">
      <Icon size={18} className="text-navy-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-navy-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-navy-900 truncate">{value}</p>
      </div>
    </div>
  );
}

function SettingsPanel({ onBack }: { onBack: () => void }) {
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [outStockAlerts, setOutStockAlerts] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="animate-fade-in">
      <PanelHeader title="Settings" onBack={onBack} />
      <div className="p-5 space-y-5">
        <SettingGroup title="Notifications">
          <Toggle icon={Bell} label="Low stock alerts" desc="Warn when items drop below threshold" value={lowStockAlerts} onChange={setLowStockAlerts} />
          <Toggle icon={Bell} label="Out of stock alerts" desc="Notify when items run out" value={outStockAlerts} onChange={setOutStockAlerts} />
        </SettingGroup>

        <SettingGroup title="Display">
          <Toggle icon={Package} label="Compact card view" desc="Show more products per screen" value={compactView} onChange={setCompactView} />
          <div className="flex items-center gap-3 px-3 py-3">
            {theme === 'light' ? <Sun size={18} className="text-amber-500 shrink-0" /> : <Moon size={18} className="text-navy-400 shrink-0" />}
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">Theme</p>
              <p className="text-[11px] text-navy-400">Light mode recommended for shop floor</p>
            </div>
            <div className="flex rounded-lg bg-navy-100 p-0.5">
              <button onClick={() => setTheme('light')} className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${theme === 'light' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}>
                <Sun size={13} className="inline" />
              </button>
              <button onClick={() => setTheme('dark')} className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${theme === 'dark' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'}`}>
                <Moon size={13} className="inline" />
              </button>
            </div>
          </div>
        </SettingGroup>

        <SettingGroup title="Data">
          <div className="flex items-center gap-3 px-3 py-3">
            <Database size={18} className="text-navy-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">Storage</p>
              <p className="text-[11px] text-navy-400">Saved locally on this device</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3">
            <Globe size={18} className="text-navy-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">Currency</p>
              <p className="text-[11px] text-navy-400">Indian Rupee (₹)</p>
            </div>
            <span className="text-xs font-semibold text-navy-600 bg-navy-100 px-2 py-0.5 rounded-full">INR</span>
          </div>
        </SettingGroup>

        <p className="text-[11px] text-navy-400 text-center pt-2">
          Settings are saved for this demo session only.
        </p>
      </div>
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-1 mb-1.5">{title}</p>
      <div className="bg-white rounded-xl ring-1 ring-navy-100 divide-y divide-navy-50 overflow-hidden">{children}</div>
    </div>
  );
}

function Toggle({
  icon: Icon,
  label,
  desc,
  value,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Icon size={18} className="text-navy-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy-900">{label}</p>
        <p className="text-[11px] text-navy-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-amber-400' : 'bg-navy-200'}`}
        role="switch"
        aria-checked={value}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

function HelpPanel({ onBack }: { onBack: () => void }) {
  const faqs: { q: string; a: string }[] = [
    {
      q: 'How do I find a product?',
      a: 'Type the product name or category in the search bar on the dashboard. Fuzzy matching is enabled, so minor typos still return results.',
    },
    {
      q: 'What does "Give Item" do?',
      a: 'It records that one unit was handed to a customer and reduces stock by one. If stock crosses the low-stock or out-of-stock threshold, the status updates automatically.',
    },
    {
      q: 'How is stock status calculated?',
      a: 'Quantity 0 is Out of Stock. Quantity at or below the product threshold is Low Stock. Anything above is Available.',
    },
    {
      q: 'What are alternative products?',
      a: 'When a product is out of stock or low, the detail view shows similar items from the same category as substitutes.',
    },
    {
      q: 'Where is my data stored?',
      a: 'All product and session data is stored in this browser only. Nothing is sent to a server in this demo.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <PanelHeader title="Help Centre" onBack={onBack} />
      <div className="p-5 space-y-5">
        <div className="rounded-xl bg-navy-900 text-white p-4">
          <div className="flex items-center gap-2">
            <LifeBuoy size={18} className="text-amber-400" />
            <p className="font-display font-bold">Need a hand?</p>
          </div>
          <p className="text-xs text-navy-200 mt-1.5">
            Browse the frequently asked questions below or reach out using the contact options.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-1 mb-1.5">Quick guides</p>
          <div className="grid grid-cols-2 gap-2">
            <GuideCard icon={Search} label="Searching products" />
            <GuideCard icon={Package} label="Managing inventory" />
            <GuideCard icon={BookOpen} label="Stock status" />
            <GuideCard icon={ShieldCheck} label="Roles & access" />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-1 mb-1.5">FAQ</p>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-xl ring-1 ring-navy-100 bg-white overflow-hidden">
                <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer list-none text-sm font-semibold text-navy-900 hover:bg-navy-50 transition">
                  {f.q}
                  <ChevronRight size={16} className="text-navy-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="px-4 pb-3 text-xs text-navy-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400 px-1 mb-1.5">Contact</p>
          <div className="bg-white rounded-xl ring-1 ring-navy-100 divide-y divide-navy-50 overflow-hidden">
            <a href="mailto:support@voltloc.demo" className="flex items-center gap-3 px-4 py-3 hover:bg-navy-50 transition">
              <Mail size={18} className="text-navy-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">Email support</p>
                <p className="text-[11px] text-navy-400">support@voltloc.demo</p>
              </div>
              <ChevronRight size={16} className="text-navy-300" />
            </a>
            <a href="tel:+18001234567" className="flex items-center gap-3 px-4 py-3 hover:bg-navy-50 transition">
              <Phone size={18} className="text-navy-400" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900">Call support</p>
                <p className="text-[11px] text-navy-400">+1 800 123 4567</p>
              </div>
              <ChevronRight size={16} className="text-navy-300" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideCard({ icon: Icon, label }: { icon: typeof Search; label: string }) {
  return (
    <div className="flex flex-col items-start gap-2 p-3 rounded-xl bg-white ring-1 ring-navy-100">
      <div className="grid place-items-center w-9 h-9 rounded-lg bg-navy-50 text-navy-600">
        <Icon size={18} />
      </div>
      <p className="text-xs font-semibold text-navy-800 leading-tight">{label}</p>
    </div>
  );
}
