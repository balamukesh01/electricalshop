import { useMemo, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  IndianRupee,
  ArrowDownUp,
  RotateCcw,
} from 'lucide-react';
import { Product, CATEGORIES, COMPANIES, Category, deriveStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { categoryIcon } from '@/components/categoryIcon';
import { categoryImage } from '@/components/categoryImage';
import { fuzzyIncludes } from '@/utils/fuzzy';
import { useToast } from '@/components/Toast';

interface Props {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
}

type SortKey = 'name' | 'company' | 'category' | 'quantity' | 'status' | 'price';
type SortDir = 'asc' | 'desc';

const STATUS_ORDER: Record<string, number> = { out: 0, low: 1, available: 2 };

export function Inventory({ products, onAdd, onUpdate, onDelete, onReset }: Props) {
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const { push } = useToast();

  const rows = useMemo(() => {
    const q = query.trim();
    let list = products.filter((p) => {
      if (catFilter !== 'all' && p.category !== catFilter) return false;
      if (statusFilter !== 'all' && deriveStatus(p) !== statusFilter) return false;
      if (!q) return true;
      return fuzzyIncludes(`${p.name} ${p.category} ${p.company} ${p.rack} ${p.shelf} ${p.box}`, q);
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
        case 'company':
          cmp = a.company.localeCompare(b.company);
          break;
        case 'quantity':
          cmp = a.quantity - b.quantity;
          break;
        case 'price':
          cmp = a.price - b.price;
          break;
        case 'status':
          cmp = STATUS_ORDER[deriveStatus(a)] - STATUS_ORDER[deriveStatus(b)];
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [products, query, catFilter, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function openNew() {
    setEditing(null);
    setShowForm(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setShowForm(true);
  }

  function handleSave(p: Product) {
    if (editing) {
      onUpdate(p);
      push('success', 'Product updated', `${p.name} saved.`);
    } else {
      onAdd(p);
      push('success', 'Product added', `${p.name} added to inventory.`);
    }
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(p: Product) {
    onDelete(p.id);
    setConfirmDelete(null);
    push('error', 'Product deleted', `${p.name} removed from inventory.`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-navy-900">Inventory</h1>
          <p className="text-sm text-navy-500 mt-0.5">{products.length} products across {CATEGORIES.length} categories</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onReset();
              push('info', 'Inventory reset', 'Sample seed data restored.');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:text-navy-900 bg-white ring-1 ring-navy-200 hover:ring-navy-300 px-3 py-2 rounded-lg transition"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search inventory…"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-navy-50 border border-navy-200 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value as Category | 'all')}
          className="appearance-none px-3 py-2.5 rounded-lg bg-navy-50 border border-navy-200 text-sm font-medium focus:border-amber-400 outline-none transition cursor-pointer"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="appearance-none px-3 py-2.5 rounded-lg bg-navy-50 border border-navy-200 text-sm font-medium focus:border-amber-400 outline-none transition cursor-pointer"
        >
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl ring-1 ring-navy-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[860px]">
            <thead>
              <tr className="bg-navy-50 text-navy-600 text-xs uppercase tracking-wide">
                <Th label="Product" sortKey="name" current={sortKey} dir={sortDir} onSort={toggleSort} />
                <Th label="Company" sortKey="company" current={sortKey} dir={sortDir} onSort={toggleSort} />
                <Th label="Category" sortKey="category" current={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="text-left font-bold px-3 py-3">Location</th>
                <Th label="Qty" sortKey="quantity" current={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                <Th label="Price" sortKey="price" current={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
                <Th label="Status" sortKey="status" current={sortKey} dir={sortDir} onSort={toggleSort} />
                <th className="text-right font-bold px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-navy-400 py-10">No products match your filters.</td>
                </tr>
              ) : (
                rows.map((p) => {
                  const Icon = categoryIcon(p.category);
                  const img = categoryImage(p.category, parseInt(p.id.replace(/\D/g, '')) || 0);
                  return (
                    <tr key={p.id} className="hover:bg-navy-50/60 transition-colors">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-navy-100">
                            <img src={img} alt={p.category} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 grid place-items-center bg-navy-950/25 text-white">
                              <Icon size={15} />
                            </div>
                          </div>
                          <span className="font-semibold text-navy-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3"><span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-700 bg-navy-50 px-2 py-0.5 rounded-md">{p.company}</span></td>
                      <td className="px-3 py-3 text-navy-600">{p.category}</td>
                      <td className="px-3 py-3 text-navy-600 font-mono text-xs">{p.rack}/{p.shelf}/{p.box}</td>
                      <td className="px-3 py-3 text-right font-bold text-navy-900 tabular-nums">{p.quantity}</td>
                      <td className="px-3 py-3 text-right text-navy-700 tabular-nums">
                        <span className="inline-flex items-center">
                          <IndianRupee size={12} className="text-navy-400" />{p.price}
                        </span>
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={deriveStatus(p)} size="sm" /></td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="grid place-items-center w-8 h-8 rounded-lg text-navy-500 hover:bg-navy-100 hover:text-navy-900 transition"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(p)}
                            className="grid place-items-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProductForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${confirmDelete.name}" will be permanently removed from inventory.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

function Th({
  label,
  sortKey,
  current,
  dir,
  onSort,
  align = 'left',
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = current === sortKey;
  return (
    <th className={`px-3 py-3 font-bold ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <button
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''} ${active ? 'text-navy-900' : ''} hover:text-navy-900 transition`}
      >
        {label}
        <ArrowDownUp size={12} className={active ? 'text-amber-600' : 'text-navy-300'} />
        {active && <span className="text-[10px]">{dir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  );
}

function ProductForm({
  initial,
  onClose,
  onSave,
}: {
  initial: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [company, setCompany] = useState(initial?.company ?? 'Anchor');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Switches');
  const [rack, setRack] = useState(initial?.rack ?? '');
  const [shelf, setShelf] = useState(initial?.shelf ?? '');
  const [box, setBox] = useState(initial?.box ?? '');
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? ''));
  const [price, setPrice] = useState(String(initial?.price ?? ''));
  const [threshold, setThreshold] = useState(String(initial?.threshold ?? '5'));
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError('Product name is required.');
    if (!rack.trim() || !shelf.trim() || !box.trim()) return setError('Rack, shelf and box are required.');
    const q = Number(quantity);
    const pr = Number(price);
    const th = Number(threshold);
    if (Number.isNaN(q) || q < 0) return setError('Quantity must be 0 or more.');
    if (Number.isNaN(pr) || pr < 0) return setError('Price must be a valid number.');
    if (Number.isNaN(th) || th < 0) return setError('Threshold must be 0 or more.');
    onSave({
      id: initial?.id ?? `p${Date.now()}`,
      name: name.trim(),
      company,
      category,
      rack: rack.trim().toUpperCase(),
      shelf: shelf.trim().toUpperCase(),
      box: box.trim().toUpperCase(),
      quantity: q,
      price: pr,
      threshold: th,
    });
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-navy-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-display text-lg font-bold text-navy-900">
            {initial ? 'Edit product' : 'Add new product'}
          </h2>
          <button onClick={onClose} className="grid place-items-center w-8 h-8 rounded-lg text-navy-400 hover:bg-navy-100 hover:text-navy-900 transition">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <Field label="Product name">
            <input value={name} onChange={(e) => setName(e.target.value)} autoFocus className={inputCls} placeholder="e.g. Roma 6A Switch" />
          </Field>
          <Field label="Company">
            <select value={company} onChange={(e) => setCompany(e.target.value)} className={`${inputCls} cursor-pointer`}>
              {COMPANIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={`${inputCls} cursor-pointer`}>
              {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Rack"><input value={rack} onChange={(e) => setRack(e.target.value)} className={inputCls} placeholder="A1" /></Field>
            <Field label="Shelf"><input value={shelf} onChange={(e) => setShelf(e.target.value)} className={inputCls} placeholder="S1" /></Field>
            <Field label="Box"><input value={box} onChange={(e) => setBox(e.target.value)} className={inputCls} placeholder="B1" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Quantity"><input type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputCls} placeholder="0" /></Field>
            <Field label="Price (₹)"><input type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} placeholder="0" /></Field>
            <Field label="Low-stock threshold"><input type="number" min={0} value={threshold} onChange={(e) => setThreshold(e.target.value)} className={inputCls} placeholder="5" /></Field>
          </div>
          {error && <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-navy-600 hover:bg-navy-100 transition">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold bg-navy-900 hover:bg-navy-800 text-white transition">
              <Save size={16} />{initial ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg bg-navy-50 border border-navy-200 text-sm text-navy-900 placeholder-navy-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 outline-none transition';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-navy-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 bg-navy-950/50 backdrop-blur-sm animate-fade-in" onClick={onCancel}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
        <p className="text-sm text-navy-500 mt-1.5">{message}</p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-semibold text-navy-600 hover:bg-navy-100 transition">Cancel</button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-navy-900 hover:bg-navy-800'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
