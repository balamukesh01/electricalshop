import { useEffect, useMemo, useState } from 'react';
import { LoginPage } from '@/pages/LoginPage';
import { Navbar, View } from '@/components/Navbar';
import { SideMenu } from '@/components/SideMenu';
import { Dashboard } from '@/pages/Dashboard';
import { ProductDetail } from '@/pages/ProductDetail';
import { Inventory } from '@/pages/Inventory';
import { Sales } from '@/pages/Sales';
import { AvailabilityCheck } from '@/pages/AvailabilityCheck';
import { ToastProvider, useToast } from '@/components/Toast';
import { useProducts, useSales, getSession, logout, Session } from '@/store';
import { deriveStatus, SaleRecord } from '@/types';

function AppInner() {
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [view, setView] = useState<View>('search');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [publicView, setPublicView] = useState(false);
  const { products, addProduct, updateProduct, deleteProduct, giveItem, resetToSeed } = useProducts();
  const { sales, recordSale, resetSales, clearSales } = useSales();
  const { push } = useToast();

  const selected = useMemo(
    () => (selectedId ? products.find((p) => p.id === selectedId) ?? null : null),
    [products, selectedId]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, selectedId]);

  if (!session) {
    if (publicView) {
      return (
        <AvailabilityCheck
          products={products}
          onBackToLogin={() => setPublicView(false)}
        />
      );
    }
    return <LoginPage onLogin={() => setSession(getSession())} onCheckAvailability={() => setPublicView(true)} />;
  }

  function handleLogout() {
    logout();
    setSession(null);
    setSelectedId(null);
    setView('search');
    setPublicView(false);
  }

  function handleGiveItem(id: string, qty: number) {
    const before = products.find((p) => p.id === id);
    if (!before) return;
    const beforeStatus = deriveStatus(before);
    giveItem(id, qty);
    const afterQty = Math.max(0, before.quantity - qty);
    const afterStatus =
      afterQty <= 0 ? 'out' : afterQty <= before.threshold ? 'low' : 'available';

    const sale: SaleRecord = {
      id: `s${Date.now()}`,
      productId: before.id,
      productName: before.name,
      company: before.company,
      category: before.category,
      price: before.price,
      quantity: qty,
      timestamp: Date.now(),
      staff: session!.username,
    };
    recordSale(sale);

    if (afterStatus === 'out' && beforeStatus !== 'out') {
      push('error', 'Now out of stock', `${before.name} is now out of stock. Showing alternatives.`);
    } else if (afterStatus === 'low' && beforeStatus !== 'low') {
      push('warn', 'Low stock warning', `${before.name} dropped to ${afterQty} units.`);
    } else {
      push('success', 'Sale recorded', `${qty} × ${before.name} handed over — ${afterQty} remaining.`);
    }
  }

  function handleResetAll() {
    resetToSeed();
    resetSales();
  }

  let content;
  if (selected) {
    content = (
      <ProductDetail
        product={selected}
        allProducts={products}
        sales={sales}
        onBack={() => setSelectedId(null)}
        onSelectAlt={(p) => setSelectedId(p.id)}
        onGiveItem={handleGiveItem}
      />
    );
  } else if (view === 'inventory') {
    content = (
      <Inventory
        products={products}
        onAdd={addProduct}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        onReset={handleResetAll}
      />
    );
  } else if (view === 'sales') {
    content = (
      <Sales
        sales={sales}
        onReset={resetSales}
        onClear={clearSales}
      />
    );
  } else {
    content = <Dashboard products={products} onSelect={(p) => setSelectedId(p.id)} />;
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar view={view} setView={(v) => { setView(v); setSelectedId(null); }} session={session} onOpenMenu={() => setMenuOpen(true)} />
      <main className="pt-2">{content}</main>
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        session={session}
        view={view}
        setView={(v) => { setView(v); setSelectedId(null); }}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
