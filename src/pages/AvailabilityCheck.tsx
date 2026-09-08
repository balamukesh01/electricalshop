import { useMemo, useState } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  PackageX,
  IndianRupee,
  Zap,
  ArrowLeft,
  ArrowRight,
  Store,
  Info,
} from 'lucide-react';
import { Product, CATEGORIES, Category, deriveStatus } from '@/types';
import { fuzzyIncludes } from '@/utils/fuzzy';
import { categoryIcon } from '@/components/categoryIcon';
import { categoryImage } from '@/components/categoryImage';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  products: Product[];
  onBackToLogin: () => void;
}

export function AvailabilityCheck({ products, onBackToLogin }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return fuzzyIncludes(`${p.name} ${p.category} ${p.company}`, q);
    });
  }, [products, query, category]);

  const hasQuery = query.trim().length > 0;
  const outOfStockItems = filtered.filter((p) => deriveStatus(p) === 'out');
  const visibleItems = filtered.filter((p) => deriveStatus(p) !== 'out');

  // Alternatives: from the same categories as out-of-stock items, excluding out-of-stock
  const alternatives = useMemo(() => {
    if (outOfStockItems.length === 0 && filtered.length > 0) return [];
    const cats: Set<Category> = new Set();
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach((p) => cats.add(p.category));
    } else if (filtered.length === 0 && hasQuery) {
      CATEGORIES.forEach((c) => cats.add(c));
    }
    if (cats.size === 0) return [];
    return products
      .filter((p) => cats.has(p.category) && deriveStatus(p) !== 'out')
      .slice(0, 6);
  }, [products, outOfStockItems, filtered, hasQuery]);

  const showAlternatives = outOfStockItems.length > 0 || (filtered.length === 0 && hasQuery);

  return (
    <div className="min-h-screen bg-navy-50">
      {/* Top bar */}
      <header className="bg-navy-900 text-white">
        <div className="h-1.5 hazard-stripe" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-amber-400 text-navy-900 shrink-0">
              <Zap size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-display font-extrabold text-lg leading-none">VoltLoc</p>
              <p className="text-[11px] text-navy-300 mt-0.5">Customer Availability Check</p>
            </div>
          </div>
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Staff Login</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Intro */}
        <div className="text-center pt-2 pb-1">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-navy-900">
            Check Product Availability
          </h1>
          <p className="text-sm text-navy-500 mt-1.5 max-w-md mx-auto">
            Search our stock to see what's available before you visit. No login needed.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-navy-100 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a product name or category…"
                className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-navy-50 border border-navy-200 text-base text-navy-900 placeholder-navy-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
              />
              {hasQuery && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="relative sm:w-52">
              <SlidersHorizontal size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | 'all')}
                className="w-full appearance-none pl-10 pr-8 py-3.5 rounded-xl bg-navy-50 border border-navy-200 text-sm text-navy-900 font-medium focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition cursor-pointer"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          {hasQuery && (
            <p className="text-xs text-navy-500 mt-3 pl-1">
              {filtered.length > 0
                ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for "${query.trim()}"`
                : `No matches for "${query.trim()}"`}
            </p>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <NoResults />
        ) : (
          <div className="space-y-3">
            {visibleItems.map((p) => (
              <AvailabilityCard key={p.id} product={p} />
            ))}
            {outOfStockItems.map((p) => (
              <div key={p.id}>
                <AvailabilityCard product={p} />
                <div className="mt-1.5 ml-1 flex items-center gap-1.5 text-xs text-amber-700">
                  <Info size={13} className="shrink-0" />
                  <span>Please check with our staff for more details.</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alternatives */}
        {showAlternatives && (
          <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm p-5 sm:p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Store size={18} className="text-amber-600" />
              <h2 className="font-display font-bold text-navy-900">You may also consider</h2>
            </div>
            {alternatives.length === 0 ? (
              <p className="text-sm text-navy-500">
                No alternatives available right now. Please check with our staff.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternatives.map((alt) => {
                  const AltIcon = categoryIcon(alt.category);
                  const altImg = categoryImage(alt.category, parseInt(alt.id.replace(/\D/g, '')) || 0);
                  return (
                    <div
                      key={alt.id}
                      className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-navy-100 bg-navy-50/40"
                    >
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-navy-100">
                        <img src={altImg} alt={alt.category} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 grid place-items-center bg-navy-950/20 text-white">
                          <AltIcon size={16} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-900 truncate">{alt.name}</p>
                        <p className="text-xs text-navy-500">{alt.category} · {alt.company}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="inline-flex items-center gap-0.5 text-sm font-bold text-navy-900">
                            <IndianRupee size={12} className="text-navy-400" />{alt.price}
                          </span>
                          <StatusBadge status={deriveStatus(alt)} size="sm" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-4 sm:px-6 py-6 text-center">
        <button
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors"
        >
          Back to staff login
          <ArrowRight size={15} />
        </button>
      </footer>
    </div>
  );
}

function AvailabilityCard({ product }: { product: Product }) {
  const Icon = categoryIcon(product.category);
  const status = deriveStatus(product);
  const img = categoryImage(product.category, parseInt(product.id.replace(/\D/g, '')) || 0);
  return (
    <div
      className={`bg-white rounded-2xl ring-1 shadow-sm overflow-hidden flex items-center gap-4 p-3.5 transition-all ${
        status === 'out' ? 'ring-red-100 opacity-90' : 'ring-navy-100'
      }`}
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-navy-100">
        <img src={img} alt={product.category} loading="lazy" className="w-full h-full object-cover" />
        <div className="absolute inset-0 grid place-items-center bg-navy-950/20 text-white">
          <Icon size={20} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{product.category}</p>
          <span className="text-navy-200">·</span>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">{product.company}</p>
        </div>
        <h3 className="text-base font-bold text-navy-900 leading-snug truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="inline-flex items-center gap-0.5 text-lg font-display font-extrabold text-navy-900">
            <IndianRupee size={14} className="text-navy-400" />{product.price}
          </span>
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
}

function NoResults() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-navy-100 p-10 text-center animate-scale-in">
      <div className="grid place-items-center w-14 h-14 rounded-full bg-navy-50 text-navy-400 mx-auto mb-3">
        <PackageX size={26} />
      </div>
      <p className="font-display font-bold text-navy-900">No products found</p>
      <p className="text-sm text-navy-500 mt-1 max-w-sm mx-auto">
        Try a different spelling, or check with our staff — we may have new stock.
      </p>
    </div>
  );
}
