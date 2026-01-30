
export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  PURCHASER = 'PURCHASER',
  RIDER = 'RIDER'
}

export enum Sector {
  SECTOR_1 = 'Sector 1',
  SECTOR_2 = 'Sector 2',
  SECTOR_3 = 'Sector 3',
  SECTOR_4 = 'Sector 4',
  VIP_PROPER = 'VIP Proper',
  VIP_AFFILIATION = 'VIP Affilation',
  VIP_EXTENSIONS = 'VIP Extensions'
}

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string; // Used as username
  whatsappNumber?: string;
  address: {
    sector: Sector;
    houseNumber: string;
    streetNumber: string;
    block?: string; // For Sector 4
    lane?: string; // For Sector 4
  };
  role: UserRole;
  password?: string;
}

export enum UnitCategory {
  LIQUID = 'Liquid (ml/L)',
  SOLID = 'Solid (mg/kg)',
  COUNT = 'Count (pcs/dozen)',
  OTHER = 'Other'
}

export interface Item {
  id: string;
  shopId: string;
  name: string;
  price: number;
  unit: string;
  unitCategory: UnitCategory;
  image: string;
}

export interface Shop {
  id: string;
  name: string;
  type: string;
  image: string;
  items: Item[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PURCHASING = 'PURCHASING',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem extends Item {
  quantity: number;
  status: 'pending' | 'collected' | 'unavailable';
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number; // Sum of base + service
  total: number;
  status: OrderStatus;
  createdAt: number;
  editableUntil?: number; // Timestamp until which the order can be edited
  estimatedDeliveryTime?: string;
  assignedPurchaserId?: string;
  assignedRiderId?: string;
}

export interface SectorTiming {
  baseCharge: number; // Added base delivery charge
  baseMin: number;
  baseMax: number;
  additionalPerItem: number;
  threshold: number;
}

export interface AppConfig {
  logo: string;
  editWindowSeconds: number; // Configurable edit timer
  deliveryTimings: Record<string, SectorTiming>;
  streetCharges: Record<string, number>; // Maps "Sector|Street" to base price
}
