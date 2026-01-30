
import { useState, useEffect } from 'react';
import { User, Shop, Order, AppConfig, UserRole, Sector, Item } from './types';
import { INITIAL_SHOPS } from './constants';
import { db } from './services/api';

const COLLECTIONS = {
  USERS: 'users',
  SHOPS: 'shops',
  ORDERS: 'orders',
  CONFIG: 'config',
  WISHLIST: 'wishlist'
};

const initialConfig: AppConfig = {
  logo: 'https://via.placeholder.com/150?text=Ji+Kya+Chahiye',
  editWindowSeconds: 45,
  streetCharges: {},
  deliveryTimings: {
    'Sectors 1 & 2': { baseCharge: 100, baseMin: 10, baseMax: 15, threshold: 4, additionalPerItem: 2 },
    'Sector 3': { baseCharge: 150, baseMin: 15, baseMax: 20, threshold: 4, additionalPerItem: 3 },
    'Sector 4': { baseCharge: 200, baseMin: 20, baseMax: 30, threshold: 4, additionalPerItem: 4 },
    'VIP Sectors': { baseCharge: 200, baseMin: 20, baseMax: 30, threshold: 4, additionalPerItem: 4 },
  }
};

export const useStore = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [wishlist, setWishlist] = useState<Record<string, Item[]>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Setup subscriptions. The db.subscribe handles the initial fetch internally.
        const unsubUsers = db.subscribe(COLLECTIONS.USERS, (data) => {
          if (mounted) setUsers(data);
        });
        const unsubShops = db.subscribe(COLLECTIONS.SHOPS, (data) => {
          if (mounted) setShops(data.length ? data : INITIAL_SHOPS);
        });
        const unsubOrders = db.subscribe(COLLECTIONS.ORDERS, (data) => {
          if (mounted) setOrders(data.sort((a, b) => b.createdAt - a.createdAt));
        });
        const unsubConfig = db.subscribe(COLLECTIONS.CONFIG, (data) => {
          if (mounted && data.length) setConfig(data[0] as AppConfig);
        });

        // Small delay to allow initial data to flow in
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, 1500);

        return () => {
          mounted = false;
          unsubUsers();
          unsubShops();
          unsubOrders();
          unsubConfig();
        };
      } catch (err) {
        console.error("Store initialization failed:", err);
        if (mounted) setLoading(false);
      }
    };

    init();
  }, []);

  const login = async (mobile: string, password?: string) => {
    setSyncing(true);
    const user = users.find(u => u.mobileNumber === mobile);
    if (user && user.password === password) {
      setCurrentUser(user);
      setSyncing(false);
      return true;
    }
    setSyncing(false);
    return false;
  };

  const logout = () => setCurrentUser(null);

  const signup = async (user: User) => {
    if (users.some(u => u.mobileNumber === user.mobileNumber)) return false;
    
    setSyncing(true);
    const finalUser = {
      ...user,
      role: users.length === 0 ? UserRole.ADMIN : UserRole.CUSTOMER
    };

    await db.save(COLLECTIONS.USERS, finalUser.id, finalUser);
    setCurrentUser(finalUser);
    setSyncing(false);
    return true;
  };

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    setSyncing(true);
    const updated = { ...config, ...newConfig };
    await db.save(COLLECTIONS.CONFIG, 'main_config', updated);
    setSyncing(false);
  };

  const addShop = async (shop: Shop) => {
    setSyncing(true);
    await db.save(COLLECTIONS.SHOPS, shop.id, shop);
    setSyncing(false);
  };

  const updateShop = async (shop: Shop) => {
    setSyncing(true);
    await db.save(COLLECTIONS.SHOPS, shop.id, shop);
    setSyncing(false);
  };

  const deleteShop = async (id: string) => {
    setSyncing(true);
    await db.remove(COLLECTIONS.SHOPS, id);
    setSyncing(false);
  };

  const placeOrder = async (order: Order) => {
    setSyncing(true);
    await db.save(COLLECTIONS.ORDERS, order.id, order);
    setSyncing(false);
  };

  const updateOrder = async (order: Order) => {
    setSyncing(true);
    await db.save(COLLECTIONS.ORDERS, order.id, order);
    setSyncing(false);
  };

  const deleteOrder = async (id: string) => {
    setSyncing(true);
    await db.remove(COLLECTIONS.ORDERS, id);
    setSyncing(false);
  };

  const deleteUser = async (id: string) => {
    setSyncing(true);
    await db.remove(COLLECTIONS.USERS, id);
    setSyncing(false);
  };

  const toggleWishlist = async (userId: string, item: Item) => {
    setSyncing(true);
    const userWishlist = wishlist[userId] || [];
    const isExist = userWishlist.find(i => i.id === item.id);
    const newWishlist = isExist 
      ? userWishlist.filter(i => i.id !== item.id)
      : [...userWishlist, item];
    
    await db.save(COLLECTIONS.WISHLIST, userId, { items: newWishlist });
    setWishlist(prev => ({ ...prev, [userId]: newWishlist }));
    setSyncing(false);
  };

  const removeFromWishlist = async (userId: string, itemId: string) => {
    setSyncing(true);
    const userWishlist = wishlist[userId] || [];
    const newWishlist = userWishlist.filter(i => i.id !== itemId);
    await db.save(COLLECTIONS.WISHLIST, userId, { items: newWishlist });
    setWishlist(prev => ({ ...prev, [userId]: newWishlist }));
    setSyncing(false);
  };

  return {
    users, shops, orders, config, currentUser, wishlist, loading, syncing,
    login, logout, signup, updateConfig, addShop, updateShop, deleteShop,
    placeOrder, updateOrder, deleteOrder, deleteUser, toggleWishlist, removeFromWishlist
  };
};
