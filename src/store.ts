import { useEffect, useState, useCallback } from 'react';
import { Product, SaleRecord } from '@/types';
import { SEED_PRODUCTS, SEED_SALES } from '@/seed';

const PRODUCTS_KEY = 'esp_products_v2';
const SALES_KEY = 'esp_sales_v1';
const SESSION_KEY = 'esp_session_v1';

export interface Session {
  username: string;
  name: string;
  role: 'admin' | 'staff';
}

const STAFF: Record<string, { password: string; name: string; role: 'admin' | 'staff' }> = {
  admin: { password: 'admin123', name: 'Shop Admin', role: 'admin' },
  staff: { password: 'staff123', name: 'Floor Staff', role: 'staff' },
};

function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as T;
  } catch {
    return seed;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => load(PRODUCTS_KEY, SEED_PRODUCTS));

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  const addProduct = useCallback((p: Product) => {
    setProducts((prev) => [p, ...prev]);
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const giveItem = useCallback((id: string, qty: number) => {
    setProducts((prev) =>
      prev.map((x) => (x.id === id ? { ...x, quantity: Math.max(0, x.quantity - qty) } : x))
    );
  }, []);

  const resetToSeed = useCallback(() => {
    setProducts(SEED_PRODUCTS);
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, giveItem, resetToSeed };
}

export function useSales() {
  const [sales, setSales] = useState<SaleRecord[]>(() => load(SALES_KEY, SEED_SALES));

  useEffect(() => {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  }, [sales]);

  const recordSale = useCallback((s: SaleRecord) => {
    setSales((prev) => [s, ...prev]);
  }, []);

  const resetSales = useCallback(() => {
    setSales(SEED_SALES);
  }, []);

  const clearSales = useCallback(() => {
    setSales([]);
  }, []);

  return { sales, recordSale, resetSales, clearSales };
}

export function login(username: string, password: string): Session | null {
  const u = STAFF[username.trim().toLowerCase()];
  if (u && u.password === password) {
    const session: Session = { username: username.trim().toLowerCase(), name: u.name, role: u.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
