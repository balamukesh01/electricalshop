import { useState } from 'react';
import {
  Zap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Search,
  Package,
  TrendingUp,
  Boxes,
} from 'lucide-react';
import { login } from '@/store';

interface Props {
  onLogin: () => void;
  onCheckAvailability: () => void;
}

export function LoginPage({ onLogin, onCheckAvailability }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const session = login(username, password);
    if (session) {
      onLogin();
    } else {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-navy-50">
      {/* Brand panel */}
      <div className="relative lg:w-1/2 bg-navy-900 text-white overflow-hidden flex flex-col justify-between p-8 lg:p-12 min-h-[340px] lg:min-h-screen">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/7285965/pexels-photo-7285965.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Electrical wiring work"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-900/85 to-navy-950/90" />
        </div>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-3 hazard-stripe" />
          <div className="absolute bottom-0 left-0 w-full h-3 hazard-stripe" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in">
          <div className="grid place-items-center w-12 h-12 rounded-xl bg-amber-400 text-navy-900 shadow-lg shadow-amber-400/20">
            <Zap size={26} strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight leading-none">VoltLoc</p>
            <p className="text-xs text-navy-200 mt-1">Electrical Shop Locator</p>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-md py-10 animate-fade-in">
          <h1 className="font-display text-3xl lg:text-5xl font-extrabold leading-[1.1]">
            Find any product.<br />
            <span className="text-amber-400">In seconds.</span>
          </h1>
          <p className="text-navy-200 mt-5 text-sm lg:text-base leading-relaxed">
            Instantly locate switches, wires, fans and tools across your shop floor.
            Track stock in real time and hand items to customers with one tap.
          </p>

          {/* Floating stat cards */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <StatChip icon={Package} label="Products" value="20+" />
            <StatChip icon={Boxes} label="In Stock" value="Live" />
            <StatChip icon={TrendingUp} label="Sales" value="Tracked" />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-navy-300 animate-fade-in">
          <ShieldCheck size={14} />
          <span>Staff access only</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-navy-50">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-navy-900 text-amber-400">
              <Zap size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold text-navy-900 leading-none">VoltLoc</p>
              <p className="text-[11px] text-navy-400 mt-0.5">Electrical Shop Locator</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-3 py-1 rounded-full mb-4">
            <ShieldCheck size={13} />
            Staff Portal
          </div>
          <h2 className="font-display text-2xl lg:text-3xl font-extrabold text-navy-900">
            Welcome back
          </h2>
          <p className="text-sm text-navy-500 mt-1.5">
            Sign in to manage inventory, track sales, and locate products on the shop floor.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  className="w-full pl-11 pr-3 py-3 rounded-xl border border-navy-200 bg-white text-sm text-navy-900 placeholder-navy-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-navy-200 bg-white text-sm text-navy-900 placeholder-navy-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700 transition"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 animate-scale-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 disabled:opacity-60 text-white font-bold text-sm py-3 rounded-xl transition-colors group active:scale-[0.99]"
            >
              Sign in
              <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-navy-200" />
            <span className="text-xs font-medium text-navy-400">or</span>
            <div className="h-px flex-1 bg-navy-200" />
          </div>

          {/* Customer availability */}
          <button
            onClick={onCheckAvailability}
            className="w-full inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-navy-900 font-bold text-sm py-3 rounded-xl transition-colors group active:scale-[0.99]"
          >
            <Search size={18} />
            Check Product Availability
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <p className="text-center text-xs text-navy-400 mt-2.5">
            No login needed — for customers
          </p>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15 p-3 text-center">
      <Icon size={18} className="text-amber-400 mx-auto mb-1.5" strokeWidth={2.5} />
      <p className="font-display font-extrabold text-base leading-none">{value}</p>
      <p className="text-[10px] text-navy-300 mt-1 font-medium">{label}</p>
    </div>
  );
}
