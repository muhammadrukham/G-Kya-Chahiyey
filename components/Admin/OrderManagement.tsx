
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
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Purchasing</span>
          <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready</span>
        </div>
      </div>

      <div className="space-y-4">
        {store.orders.map((order: Order) => {
          const customer = getCustomer(order.customerId);
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <span className="font-mono font-bold text-slate-400">#{order.id.slice(-5)}</span>
                  <div>
                    <p className="font-bold text-slate-800">{customer?.fullName || 'Unknown User'}</p>
                    <p className="text-xs text-slate-500">{customer?.address.sector} • House {customer?.address.houseNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <select 
                    value={order.status}
                    onChange={(e) => changeOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold border rounded px-2 py-1 bg-white"
                  >
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="text-red-500 hover:bg-red-50 p-1 px-2 rounded"><i className="fa-solid fa-trash text-sm"></i></button>
                </div>
              </div>
              
              <div className="p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left border-b">
                      <th className="pb-2 font-medium">Item</th>
                      <th className="pb-2 font-medium">Qty</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((it) => (
                      <tr key={it.id} className="text-slate-700">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {it.status === 'collected' && <i className="fa-solid fa-circle-check text-emerald-500"></i>}
                            {it.status === 'unavailable' && <i className="fa-solid fa-circle-xmark text-red-400"></i>}
                            {it.status === 'pending' && <i className="fa-regular fa-circle text-slate-300"></i>}
                            {it.name}
                          </div>
                        </td>
                        <td className="py-3">{it.quantity}</td>
                        <td className="py-3">
                          {order.status === OrderStatus.PENDING || order.status === OrderStatus.PURCHASING ? (
                            <div className="flex gap-1">
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'collected')}
                                className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase"
                              >Collected</button>
                              <button 
                                onClick={() => updateItemStatus(order.id, it.id, 'unavailable')}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase"
                              >Unavailable</button>
                            </div>
                          ) : (
                            <span className="text-xs italic text-slate-400">Locked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-emerald-50/50 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">Total Bill:</span>
                <span className="text-emerald-700">Rs. {order.total}</span>
              </div>
            </div>
          );
        })}

        {store.orders.length === 0 && (
          <div className="text-center p-20 bg-slate-50 border-2 border-dashed rounded-3xl text-slate-400">
            <i className="fa-solid fa-box-open text-4xl mb-4 block"></i>
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
