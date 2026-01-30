
import { Sector, Shop, UnitCategory } from './types';

export const SECTORS = Object.values(Sector);
export const BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

export const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  [UnitCategory.LIQUID]: ['ml', '250ml', '500ml', 'Litre', '1.5 Litre', '5 Litre'],
  [UnitCategory.SOLID]: ['mg', 'g', '250g', '500g', 'kg', '5kg', '10kg', '20kg'],
  [UnitCategory.COUNT]: ['Piece', 'Half Dozen', 'Dozen', 'Box', 'Packet'],
  [UnitCategory.OTHER]: ['Unit', 'Bag', 'Crate']
};

export const INITIAL_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Grocery Shop',
    type: 'Grocery',
    image: 'https://picsum.photos/seed/grocery/400/300',
    items: [
      { id: 'g1', shopId: '1', name: 'Eggs', price: 280, unit: 'Dozen', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/eggs/200/200' },
      { id: 'g2', shopId: '1', name: 'Cooking Oil', price: 550, unit: 'Litre', unitCategory: UnitCategory.LIQUID, image: 'https://picsum.photos/seed/oil/200/200' },
      { id: 'g3', shopId: '1', name: 'Rice', price: 320, unit: 'kg', unitCategory: UnitCategory.SOLID, image: 'https://picsum.photos/seed/rice/200/200' },
    ]
  },
  {
    id: '2',
    name: 'Meat Shop',
    type: 'Meat',
    image: 'https://picsum.photos/seed/meat/400/300',
    items: [
      { id: 'm1', shopId: '2', name: 'Chicken', price: 650, unit: 'kg', unitCategory: UnitCategory.SOLID, image: 'https://picsum.photos/seed/chicken/200/200' },
      { id: 'm2', shopId: '2', name: 'Mutton', price: 2100, unit: 'kg', unitCategory: UnitCategory.SOLID, image: 'https://picsum.photos/seed/mutton/200/200' },
      { id: 'm3', shopId: '2', name: 'Beef', price: 1200, unit: 'kg', unitCategory: UnitCategory.SOLID, image: 'https://picsum.photos/seed/beef/200/200' },
    ]
  },
  {
    id: '3',
    name: 'Refreshment Shop',
    type: 'Refreshment',
    image: 'https://picsum.photos/seed/refreshment/400/300',
    items: [
      { id: 'r1', shopId: '3', name: 'Dahi Bhallay', price: 180, unit: 'Piece', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/dahibhallay/200/200' },
      { id: 'r2', shopId: '3', name: 'Chana Chaat', price: 150, unit: 'Piece', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/chanachaat/200/200' },
      { id: 'r3', shopId: '3', name: 'Samosa Chaat', price: 160, unit: 'Piece', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/samosa/200/200' },
    ]
  },
  {
    id: '4',
    name: 'Naan Shop',
    type: 'Naan',
    image: 'https://picsum.photos/seed/naan/400/300',
    items: [
      { id: 'n1', shopId: '4', name: 'Roti', price: 25, unit: 'Piece', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/roti/200/200' },
      { id: 'n2', shopId: '4', name: 'Naan', price: 35, unit: 'Piece', unitCategory: UnitCategory.COUNT, image: 'https://picsum.photos/seed/naan-item/200/200' },
    ]
  }
];
