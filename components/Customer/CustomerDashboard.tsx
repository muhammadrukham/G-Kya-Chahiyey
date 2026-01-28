
import React, { useState } from 'react';
import { Shop, Item, Order, OrderStatus, Sector } from '../../types';
import Cart from './Cart';
import Wishlist from './Wishlist';

interface CustomerDashboardProps {
  store: any;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ store }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [view, setView] = useState<'home' | 'wishlist'>('home');
  const [cart, setCart] = useState<Item[]>([]);
  const [showCart, setShowCart] = useState(false);

  const userWishlist = store.wishlist[store.currentUser.id] || [];

  const addToCart = (item: Item) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const moveWishlistToCart = (item: Item) => {
    addToCart(item);
    store.removeFromWishlist(store.currentUser.id, item.id);
  };

  const calculateDeliveryCharges = (sector: Sector, itemCount: number) => {
    let base = 200;
    if (sector === Sector.SECTOR_1 || sector === Sector.SECTOR_2) base = 100;
    else if (sector === Sector.SECTOR_3) base = 150;
    
    const additional = itemCount > 1 ? (itemCount - 1) * 10 : 0;
    return base + additional;
  };

  const checkout = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const delivery = calculateDeliveryCharges(store.currentUser.address.sector, cart.length);
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerId: store.currentUser.id,
      items: cart.map(item => ({ ...item, quantity: 1, status: 'pending' })),
      subtotal,
      deliveryCharges: delivery,
      total: subtotal + delivery,
      status: OrderStatus.PENDING,
      createdAt: Date.now(),
    };

    store.placeOrder(newOrder);
    setCart([]);
    setShowCart(false);
    alert('Order placed successfully!');
  };

  const userOrders = store.orders.filter((o: Order) => o.customerId === store.currentUser.id);

  const isInWishlist = (id: string) => userWishlist.some((i: Item) => i.id === id);

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Sidebar navigation */}
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
              <div key={order.id} className="p-3 border border-slate-100 rounded-lg text-xs">
                <div className="flex justify-between font-bold mb-1">
                  <span>#{order.id.slice(-5)}</span>
                  <span className={`px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="text-slate-500">Rs. {order.total}</div>
              </div>
            ))}
            {userOrders.length === 0 && <p className="text-xs text-slate-400">No orders yet</p>}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto relative">
        <div className="max-w-5xl mx-auto">
          {view === 'wishlist' ? (
            <Wishlist 
              items={userWishlist} 
              onRemove={(id) => store.removeFromWishlist(store.currentUser.id, id)}
              onAddToCart={moveWishlistToCart}
            />
          ) : !selectedShop ? (
            <div>
              <div className="mb-8 p-8 bg-emerald-600 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2 urdu-font">خوش آمدید!</h2>
                  <p className="opacity-90">What can we get for you today?</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
              </div>

              <h2 className="text-xl font-bold text-slate-800 mb-6">Explore Shops</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.shops.map((shop: Shop) => (
                  <div 
                    key={shop.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => setSelectedShop(shop)}
                  >
                    <div className="relative">
                      <img src={shop.image} alt={shop.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-slate-800">{shop.name}</h3>
                      <p className="text-slate-500 text-sm">{shop.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button 
                onClick={() => setSelectedShop(null)}
                className="mb-6 text-emerald-600 font-medium hover:underline flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i> Back to all shops
              </button>
              
              <div className="flex items-center gap-6 mb-8">
                <img src={selectedShop.image} alt={selectedShop.name} className="h-24 w-24 rounded-2xl object-cover shadow-md" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{selectedShop.name}</h2>
                  <p className="text-slate-500">{selectedShop.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedShop.items.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all group relative">
                    <div className="absolute top-6 right-6 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); store.toggleWishlist(store.currentUser.id, item); }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isInWishlist(item.id) ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-rose-500'}`}
                      >
                        <i className={`fa-${isInWishlist(item.id) ? 'solid' : 'regular'} fa-heart`}></i>
                      </button>
                    </div>
                    <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded-xl mb-4" />
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <p className="text-slate-500 text-sm mb-4">{item.unit}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-700">Rs. {item.price}</span>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-emerald-100 text-emerald-700 p-2 px-4 rounded-xl hover:bg-emerald-200 transition-colors flex items-center gap-2 font-semibold"
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

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 px-6 rounded-2xl shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform z-40"
        >
          <div className="relative">
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-600">{cart.length}</span>
          </div>
          <span className="font-bold">View Cart • Rs. {cart.reduce((s, i) => s + i.price, 0)}</span>
        </button>
      )}

      {showCart && (
        <Cart 
          items={cart} 
          onRemove={removeFromCart} 
          onClose={() => setShowCart(false)} 
          onCheckout={checkout}
          sector={store.currentUser.address.sector}
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
    default: return 'bg-slate-100 text-slate-600';
  }
}

export default CustomerDashboard;
