
import React from 'react';
import { Item, Sector } from '../../types';

interface CartProps {
  items: Item[];
  onRemove: (index: number) => void;
  onClose: () => void;
  onCheckout: () => void;
  sector: Sector;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onClose, onCheckout, sector }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  const calculateDelivery = () => {
    let base = 200;
    if (sector === Sector.SECTOR_1 || sector === Sector.SECTOR_2) base = 100;
    else if (sector === Sector.SECTOR_3) base = 150;
    
    const additional = items.length > 1 ? (items.length - 1) * 10 : 0;
    return base + additional;
  };

  const delivery = calculateDelivery();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-left">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg"><i className="fa-solid fa-xmark"></i></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
              <img src={item.image} className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{item.name}</h4>
                <p className="text-xs text-slate-500">Rs. {item.price}</p>
              </div>
              <button onClick={() => onRemove(idx)} className="text-red-500 hover:text-red-700 p-2">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-slate-400 mt-10">Cart is empty</p>}
        </div>

        <div className="p-6 bg-slate-50 border-t space-y-3">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery ({sector})</span>
            <span>Rs. {delivery}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t">
            <span>Total</span>
            <span className="text-emerald-700">Rs. {subtotal + delivery}</span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={onCheckout}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all mt-4"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
