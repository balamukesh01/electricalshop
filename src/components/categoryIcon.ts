import {
  Lightbulb,
  Cable,
  Fan,
  Plug,
  ToggleLeft,
  Wrench,
  CableCar,
  CircleDot,
  Plug2,
  Zap,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/types';

const MAP: Record<Category, LucideIcon> = {
  Switches: ToggleLeft,
  Wires: Cable,
  Bulbs: Lightbulb,
  Fans: Fan,
  Sockets: Plug,
  MCBs: Zap,
  Cables: CableCar,
  Holders: CircleDot,
  'Electrical Tools': Wrench,
};

export function categoryIcon(cat: Category): LucideIcon {
  return MAP[cat] ?? Plug2;
}
