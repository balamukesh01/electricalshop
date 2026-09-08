import { Product, SaleRecord } from '@/types';

export const SEED_PRODUCTS: Product[] = [
  { id: 'p01', name: 'Roma 6A Switch', company: 'Anchor', category: 'Switches', rack: 'A1', shelf: 'S1', box: 'B1', quantity: 42, price: 35, threshold: 5 },
  { id: 'p02', name: 'Myrius 10A Switch', company: 'Legrand', category: 'Switches', rack: 'A1', shelf: 'S1', box: 'B2', quantity: 3, price: 58, threshold: 5 },
  { id: 'p03', name: '1.5 sq mm Wire', company: 'Polycab', category: 'Wires', rack: 'A2', shelf: 'S2', box: 'B1', quantity: 120, price: 12, threshold: 20 },
  { id: 'p04', name: '2.5 sq mm Wire', company: 'Havells', category: 'Wires', rack: 'A2', shelf: 'S2', box: 'B2', quantity: 15, price: 18, threshold: 20 },
  { id: 'p05', name: 'LED Bulb 9W', company: 'Philips', category: 'Bulbs', rack: 'B1', shelf: 'S1', box: 'B1', quantity: 80, price: 110, threshold: 10 },
  { id: 'p06', name: 'LED Bulb 12W', company: 'Syska', category: 'Bulbs', rack: 'B1', shelf: 'S1', box: 'B2', quantity: 8, price: 140, threshold: 10 },
  { id: 'p07', name: 'Ceiling Fan 1200mm', company: 'Crompton', category: 'Fans', rack: 'B2', shelf: 'S2', box: 'B1', quantity: 24, price: 1650, threshold: 5 },
  { id: 'p08', name: 'Pacer Fan 1400mm', company: 'Havells', category: 'Fans', rack: 'B2', shelf: 'S2', box: 'B2', quantity: 0, price: 2100, threshold: 5 },
  { id: 'p09', name: '3-pin Socket', company: 'Anchor', category: 'Sockets', rack: 'C1', shelf: 'S1', box: 'B1', quantity: 56, price: 45, threshold: 8 },
  { id: 'p10', name: '6A 1-way Socket', company: 'Legrand', category: 'Sockets', rack: 'C1', shelf: 'S1', box: 'B2', quantity: 4, price: 72, threshold: 8 },
  { id: 'p11', name: 'MCB 6A C-curve', company: 'Havells', category: 'MCBs', rack: 'C2', shelf: 'S2', box: 'B1', quantity: 35, price: 210, threshold: 6 },
  { id: 'p12', name: 'MCB 16A', company: 'Schneider', category: 'MCBs', rack: 'C2', shelf: 'S2', box: 'B2', quantity: 0, price: 260, threshold: 6 },
  { id: 'p13', name: 'Armoured Cable 4 core', company: 'Polycab', category: 'Cables', rack: 'D1', shelf: 'S1', box: 'B1', quantity: 18, price: 320, threshold: 5 },
  { id: 'p14', name: 'Coaxial Cable', company: 'Finolex', category: 'Cables', rack: 'D1', shelf: 'S1', box: 'B2', quantity: 7, price: 85, threshold: 10 },
  { id: 'p15', name: 'Ceiling Rose Holder', company: 'Anchor', category: 'Holders', rack: 'D2', shelf: 'S2', box: 'B1', quantity: 64, price: 28, threshold: 8 },
  { id: 'p16', name: 'Bulb Holder B22', company: 'Havells', category: 'Holders', rack: 'D2', shelf: 'S2', box: 'B2', quantity: 2, price: 18, threshold: 8 },
  { id: 'p17', name: 'Insulated Screwdriver Set', company: 'Stanley', category: 'Electrical Tools', rack: 'E1', shelf: 'S1', box: 'B1', quantity: 12, price: 650, threshold: 4 },
  { id: 'p18', name: 'Wire Stripper', company: 'Taparia', category: 'Electrical Tools', rack: 'E1', shelf: 'S1', box: 'B2', quantity: 20, price: 240, threshold: 5 },
  { id: 'p19', name: 'Insulation Tape Roll', company: 'GB', category: 'Electrical Tools', rack: 'E1', shelf: 'S2', box: 'B1', quantity: 3, price: 25, threshold: 10 },
  { id: 'p20', name: 'Digital Multimeter (Pocket)', company: 'Generic', category: 'Electrical Tools', rack: 'E2', shelf: 'S1', box: 'B1', quantity: 9, price: 480, threshold: 4 },
];

export const SEED_SALES: SaleRecord[] = [
  { id: 's01', productId: 'p01', productName: 'Roma 6A Switch', company: 'Anchor', category: 'Switches', price: 35, quantity: 12, timestamp: Date.now() - 86400000 * 1, staff: 'admin' },
  { id: 's02', productId: 'p05', productName: 'LED Bulb 9W', company: 'Philips', category: 'Bulbs', price: 110, quantity: 8, timestamp: Date.now() - 86400000 * 1, staff: 'staff' },
  { id: 's03', productId: 'p03', productName: '1.5 sq mm Wire', company: 'Polycab', category: 'Wires', price: 12, quantity: 25, timestamp: Date.now() - 86400000 * 2, staff: 'admin' },
  { id: 's04', productId: 'p07', productName: 'Ceiling Fan 1200mm', company: 'Crompton', category: 'Fans', price: 1650, quantity: 3, timestamp: Date.now() - 86400000 * 2, staff: 'staff' },
  { id: 's05', productId: 'p09', productName: '3-pin Socket', company: 'Anchor', category: 'Sockets', price: 45, quantity: 6, timestamp: Date.now() - 86400000 * 3, staff: 'admin' },
  { id: 's06', productId: 'p11', productName: 'MCB 6A C-curve', company: 'Havells', category: 'MCBs', price: 210, quantity: 4, timestamp: Date.now() - 86400000 * 3, staff: 'staff' },
  { id: 's07', productId: 'p01', productName: 'Roma 6A Switch', company: 'Anchor', category: 'Switches', price: 35, quantity: 5, timestamp: Date.now() - 86400000 * 4, staff: 'admin' },
  { id: 's08', productId: 'p17', productName: 'Insulated Screwdriver Set', company: 'Stanley', category: 'Electrical Tools', price: 650, quantity: 2, timestamp: Date.now() - 86400000 * 5, staff: 'staff' },
  { id: 's09', productId: 'p13', productName: 'Armoured Cable 4 core', company: 'Polycab', category: 'Cables', price: 320, quantity: 2, timestamp: Date.now() - 86400000 * 5, staff: 'admin' },
  { id: 's10', productId: 'p05', productName: 'LED Bulb 9W', company: 'Philips', category: 'Bulbs', price: 110, quantity: 10, timestamp: Date.now() - 86400000 * 6, staff: 'staff' },
];
