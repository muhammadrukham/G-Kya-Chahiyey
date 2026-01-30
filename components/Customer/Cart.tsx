
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
  const serviceCharges = totalItemCount > 1 ? (totalItemCount - 1) * 10 : 0;
  const totalBill = subtotal + baseDelivery + serviceCharges;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[60] flex justify-end">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="w-full sm:max-w-xl bg-white h-full flex flex-col shadow-2xl animate-slide-left overflow-hidden relative z-10">
        
        <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <i className="fa-solid fa-cart-shopping text-sm"></i>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Basket</h2>
              <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">
                {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'} Ready
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-full text-slate-400"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-6 space-y-6">
          {items.length > 0 ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Products</h3>
                  <button onClick={onClearCart} className="text-[9px] font-black text-red-400 hover:text-red-600 flex items-center gap-1 uppercase tracking-tighter">
                    <i className="fa-solid fa-trash-can"></i> CLEAR
                  </button>
                </div>
                
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm transition-all group">
                    <div className="relative h-20 w-20 flex-shrink-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-50">
                      <img src={item.image} className="h-full w-full object-cover" alt={item.name} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 mr-2">
                          <h4 className="font-black text-slate-800 text-sm truncate">{item.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            {item.unit}
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900">Rs.{item.price * item.quantity}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <button 
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-all active:scale-90"
                          >
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="w-8 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-600 rounded-lg shadow-sm transition-all active:scale-90"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>

                        <button 
                          type="button"
                          onClick={() => onRemove(item.id)} 
                          className="text-slate-200 hover:text-red-500 transition-colors p-2"
                        >
                          <i className="fa-solid fa-circle-xmark text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Bill Summary</h3>
                <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between text-slate-600 items-center">
                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-black text-slate-900">Rs. {subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-y border-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-600 block uppercase tracking-widest">Delivery Fee</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{sector}, St {streetNumber}</span>
                    </div>
                    <span className="font-black text-slate-900">Rs. {baseDelivery}</span>
                  </div>

                  {totalItemCount > 1 && (
                    <div className="flex justify-between items-center bg-amber-50/50 p-4 rounded-2xl border border-amber-50">
                      <div>
                        <span className="text-xs font-bold text-amber-800 block uppercase tracking-widest">Service Charge</span>
                        <span className="text-[9px] text-amber-600 font-bold uppercase">Rs. 10 × {totalItemCount - 1} Units</span>
                      </div>
                      <span className="font-black text-amber-900">Rs. {serviceCharges}</span>
                    </div>
                  )}

                  <div className="bg-slate-900 p-5 rounded-3xl text-white flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                        <i className="fa-solid fa-truck-fast text-emerald-400"></i>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-widest block">Est. Time</span>
                        <p className="text-sm font-black">{estTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-20"></div>
            </>
          ) : (
            <div className="text-center py-32 md:py-48">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <i className="fa-solid fa-basket-shopping text-3xl text-slate-200"></i>
              </div>
              <h3 className="text-lg font-black text-slate-800">Your basket is empty</h3>
              <p className="text-xs text-slate-500 mt-2 px-10">Choose from thousands of fresh products in our stores.</p>
              <button 
                onClick={onClose}
                className="mt-8 px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 text-xs tracking-widest"
              >
                GO SHOPPING
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 md:p-6 bg-white border-t border-slate-50 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] z-20 flex gap-4 md:gap-6 items-center pb-safe">
            <div className="flex-shrink-0 min-w-[100px] md:min-w-[140px]">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block">TOTAL BILL</span>
              <p className="text-2xl md:text-3xl font-black text-slate-900 leading-none mt-1">Rs. {totalBill}</p>
            </div>
            
            <button 
              type="button"
              onClick={onCheckout}
              className="flex-1 bg-emerald-600 text-white py-4 md:py-5 rounded-[2rem] font-black text-lg md:text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>CONFIRM</span>
              <i className="fa-solid fa-chevron-right text-xs opacity-50"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
