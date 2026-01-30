
import React from 'react';
import { Order, OrderStatus, OrderItem, User } from '../../types';

interface OrderManagementProps {
  store: any;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ store }) => {
  const updateItemStatus = (orderId: string, itemId: string, status: 'collected' | 'unavailable') => {
    const order = store.orders.find((o: Order) => o.id === orderId);
    if (!order) return;

    const newItems = order.items.map((it: OrderItem) => 
      it.id === itemId ? { ...it, status } : it
    );

    const allProcessed = newItems.every((it: OrderItem) => it.status !== 'pending');
    let nextStatus = order.status;
    if (allProcessed && order.status === OrderStatus.PURCHASING) {
      nextStatus = OrderStatus.READY_FOR_DELIVERY;
    }

    store.updateOrder({ ...order, items: newItems, status: nextStatus });
  };

  const changeOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = store.orders.find((o: Order) => o.id === orderId);
    if (order) store.updateOrder({ ...order, status });
  };

  const deleteOrder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      store.deleteOrder(id);
    }
  };

  const getCustomer = (id: string) => store.users.find((u: User) => u.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Orders</h2>
          <p className="text-xs text-slate-500 font-medium">Real-time incoming customer requests</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">Pending</span>
           <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">Purchasing</span>
           <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {store.orders.map((order: Order) => {
          const customer = getCustomer(order.customerId);
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-emerald-200 transition-all">
              <div className="p-4 md:p-5 bg-slate-50/50 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center font-mono font-black text-emerald-600 shadow-sm border border-emerald-50 flex-shrink-0">
                    #{order.id.slice(-4)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm md:text-base leading-tight">{customer?.fullName || 'Guest'}</p>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 mt-0.5">
                      <i className="fa-solid fa-location-dot text-emerald-500"></i>
                      <span>{customer?.address.sector} • St {customer?.address.streetNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full md:w-auto gap-2 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => changeOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="flex-1 md:flex-none text-[10px] font-black border rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-emerald-500 outline-none uppercase tracking-widest"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors flex-shrink-0">
                    <i className="fa-solid fa-trash-can text-lg"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-4 md:p-5">
                {/* Product List - Optimized for all screens */}
                <div className="space-y-3">
                   {order.items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${it.status === 'collected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : it.status === 'unavailable' ? 'bg-red-400' : 'bg-slate-200'}`}></div>
                          <div className="min-w-0">
                            <p className="font-black text-slate-800 text-xs truncate">{it.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{it.quantity} × {it.unit}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {order.status === OrderStatus.PENDING || order.status === OrderStatus.PURCHASING ? (
                            <>
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'collected')}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${it.status === 'collected' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                              ><i className="fa-solid fa-check text-xs"></i></button>
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'unavailable')}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${it.status === 'unavailable' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                              ><i className="fa-solid fa-xmark text-xs"></i></button>
                            </>
                          ) : (
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">Locked</span>
                          )}
                        </div>
                      </div>
                   ))}
                </div>
              </div>

              <div className="p-4 md:p-5 bg-emerald-50/40 flex justify-between items-center text-[10px] md:text-xs border-t border-emerald-50">
                <div className="flex flex-col gap-1">
                   <div className="uppercase font-black text-slate-400 tracking-widest">Est: <span className="text-slate-800 ml-1">{order.estimatedDeliveryTime}</span></div>
                   <div className="uppercase font-black text-slate-400 tracking-widest">Units: <span className="text-slate-800 ml-1">{order.items.reduce((s,i) => s + i.quantity, 0)}</span></div>
                </div>
                <div className="text-right">
                   <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest block mb-0.5">Total Payable</span>
                   <span className="text-lg md:text-xl font-black text-emerald-700">Rs. {order.total}</span>
                </div>
              </div>
            </div>
          );
        })}

        {store.orders.length === 0 && (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400">
            <i className="fa-solid fa-box-open text-5xl mb-6 opacity-20 block"></i>
            <h3 className="text-lg font-black text-slate-800">No active orders</h3>
            <p className="text-sm font-medium">New orders will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
