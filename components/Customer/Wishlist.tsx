
import React from 'react';
import { Item } from '../../types';

interface WishlistProps {
  items: Item[];
  onRemove: (id: string) => void;
  onAddToCart: (item: Item) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onRemove, onAddToCart }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <i className="fa-solid fa-heart text-rose-500 text-2xl"></i>
        <h2 className="text-2xl font-bold text-slate-800">My Wishlist</h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-heart-circle-xmark text-rose-300 text-3xl"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
          <p className="text-slate-500">Items added to your wishlist will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-md transition-all">
              <div className="relative group">
                <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded-xl mb-4" />
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <h4 className="font-bold text-slate-800">{item.name}</h4>
              <p className="text-slate-500 text-sm mb-4">{item.unit}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-emerald-700">Rs. {item.price}</span>
                <button 
                  onClick={() => onAddToCart(item)}
                  className="bg-emerald-600 text-white p-2 px-4 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 font-semibold text-sm"
                >
                  <i className="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
