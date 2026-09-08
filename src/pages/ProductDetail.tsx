import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Boxes,
  Box,
  Tag,
  HandCoins,
  PackageX,
  Archive,
  Layers,
  CheckCircle2,
  Building2,
  TrendingUp,
  ShoppingBag,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { Product, SaleRecord, deriveStatus } from '@/types';
import { categoryIcon } from '@/components/categoryIcon';
import { categoryImage } from '@/components/categoryImage';
import { StatusBadge } from '@/components/StatusBadge';
import { fuzzyIncludes } from '@/utils/fuzzy';

interface Props {
  product: Product;
  allProducts: Product[];
  sales: SaleRecord[];
  onBack: () => void;
  onSelectAlt: (p: Product) => void;
  onGiveItem: (id: string, qty: number) => void;
}

export function ProductDetail({ product, allProducts, sales, onBack, onSelectAlt, onGiveItem }: Props) {
  const status = deriveStatus(product);
  const Icon = categoryIcon(product.category);
  const [giveQty, setGiveQty] = useState(1);
  const [showGiveModal, setShowGiveModal] = useState(false);

  const maxQty = Math.max(1, product.quantity);

  useEffect(() => {
    setGiveQty(1);
    setShowGiveModal(false);
  }, [product.id]);

  const alternatives = useMemo(() => {
    const q = product.name;
    return allProducts
      .filter(
        (p) =>
          p.id !== product.id &&
          (p.category === product.category || fuzzyIncludes(`${p.name}`, q))
      )
      .filter((p) => deriveStatus(p) !== 'out')
      .slice(0, 4);
  }, [allProducts, product]);

  const showAlternatives = status !== 'available' || alternatives.length > 0;

  const productSales = useMemo(() => {
    return sales.filter((s) => s.productId === product.id).sort((a, b) => b.timestamp - a.timestamp);
  }, [sales, product.id]);

  const salesStats = useMemo(() => {
    const units = productSales.reduce((sum, s) => sum + s.quantity, 0);
    const revenue = productSales.reduce((sum, s) => sum + s.price * s.quantity, 0);
    return { units, revenue, count: productSales.length };
  }, [productSales]);

  function handleGive() {
    onGiveItem(product.id, giveQty);
    setShowGiveModal(false);
    setGiveQty(1);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to search
      </button>

      {/* Main detail card */}
      <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm overflow-hidden animate-scale-in">
        <div className="h-2 hazard-stripe" />
        <div className="relative h-44 sm:h-56 bg-navy-100 overflow-hidden">
          <img
            src={categoryImage(product.category, parseInt(product.id.replace(/\D/g, '')) || 0)}
            alt={product.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm text-navy-700 shrink-0">
                <Icon size={24} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  <Tag size={11} />
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/80">
                  <Building2 size={11} />
                  {product.company}
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight mt-0.5 line-clamp-2">
                  {product.name}
                </h1>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>
        <div className="p-5 sm:p-7">

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <InfoTile icon={Archive} label="Rack" value={product.rack} />
            <InfoTile icon={Layers} label="Shelf" value={product.shelf} />
            <InfoTile icon={Box} label="Box" value={product.box} />
            <InfoTile icon={Boxes} label="Quantity" value={String(product.quantity)} />
          </div>

          {/* Location highlight */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-navy-900 text-white p-4">
            <MapPin size={22} className="text-amber-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-navy-300 font-medium">Exact location</p>
              <p className="font-display font-bold text-lg leading-tight">
                Rack {product.rack} → Shelf {product.shelf} → Box {product.box}
              </p>
            </div>
          </div>

          {/* Price + action */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-navy-50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-500 font-medium">Price</span>
              <span className="inline-flex items-center font-display text-2xl font-extrabold text-navy-900">
                <IndianRupee size={18} />{product.price}
              </span>
            </div>

            {status === 'out' ? (
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 bg-red-100 px-4 py-2.5 rounded-lg">
                <PackageX size={18} />
                Out of stock — see alternatives below
              </div>
            ) : (
              <button
                onClick={() => setShowGiveModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-navy-900 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors active:scale-[0.98]"
              >
                <HandCoins size={18} />
                Give Item to Customer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Give item modal */}
      {showGiveModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-navy-950/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowGiveModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl ring-1 ring-navy-100 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-navy-100">
              <div className="flex items-center gap-2">
                <HandCoins size={20} className="text-amber-600" />
                <h3 className="font-display font-bold text-navy-900">Give Item to Customer</h3>
              </div>
              <button
                onClick={() => setShowGiveModal(false)}
                className="text-navy-400 hover:text-navy-700 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Product summary */}
              <div className="flex items-center gap-3 rounded-xl bg-navy-50 p-3">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-navy-100">
                  <img
                    src={categoryImage(product.category, parseInt(product.id.replace(/\D/g, '')) || 0)}
                    alt={product.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-navy-950/20 text-white">
                    <Icon size={16} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{product.name}</p>
                  <p className="text-xs text-navy-500">₹{product.price}/unit · {product.quantity} in stock</p>
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <label className="block text-xs font-semibold text-navy-700 mb-2">Quantity to hand over</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGiveQty((q) => Math.max(1, q - 1))}
                    disabled={giveQty <= 1}
                    className="grid place-items-center w-11 h-11 rounded-xl bg-navy-100 text-navy-700 hover:bg-navy-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={giveQty}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 1;
                      setGiveQty(Math.min(Math.max(1, v), maxQty));
                    }}
                    className="w-16 text-center font-display text-xl font-extrabold text-navy-900 bg-navy-50 border border-navy-200 rounded-xl py-2.5 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
                  />
                  <button
                    onClick={() => setGiveQty((q) => Math.min(maxQty, q + 1))}
                    disabled={giveQty >= maxQty}
                    className="grid place-items-center w-11 h-11 rounded-xl bg-navy-100 text-navy-700 hover:bg-navy-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors active:scale-95"
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    onClick={() => setGiveQty(maxQty)}
                    className="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    Max ({maxQty})
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3">
                <span className="text-sm font-semibold text-amber-800">Total amount</span>
                <span className="inline-flex items-center font-display text-2xl font-extrabold text-navy-900">
                  <IndianRupee size={16} className="text-navy-400" />
                  {(product.price * giveQty).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-5 border-t border-navy-100">
              <button
                onClick={() => setShowGiveModal(false)}
                className="flex-1 py-3 rounded-xl border border-navy-200 text-sm font-semibold text-navy-600 hover:bg-navy-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGive}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-navy-900 font-bold text-sm transition-colors active:scale-[0.98]"
              >
                <HandCoins size={18} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales track for this product */}
      <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm p-5 sm:p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-amber-600" />
          <h2 className="font-display font-bold text-navy-900">Sales Track</h2>
          <span className="text-xs text-navy-400">for this product</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-navy-50 p-3 ring-1 ring-navy-100 text-center">
            <p className="font-display text-xl font-extrabold text-navy-900">{salesStats.count}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-navy-400 mt-0.5">Sales</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-3 ring-1 ring-navy-100 text-center">
            <p className="font-display text-xl font-extrabold text-navy-900 inline-flex items-center">
              <ShoppingBag size={14} className="text-navy-400 mr-0.5" />{salesStats.units}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-navy-400 mt-0.5">Units Sold</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-3 ring-1 ring-navy-100 text-center">
            <p className="font-display text-xl font-extrabold text-navy-900 inline-flex items-center">
              <IndianRupee size={14} className="text-navy-400" />{salesStats.revenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-navy-400 mt-0.5">Revenue</p>
          </div>
        </div>
        {productSales.length === 0 ? (
          <p className="text-sm text-navy-500 py-2">No sales recorded for this product yet.</p>
        ) : (
          <div className="divide-y divide-navy-50 max-h-64 overflow-y-auto scrollbar-thin">
            {productSales.slice(0, 10).map((s) => {
              const date = new Date(s.timestamp);
              return (
                <div key={s.id} className="flex items-center gap-3 py-2.5">
                  <div className="grid place-items-center w-8 h-8 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                    <HandCoins size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800">
                      {s.quantity} unit{s.quantity > 1 ? 's' : ''} · ₹{s.price}/unit
                    </p>
                    <p className="text-[11px] text-navy-400">
                      {date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })} · by {s.staff}
                    </p>
                  </div>
                  <p className="font-display font-bold text-navy-900 text-sm shrink-0">
                    ₹{(s.price * s.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alternatives */}
      {showAlternatives && (
        <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm p-5 sm:p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-amber-600" />
            <h2 className="font-display font-bold text-navy-900">
              {status === 'out' ? 'Alternative products' : 'Similar products'}
            </h2>
            <span className="text-xs text-navy-400">from {product.category}</span>
          </div>
          {alternatives.length === 0 ? (
            <p className="text-sm text-navy-500">
              No alternatives available in {product.category} right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternatives.map((alt) => {
                const AltIcon = categoryIcon(alt.category);
                const altImg = categoryImage(alt.category, parseInt(alt.id.replace(/\D/g, '')) || 0);
                return (
                  <button
                    key={alt.id}
                    onClick={() => onSelectAlt(alt)}
                    className="text-left flex items-center gap-3 p-3 rounded-xl ring-1 ring-navy-100 hover:ring-amber-300 hover:bg-amber-50/40 transition-all"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-navy-100">
                      <img src={altImg} alt={alt.category} loading="lazy" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 grid place-items-center bg-navy-950/20 text-white">
                        <AltIcon size={16} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy-900 truncate">{alt.name}</p>
                      <p className="text-xs text-navy-500">
                        {alt.rack} • {alt.shelf} • {alt.box} · Qty {alt.quantity}
                      </p>
                    </div>
                    <StatusBadge status={deriveStatus(alt)} size="sm" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Archive;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-navy-50 p-3 ring-1 ring-navy-100">
      <div className="flex items-center gap-1.5 text-navy-400">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display text-lg font-extrabold text-navy-900 mt-1">{value}</p>
    </div>
  );
}
