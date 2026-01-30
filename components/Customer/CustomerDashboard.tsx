
import React, { useState, useEffect } from 'react';
import { Shop, Item, Order, OrderStatus, Sector, OrderItem } from '../../types';
import Cart from './Cart';
import Wishlist from './Wishlist';

interface CustomerDashboardProps {
  store: any;
}

const OrderItemView: React.FC<{ order: Order; onEdit: (order: Order) => void }> = ({ order, onEdit }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!order.editableUntil) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((order.editableUntil! - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.editableUntil]);

  const canEdit = timeLeft > 0 && order.status === OrderStatus.PENDING;

  return (
    <div className="p-3 border border-slate-100 rounded-lg text-xs bg-white shadow-sm transition-all relative overflow-hidden">
      {canEdit && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 animate-pulse"></div>}
      <div className="flex justify-between font-bold mb-1">
        <span>#{order.id.slice(-5)}</span>
        <span className={`px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>{order.status}</span>
      </div>
      <div className="flex justify-between items-center text-slate-500 mb-2">
        <span>Rs. {order.total}</span>
        <span className="text-[10px] bg-slate-100 px-1 rounded italic">{order.estimatedDeliveryTime}</span>
      </div>
      {canEdit ? (
        <div className="space-y-2">
          <p className="text-[10px] text-amber-600 font-medium">
            <i className="fa-solid fa-circle-info mr-1"></i>
            Order is currently locked for review. You can modify it.
          </p>
          <button
            onClick={() => onEdit(order)}
            className="w-full bg-amber-600 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Modify / Cancel ({timeLeft}s)
          </button>
        </div>
      ) : order.status === OrderStatus.PENDING && (
        <p className="text-[10px] text-slate-400 italic">Modification window closed.</p>
      )}
    </div>
  );
};

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ store }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [view, setView] = useState<'home' | 'wishlist'>('home');
  const [cart, setCart] = useState<(Item & { quantity: number })[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showEditBanner, setShowEditBanner] = useState<string | null>(null);

  const userWishlist = store.wishlist[store.currentUser.id] || [];

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setShowCart(false);
  };

  const moveWishlistToCart = (item: Item) => {
    addToCart(item);
    store.removeFromWishlist(store.currentUser.id, item.id);
  };

  const calculateTotalDelivery = (sector: Sector, street: string, totalQty: number) => {
    const streetKey = `${sector}|${street}`;
    const customBase = store.config.streetCharges[streetKey];
    
    let base = 200;
    if (customBase !== undefined) {
      base = customBase;
    } else {
      let timingKey = 'VIP Sectors';
      if (sector === Sector.SECTOR_1 || sector === Sector.SECTOR_2) timingKey = 'Sectors 1 & 2';
      else if (sector === Sector.SECTOR_3) timingKey = 'Sector 3';
      else if (sector === Sector.SECTOR_4) timingKey = 'Sector 4';
      
      base = store.config.deliveryTimings[timingKey]?.baseCharge || 200;
    }
    
    // Updated Logic Match: First item free service, then Rs 10 per additional item (N-1)
    const serviceCharges = totalQty > 1 ? (totalQty - 1) * 10 : 0;
    return base + serviceCharges;
  };

  const getEstimatedDeliveryTime = (sector: Sector, itemCount: number) => {
    const timings = store.config.deliveryTimings;
    let timingKey = 'VIP Sectors';
    if (sector === Sector.SECTOR_1 || sector === Sector.SECTOR_2) timingKey = 'Sectors 1 & 2';
    else if (sector === Sector.SECTOR_3) timingKey = 'Sector 3';
    else if (sector === Sector.SECTOR_4) timingKey = 'Sector 4';

    const rule = timings[timingKey];
    let min = rule.baseMin;
    let max = rule.baseMax;

    if (itemCount > rule.threshold) {
      const extraItems = itemCount - rule.threshold;
      const extraTime = extraItems * rule.additionalPerItem;
      min += extraTime;
      max += extraTime;
    }

    return `${min}-${max} mins`;
  };

  const checkout = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const delivery = calculateTotalDelivery(
      store.currentUser.address.sector, 
      store.currentUser.address.streetNumber, 
      totalQty
    );
    const estTime = getEstimatedDeliveryTime(store.currentUser.address.sector, cart.length);
    
    const now = Date.now();
    const editWindowMs = (store.config.editWindowSeconds || 45) * 1000;

    const newOrder: Order = {
      id: `ORD-${now}`,
      customerId: store.currentUser.id,
      items: cart.map(item => ({ ...item, status: 'pending' })),
      subtotal,
      deliveryCharges: delivery,
      total: subtotal + delivery,
      status: OrderStatus.PENDING,
      createdAt: now,
      editableUntil: now + editWindowMs,
      estimatedDeliveryTime: estTime
    };

    store.placeOrder(newOrder);
    setCart([]);
    setShowCart(false);
    
    setShowEditBanner(newOrder.id);
    setTimeout(() => setShowEditBanner(null), editWindowMs);
  };

  const handleEditOrder = (order: Order) => {
    const itemsToRestore = order.items.map(it => ({
      id: it.id,
      shopId: it.shopId,
      name: it.name,
      price: it.price,
      unit: it.unit,
      unitCategory: it.unitCategory,
      image: it.image,
      quantity: it.quantity
    }));
    
    setCart(itemsToRestore);
    store.deleteOrder(order.id);
    setShowCart(true);
    setShowEditBanner(null);
  };

  const userOrders = store.orders.filter((o: Order) => o.customerId === store.currentUser.id);
  const isInWishlist = (id: string) => userWishlist.some((i: Item) => i.id === id);

  const totalCartQty = cart.reduce((s, i) => s + i.quantity, 0);
  const totalCartSubtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <div className="h-full flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Explore</h3>
          <div className="space-y-2">
            <button 
              onClick={() => { setSelectedShop(null); setView('home'); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'home' && !selectedShop ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <i className="fa-solid fa-house-chimney mr-3"></i> Home
            </button>
            <button 
              onClick={() => { setSelectedShop(null); setView('wishlist'); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'wishlist' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <i className="fa-solid fa-heart mr-3"></i> Wishlist
              {userWishlist.length > 0 && <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{userWishlist.length}</span>}
            </button>
          </div>

          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-6 mb-4">Shops</h3>
          <div className="space-y-2">
            {store.shops.map((shop: Shop) => (
              <button 
                key={shop.id}
                onClick={() => { setSelectedShop(shop); setView('home'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedShop?.id === shop.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-store mr-3"></i> {shop.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">My Orders</h3>
          <div className="space-y-3">
            {userOrders.map((order: Order) => (
              <OrderItemView key={order.id} order={order} onEdit={handleEditOrder} />
            ))}
            {userOrders.length === 0 && <p className="text-xs text-slate-400">No orders yet</p>}
          </div>
        </div>
      </aside>

      <div className="flex-1 p-6 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto">
          {showEditBanner && (
            <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-bounce-subtle">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">Order Placed Successfully!</h4>
                  <p className="text-sm text-amber-700">You have <strong>{store.config.editWindowSeconds} seconds</strong> to modify or cancel this order from the sidebar.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditBanner(null)}
                className="text-amber-400 hover:text-amber-600 p-2"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {view === 'wishlist' ? (
            <Wishlist 
              items={userWishlist} 
              onRemove={(id) => store.removeFromWishlist(store.currentUser.id, id)}
              onAddToCart={moveWishlistToCart}
            />
          ) : !selectedShop ? (
            <div>
              <div className="mb-8 p-8 bg-emerald-600 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-emerald-100">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2 urdu-font text-white">خوش آمدید!</h2>
                  <p className="opacity-90">What can we get for you today?</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <i className="fa-solid fa-shop text-emerald-500"></i>
                Explore Shops
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.shops.map((shop: Shop) => (
                  <div 
                    key={shop.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:border-emerald-300"
                    onClick={() => setSelectedShop(shop)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={shop.image} alt={shop.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                         <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/30 uppercase">{shop.type}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-slate-800">{shop.name}</h3>
                      <p className="text-slate-500 text-xs flex items-center gap-1 mt-1">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i> Open for delivery
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setSelectedShop(null)}
                className="mb-6 text-emerald-600 font-bold hover:underline flex items-center gap-2 transition-all"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to all shops
              </button>
              
              <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <img src={selectedShop.image} alt={selectedShop.name} className="h-24 w-24 rounded-2xl object-cover shadow-md border-4 border-white" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{selectedShop.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                     <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">{selectedShop.type}</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span className="text-slate-400 text-xs">{selectedShop.items.length} products available</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedShop.items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); store.toggleWishlist(store.currentUser.id, item); }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isInWishlist(item.id) ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500'}`}
                      >
                        <i className={`fa-${isInWishlist(item.id) ? 'solid' : 'regular'} fa-heart`}></i>
                      </button>
                    </div>
                    <div className="h-40 w-full overflow-hidden rounded-2xl mb-4 bg-slate-50">
                       <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-base">{item.name}</h4>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5 mb-4 uppercase tracking-tighter">{item.unit}</p>
                    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-2xl">
                      <span className="text-lg font-black text-emerald-700 ml-2">Rs. {item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-emerald-600 text-white h-10 px-5 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 font-bold text-sm shadow-md active:scale-95"
                      >
                        <i className="fa-solid fa-plus"></i> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 px-6 rounded-3xl shadow-[0_20px_50px_rgba(5,150,105,0.4)] flex items-center gap-4 hover:scale-105 transition-all z-40 active:scale-95 animate-bounce-subtle"
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-emerald-600">
              {totalCartQty}
            </span>
          </div>
          <div className="text-left">
            <div className="font-black text-lg leading-tight">Rs. {totalCartSubtotal}</div>
            <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1">
               <i className="fa-solid fa-clock"></i> {getEstimatedDeliveryTime(store.currentUser.address.sector, cart.length)}
            </div>
          </div>
        </button>
      )}

      {showCart && (
        <Cart 
          items={cart} 
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart} 
          onClose={() => setShowCart(false)} 
          onClearCart={clearCart}
          onCheckout={checkout}
          sector={store.currentUser.address.sector}
          streetNumber={store.currentUser.address.streetNumber}
          streetCharges={store.config.streetCharges}
          deliveryTimings={store.config.deliveryTimings}
          estTime={getEstimatedDeliveryTime(store.currentUser.address.sector, cart.length)}
        />
      )}
    </div>
  );
};

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING: return 'bg-amber-100 text-amber-700';
    case OrderStatus.PURCHASING: return 'bg-blue-100 text-blue-700';
    case OrderStatus.READY_FOR_DELIVERY: return 'bg-emerald-100 text-emerald-700';
    case OrderStatus.OUT_FOR_DELIVERY: return 'bg-indigo-100 text-indigo-700';
    case OrderStatus.DELIVERED: return 'bg-slate-100 text-slate-600';
    case OrderStatus.CANCELLED: return 'bg-red-100 text-red-600';
    default: return 'bg-slate-100 text-slate-600';
  }
}

export default CustomerDashboard;
