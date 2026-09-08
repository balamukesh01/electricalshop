import { Category } from '@/types';

const CATEGORY_IMAGES: Record<Category, string[]> = {
  Switches: [
    'https://images.pexels.com/photos/12996907/pexels-photo-12996907.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/6000686/pexels-photo-6000686.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/10117712/pexels-photo-10117712.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Wires: [
    'https://images.pexels.com/photos/5691657/pexels-photo-5691657.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/11133641/pexels-photo-11133641.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/28286031/pexels-photo-28286031.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Bulbs: [
    'https://images.pexels.com/photos/3946250/pexels-photo-3946250.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/3946163/pexels-photo-3946163.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/5853954/pexels-photo-5853954.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Fans: [
    'https://images.pexels.com/photos/12689254/pexels-photo-12689254.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/3990590/pexels-photo-3990590.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/38697833/pexels-photo-38697833.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Sockets: [
    'https://images.pexels.com/photos/8101107/pexels-photo-8101107.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/38772504/pexels-photo-38772504.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/36272732/pexels-photo-36272732.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  MCBs: [
    'https://images.pexels.com/photos/5767595/pexels-photo-5767595.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/38171184/pexels-photo-38171184.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/28950842/pexels-photo-28950842.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Cables: [
    'https://images.pexels.com/photos/11837451/pexels-photo-11837451.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/11404176/pexels-photo-11404176.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/18082922/pexels-photo-18082922.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  Holders: [
    'https://images.pexels.com/photos/5853953/pexels-photo-5853953.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/11547106/pexels-photo-11547106.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/35213668/pexels-photo-35213668.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
  'Electrical Tools': [
    'https://images.pexels.com/photos/38292956/pexels-photo-38292956.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/6349399/pexels-photo-6349399.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    'https://images.pexels.com/photos/772444/pexels-photo-772444.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
  ],
};

export function categoryImage(category: Category, variant = 0): string {
  const imgs = CATEGORY_IMAGES[category];
  return imgs[variant % imgs.length];
}
