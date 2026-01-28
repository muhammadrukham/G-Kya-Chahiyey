
import { useState, useEffect } from 'react';
import { User, Shop, Order, AppConfig, UserRole, Sector, OrderStatus, Item } from './types';
import { INITIAL_SHOPS } from './constants';

const STORAGE_KEY = 'ji_kya_chahiye_data';

interface AppData {
  users: User[];
  shops: Shop[];
  orders: Order[];
  config: AppConfig;
  currentUser: User | null;
  wishlist: Record<string, Item[]>; // Keyed by userId
}

const initialData: AppData = {
  users: [
    {
      id: 'admin-1',
      fullName: 'Super Admin',
      mobileNumber: 'admin',
      role: UserRole.ADMIN,
      address: {
        sector: Sector.SECTOR_1,
        houseNumber: '1',
        streetNumber: '1'
      }
    }
  ],
  shops: INITIAL_SHOPS,
  orders: [],
  config: {
    logo: 'https://via.placeholder.com/150?text=Ji+Kya+Chahiye'
  },
  currentUser: null,
  wishlist: {}
};

export const useStore = () => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const login = (mobile: string) => {
    const user = data.users.find(u => u.mobileNumber === mobile);
    if (user) {
      setData(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setData(prev => ({ ...prev, currentUser: null }));
  };

  const signup = (user: User) => {
    if (data.users.some(u => u.mobileNumber === user.mobileNumber)) return false;
    setData(prev => ({ ...prev, users: [...prev.users, user], currentUser: user }));
    return true;
  };

  const updateConfig = (config: Partial<AppConfig>) => {
    setData(prev => ({ ...prev, config: { ...prev.config, ...config } }));
  };

  const addShop = (shop: Shop) => {
    setData(prev => ({ ...prev, shops: [...prev.shops, shop] }));
  };

  const updateShop = (shop: Shop) => {
    setData(prev => ({ ...prev, shops: prev.shops.map(s => s.id === shop.id ? shop : s) }));
  };

  const deleteShop = (id: string) => {
    setData(prev => ({ ...prev, shops: prev.shops.filter(s => s.id !== id) }));
  };

  const placeOrder = (order: Order) => {
    setData(prev => ({ ...prev, orders: [order, ...prev.orders] }));
  };

  const updateOrder = (order: Order) => {
    setData(prev => ({ ...prev, orders: prev.orders.map(o => o.id === order.id ? order : o) }));
  };

  const deleteOrder = (id: string) => {
    setData(prev => ({ ...prev, orders: prev.orders.filter(o => o.id !== id) }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
  };

  const toggleWishlist = (userId: string, item: Item) => {
    setData(prev => {
      const userWishlist = prev.wishlist[userId] || [];
      const isExist = userWishlist.find(i => i.id === item.id);
      const newWishlist = isExist 
        ? userWishlist.filter(i => i.id !== item.id)
        : [...userWishlist, item];
      return {
        ...prev,
        wishlist: { ...prev.wishlist, [userId]: newWishlist }
      };
    });
  };

  const removeFromWishlist = (userId: string, itemId: string) => {
    setData(prev => {
      const userWishlist = prev.wishlist[userId] || [];
      return {
        ...prev,
        wishlist: { ...prev.wishlist, [userId]: userWishlist.filter(i => i.id !== itemId) }
      };
    });
  };

  return {
    ...data,
    login,
    logout,
    signup,
    updateConfig,
    addShop,
    updateShop,
    deleteShop,
    placeOrder,
    updateOrder,
    deleteOrder,
    deleteUser,
    toggleWishlist,
    removeFromWishlist
  };
};
