export type Category =
  | 'Switches'
  | 'Wires'
  | 'Bulbs'
  | 'Fans'
  | 'Sockets'
  | 'MCBs'
  | 'Cables'
  | 'Holders'
  | 'Electrical Tools';

export type StockStatus = 'available' | 'low' | 'out';

export interface Product {
  id: string;
  name: string;
  company: string;
  category: Category;
  rack: string;
  shelf: string;
  box: string;
  quantity: number;
  price: number;
  threshold: number;
}

export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  company: string;
  category: Category;
  price: number;
  quantity: number;
  timestamp: number;
  staff: string;
}

export const CATEGORIES: Category[] = [
  'Switches',
  'Wires',
  'Bulbs',
  'Fans',
  'Sockets',
  'MCBs',
  'Cables',
  'Holders',
  'Electrical Tools',
];

export const COMPANIES = [
  'Anchor',
  'Legrand',
  'Polycab',
  'Havells',
  'Philips',
  'Syska',
  'Crompton',
  'Schneider',
  'Finolex',
  'Stanley',
  'Taparia',
  'GB',
  'Generic',
];

export function deriveStatus(p: Product): StockStatus {
  if (p.quantity <= 0) return 'out';
  if (p.quantity <= p.threshold) return 'low';
  return 'available';
}
