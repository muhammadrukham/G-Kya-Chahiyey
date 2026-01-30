
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
    <div className="p-4 border border-slate-100 rounded-2xl text-xs bg-white shadow-sm transition-all relative overflow-hidden">
      {canEdit && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400 animate-pulse"></div>}
      <div className="flex justify-between font-bold mb-2">
        <span className="text-slate-400">Order #{order.id.slice(-5)}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
      </div>
      <div className="flex justify-between items-center text-slate-800 mb-3">
        <span className="font-black text-sm">Rs. {order.total}</span>
        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg italic font-medium">Est: {order.estimatedDeliveryTime}</span>
      </div>
      {canEdit ? (
        <div className="space-y-2 mt-2 pt-2 border-t border-slate-50">
          <p className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
            <i className="fa-solid fa-circle-info"></i>
            HURRY! EDITABLE FOR {timeLeft}s
          </p>
          <button
            onClick={() => onEdit(order)}
            className="w-full bg-amber-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors shadow-md shadow-amber-100"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Modify / Cancel
          </button>
        </div>
      ) : order.status === OrderStatus.PENDING && (
        <p className="text-[10px] text-slate-400 italic text-center border-t border-slate-50 pt-2">Modification window closed.</p>
      )}
    </div>
  );
};

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ store }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [view, setView] = useState<'home' | 'wishlist' | 'orders'>('home');
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
    setView('orders');
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
    <div className="h-full flex flex-col relative pb-20 md:pb-0">
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Explore</h3>
            <div className="space-y-1">
              <button 
                onClick={() => { setSelectedShop(null); setView('home'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'home' && !selectedShop ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-house-chimney mr-3"></i> Home
              </button>
              <button 
                onClick={() => { setSelectedShop(null); setView('wishlist'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'wishlist' ? 'bg-rose-50 text-rose-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-heart mr-3"></i> Wishlist
                {userWishlist.length > 0 && <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{userWishlist.length}</span>}
              </button>
              <button 
                onClick={() => { setSelectedShop(null); setView('orders'); }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${view === 'orders' ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <i className="fa-solid fa-receipt mr-3"></i> My Orders
                {userOrders.length > 0 && <span className="ml-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{userOrders.length}</span>}
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4">Shops</h3>
            <div className="space-y-1">
              {store.shops.map((shop: Shop) => (
                <button 
                  key={shop.id}
                  onClick={() => { setSelectedShop(shop); setView('home'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedShop?.id === shop.id ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <i className="fa-solid fa-store mr-3"></i> {shop.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            
            {showEditBanner && view !== 'orders' && (
              <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between shadow-sm animate-bounce-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Order Placed!</h4>
                    <p className="text-xs text-amber-700">Check "My Orders" to modify or cancel.</p>
                  </div>
                </div>
                <button onClick={() => setShowEditBanner(null)} className="text-amber-400 p-2"><i className="fa-solid fa-xmark"></i></button>
              </div>
            )}

            {view === 'orders' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-receipt text-blue-600 text-2xl"></i>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Purchase History</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userOrders.map((order: Order) => (
                    <OrderItemView key={order.id} order={order} onEdit={handleEditOrder} />
                  ))}
                  {userOrders.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                       <i className="fa-solid fa-box-open text-4xl text-slate-200 mb-4 block"></i>
                       <p className="text-slate-400 font-bold">No orders found.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : view === 'wishlist' ? (
              <Wishlist 
                items={userWishlist} 
                onRemove={(id) => store.removeFromWishlist(store.currentUser.id, id)}
                onAddToCart={moveWishlistToCart}
              />
            ) : !selectedShop ? (
              <div className="space-y-8">
                <div className="p-6 md:p-10 bg-emerald-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-emerald-100">
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-4xl font-black mb-2 urdu-font text-white">خوش آمدید، {store.currentUser.fullName.split(' ')[0]}!</h2>
                    <p className="opacity-90 font-medium text-sm md:text-base">Ready for some fresh items today?</p>
                  </div>
                  <div className="absolute top-0 right-0 w-48 h-48 md:w-80 md:h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 px-1">
                    <i className="fa-solid fa-shop text-emerald-500"></i>
                    Nearby Shops
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {store.shops.map((shop: Shop) => (
                      <div 
                        key={shop.id} 
                        className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer group hover:border-emerald-200 shadow-sm"
                        onClick={() => setSelectedShop(shop)}
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img src={shop.image} alt={shop.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                             <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">{shop.type}</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-black text-xl text-slate-800 leading-tight">{shop.name}</h3>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Open
                            </p>
                            <span className="text-slate-400 text-[10px] font-bold">{shop.items.length} items</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedShop(null)}
                  className="group mb-2 px-4 py-2 bg-white rounded-xl text-emerald-600 font-black text-sm hover:bg-emerald-50 transition-all border border-slate-100 flex items-center gap-2 w-fit shadow-sm"
                >
                  <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> BACK TO SHOPS
                </button>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <img src={selectedShop.image} alt={selectedShop.name} className="h-20 w-20 md:h-32 md:w-32 rounded-3xl object-cover shadow-xl border-4 border-white flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">{selectedShop.type}</span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{selectedShop.name}</h2>
                    <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium italic">Hand-picked fresh items from {selectedShop.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {selectedShop.items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all group relative overflow-hidden shadow-sm">
                      <div className="absolute top-4 right-4 z-10">
                        <button 
                          onClick={(e) => { e.stopPropagation(); store.toggleWishlist(store.currentUser.id, item); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${isInWishlist(item.id) ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-md text-slate-300 hover:text-rose-500 hover:scale-110'}`}
                        >
                          <i className={`fa-${isInWishlist(item.id) ? 'solid' : 'regular'} fa-heart`}></i>
                        </button>
                      </div>
                      <div className="h-40 md:h-48 w-full overflow-hidden rounded-2xl mb-4 bg-slate-50 border border-slate-50 shadow-inner">
                         <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="px-1">
                        <h4 className="font-black text-slate-800 text-lg leading-tight">{item.name}</h4>
                        <p className="text-slate-400 text-[10px] font-black mt-1 mb-4 uppercase tracking-[0.15em]">{item.unit}</p>
                        <div className="flex justify-between items-center bg-slate-50/80 p-3 rounded-2xl border border-slate-100/50">
                          <span className="text-xl font-black text-slate-900">Rs. {item.price}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-emerald-600 text-white h-11 px-6 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 font-black text-xs shadow-lg shadow-emerald-100 active:scale-90"
                          >
                            <i className="fa-solid fa-cart-plus"></i> ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
        <button 
          onClick={() => { setSelectedShop(null); setView('home'); }}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'home' && !selectedShop ? 'text-emerald-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-house-chimney text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button 
          onClick={() => { setSelectedShop(null); setView('wishlist'); }}
          className={`flex flex-col items-center gap-1 transition-all relative ${view === 'wishlist' ? 'text-rose-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-heart text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Wishlist</span>
          {userWishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{userWishlist.length}</span>}
        </button>
        <button 
          onClick={() => { setSelectedShop(null); setView('orders'); }}
          className={`flex flex-col items-center gap-1 transition-all relative ${view === 'orders' ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-receipt text-xl"></i>
          <span className="text-[10px] font-black uppercase tracking-tighter">Orders</span>
          {userOrders.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{userOrders.length}</span>}
        </button>
      </nav>

      {/* Floating Cart Button (Mobile Optimized) */}
      {cart.length > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 bg-emerald-600 text-white p-4 px-6 rounded-[2rem] shadow-[0_20px_40px_rgba(5,150,105,0.3)] flex items-center gap-4 hover:scale-105 transition-all z-40 active:scale-95 animate-bounce-subtle border-4 border-white/20 backdrop-blur-sm"
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-2xl"></i>
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-4 border-emerald-600">
              {totalCartQty}
            </span>
          </div>
          <div className="text-left">
            <div className="font-black text-lg leading-tight">Rs. {totalCartSubtotal}</div>
            <div className="text-[9px] font-bold opacity-80 uppercase tracking-[0.1em] flex items-center gap-1">
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
