
import React from 'react';
import { Order, OrderStatus, OrderItem, User, UserRole } from '../../types';

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

    // Auto update order status if all items are processed
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
        <div className="flex gap-4">
          <div className="flex gap-3">
             <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending</span>
             <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Purchasing</span>
             <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ready</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {store.orders.map((order: Order) => {
          const customer = getCustomer(order.customerId);
          return (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-emerald-200 transition-colors">
              <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                <div className="flex gap-5 items-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-mono font-bold text-emerald-600 shadow-sm border border-emerald-50">
                    #{order.id.slice(-4)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base">{customer?.fullName || 'Unknown User'}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <i className="fa-solid fa-location-dot text-emerald-500"></i>
                      <span>{customer?.address.sector} • House {customer?.address.houseNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => changeOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold border rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                    <i className="fa-solid fa-trash-can text-lg"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left border-b border-slate-100">
                      <th className="pb-3 font-bold uppercase text-[10px] tracking-wider">Product Description</th>
                      <th className="pb-3 font-bold uppercase text-[10px] tracking-wider text-center">Qty / Unit</th>
                      <th className="pb-3 font-bold uppercase text-[10px] tracking-wider text-right">Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.items.map((it) => (
                      <tr key={it.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${it.status === 'collected' ? 'bg-emerald-500' : it.status === 'unavailable' ? 'bg-red-400' : 'bg-slate-200'}`}></div>
                            <span className="font-semibold text-slate-800">{it.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold text-xs">
                             {it.quantity} × {it.unit}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {order.status === OrderStatus.PENDING || order.status === OrderStatus.PURCHASING ? (
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'collected')}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${it.status === 'collected' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                              >Collect</button>
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'unavailable')}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${it.status === 'unavailable' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                              >Out</button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-5 bg-emerald-50/30 flex justify-between items-center text-sm border-t border-emerald-50">
                <div className="flex gap-4">
                   <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Est. Delivery: <span className="text-slate-800 ml-1">{order.estimatedDeliveryTime}</span></div>
                   <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Items: <span className="text-slate-800 ml-1">{order.items.reduce((s,i) => s + i.quantity, 0)}</span></div>
                </div>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Bill</span>
                   <span className="text-lg font-bold text-emerald-700">Rs. {order.total}</span>
                </div>
              </div>
            </div>
          );
        })}

        {store.orders.length === 0 && (
          <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <i className="fa-solid fa-box-open text-5xl mb-6 opacity-20 block"></i>
            <h3 className="text-lg font-bold text-slate-800">No active orders</h3>
            <p className="text-sm">New orders placed by customers will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
