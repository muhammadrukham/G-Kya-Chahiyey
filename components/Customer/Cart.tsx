
import React from 'react';
import { Item, Sector } from '../../types';

interface CartProps {
  items: (Item & { quantity: number })[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onClose: () => void;
  onCheckout: () => void;
  sector: Sector;
  streetNumber: string;
  streetCharges: Record<string, number>;
  deliveryTimings: any;
  estTime: string;
}

const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onClearCart, 
  onClose, 
  onCheckout, 
  sector, 
  streetNumber,
  streetCharges,
  deliveryTimings,
  estTime 
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getBaseCharge = () => {
    const streetKey = `${sector}|${streetNumber}`;
    const customBase = streetCharges[streetKey];
    if (customBase !== undefined) return customBase;

    let timingKey = 'VIP Sectors';
    if (sector === Sector.SECTOR_1 || sector === Sector.SECTOR_2) timingKey = 'Sectors 1 & 2';
    else if (sector === Sector.SECTOR_3) timingKey = 'Sector 3';
    else if (sector === Sector.SECTOR_4) timingKey = 'Sector 4';

    return deliveryTimings[timingKey]?.baseCharge || 200;
  };

  const baseDelivery = getBaseCharge();
  // Updated Logic: Service charges applied only to ADDITIONAL items (n-1)
  const serviceCharges = totalItemCount > 1 ? (totalItemCount - 1) * 10 : 0;
  const totalBill = subtotal + baseDelivery + serviceCharges;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex justify-end">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Wider Cart Drawer */}
      <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl animate-slide-left overflow-hidden relative z-10">
        
        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Review Your Order</h2>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                {totalItemCount} Total {totalItemCount === 1 ? 'Unit' : 'Units'} Selected
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Dynamic Scroll Area (Items + Detailed Totals) */}
        <div className="flex-1 overflow-y-auto bg-slate-50/40 p-6 space-y-8">
          {items.length > 0 ? (
            <>
              {/* Product List Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Products</h3>
                  <button onClick={onClearCart} className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-1">
                    <i className="fa-solid fa-trash-can"></i> CLEAR CART
                  </button>
                </div>
                
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all group">
                    {/* High-Visibility Image */}
                    <div className="relative h-28 w-28 flex-shrink-0 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner">
                      <img src={item.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-black px-2 py-1 rounded-lg">
                        {item.quantity}x
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-slate-800 text-xl leading-none mb-1.5">{item.name}</h4>
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                            {item.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-emerald-700">Rs. {item.price * item.quantity}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Rs. {item.price} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {/* Larger, Robust Controls */}
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200/50">
                          <button 
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-all active:scale-90"
                          >
                            <i className="fa-solid fa-minus text-xs"></i>
                          </button>
                          <span className="w-12 text-center text-base font-black text-slate-800">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-all active:scale-90"
                          >
                            <i className="fa-solid fa-plus text-xs"></i>
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => onRemove(item.id)} 
                          className="text-slate-300 hover:text-red-500 transition-colors p-2"
                          title="Remove from cart"
                        >
                          <i className="fa-solid fa-circle-xmark text-xl"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Bill Breakdown (Scrolls with list) */}
              <div className="pt-4 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Payment Summary</h3>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between text-slate-600 items-center">
                    <span className="text-sm font-bold">Items Subtotal</span>
                    <span className="font-black text-slate-800">Rs. {subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-y border-slate-50">
                    <div>
                      <span className="text-sm font-bold text-slate-600 block">Base Delivery Fee</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">To {sector}, Street {streetNumber}</span>
                    </div>
                    <span className="font-black text-slate-800">Rs. {baseDelivery}</span>
                  </div>

                  {totalItemCount > 1 ? (
                    <div className="flex justify-between items-center bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                      <div>
                        <span className="text-sm font-bold text-amber-800 block">Additional Item Charges</span>
                        <span className="text-[10px] text-amber-600 font-bold uppercase">Rs. 10 per extra unit ({totalItemCount - 1} extra)</span>
                      </div>
                      <span className="font-black text-amber-900">Rs. {serviceCharges}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 italic">
                      <span className="text-xs text-slate-400 font-medium">Extra Item handling fee (Rs. 0)</span>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">FREE FOR 1st ITEM</span>
                    </div>
                  )}

                  <div className="bg-emerald-600 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg shadow-emerald-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl">
                        <i className="fa-solid fa-truck-fast"></i>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest block">Est. Arrival</span>
                        <p className="text-lg font-black">{estTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Extra Scroll Padding */}
              <div className="h-24"></div>
            </>
          ) : (
            <div className="text-center py-40">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <i className="fa-solid fa-basket-shopping text-4xl text-slate-200"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800">Your cart is empty</h3>
              <p className="text-sm text-slate-500 max-w-[200px] mx-auto mt-2">Find something great in our shops and add it here!</p>
              <button 
                onClick={onClose}
                className="mt-8 px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
              >
                START SHOPPING
              </button>
            </div>
          )}
        </div>

        {/* Compact Sticky Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-20 flex gap-6 items-center">
            <div className="flex-shrink-0 min-w-[140px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Final Amount</span>
              <p className="text-3xl font-black text-slate-900 leading-none mt-1">Rs. {totalBill}</p>
            </div>
            
            <button 
              type="button"
              disabled={items.length === 0}
              onClick={onCheckout}
              className="flex-1 bg-emerald-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <span>CONFIRM ORDER</span>
              <i className="fa-solid fa-chevron-right text-sm opacity-50"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
