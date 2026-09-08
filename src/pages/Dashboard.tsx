import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, Package, AlertTriangle, XCircle, MapPin, IndianRupee, Box } from 'lucide-react';
import { Product, CATEGORIES, Category, deriveStatus } from '@/types';
import { fuzzyIncludes } from '@/utils/fuzzy';
import { categoryIcon } from '@/components/categoryIcon';
import { categoryImage } from '@/components/categoryImage';
import { StatusBadge } from '@/components/StatusBadge';

interface Props {
  products: Product[];
  onSelect: (p: Product) => void;
}

export function Dashboard({ products, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');

  const stats = useMemo(() => {
    let low = 0;
    let out = 0;
    for (const p of products) {
      const s = deriveStatus(p);
      if (s === 'low') low++;
      if (s === 'out') out++;
    }
    return { total: products.length, low, out };
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return fuzzyIncludes(`${p.name} ${p.category} ${p.company}`, q);
    });
  }, [products, query, category]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={Package}
          label="Total Products"
          value={stats.total}
          accent="navy"
        />
        <SummaryCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.low}
          accent="amber"
        />
        <SummaryCard
          icon={XCircle}
          label="Out of Stock"
          value={stats.out}
          accent="red"
        />
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-navy-100 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name or category… (fuzzy match enabled)"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-navy-50 border border-navy-200 text-sm text-navy-900 placeholder-navy-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
            />
            {hasQuery && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-700"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="relative sm:w-56">
            <SlidersHorizontal size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | 'all')}
              className="w-full appearance-none pl-10 pr-8 py-3 rounded-xl bg-navy-50 border border-navy-200 text-sm text-navy-900 font-medium focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition cursor-pointer"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
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
        <EmptyResults query={query} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onSelect(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Package;
  label: string;
  value: number;
  accent: 'navy' | 'amber' | 'red';
}) {
  const styles = {
    navy: 'bg-navy-900 text-white',
    amber: 'bg-amber-400 text-navy-900',
    red: 'bg-red-500 text-white',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-navy-100 p-4 flex items-center gap-4">
      <div className={`grid place-items-center w-12 h-12 rounded-xl shrink-0 ${styles[accent]}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-2xl font-display font-extrabold text-navy-900 leading-none">{value}</p>
        <p className="text-xs text-navy-500 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const Icon = categoryIcon(product.category);
  const status = deriveStatus(product);
  const img = categoryImage(product.category, parseInt(product.id.replace(/\D/g, '')) || 0);
  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-2xl ring-1 ring-navy-100 hover:ring-amber-300 hover:shadow-lg hover:shadow-navy-900/5 transition-all overflow-hidden flex flex-col animate-fade-in"
    >
      <div className="relative h-36 overflow-hidden bg-navy-100">
        <img
          src={img}
          alt={product.category}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 grid place-items-center w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm text-navy-700 group-hover:bg-amber-400 group-hover:text-navy-900 transition-colors">
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">{product.category}</p>
            <span className="text-navy-200">·</span>
            <p className="text-xs font-semibold text-navy-500 uppercase tracking-wide">{product.company}</p>
          </div>
          <h3 className="text-sm font-bold text-navy-900 leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between text-xs text-navy-600 pt-2 border-t border-navy-100 mt-auto">
          <span className="inline-flex items-center gap-1 font-medium">
            <MapPin size={13} className="text-navy-400" />
            {product.rack} • {product.shelf} • {product.box}
          </span>
          <span className="inline-flex items-center gap-0.5 font-bold text-navy-900">
            <IndianRupee size={12} />{product.price}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Box size={13} className="text-navy-400" />
          <span className="font-semibold text-navy-800">{product.quantity}</span>
          <span className="text-navy-400">in stock</span>
        </div>
      </div>
    </button>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-navy-100 p-10 text-center animate-scale-in">
      <div className="grid place-items-center w-14 h-14 rounded-full bg-navy-50 text-navy-400 mx-auto mb-3">
        <Search size={26} />
      </div>
      <p className="font-display font-bold text-navy-900">No products found</p>
      <p className="text-sm text-navy-500 mt-1 max-w-sm mx-auto">
        {query ? `Nothing matched "${query}". Try a different spelling or category.` : 'No products in this category.'}
      </p>
    </div>
  );
}
