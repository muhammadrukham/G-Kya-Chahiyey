
import React, { useState, useRef } from 'react';
import { Shop, Item, UnitCategory } from '../../types';
import { UNIT_OPTIONS } from '../../constants';

interface ShopManagementProps {
  store: any;
}

const ShopManagement: React.FC<ShopManagementProps> = ({ store }) => {
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [isAddingShop, setIsAddingShop] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemFileInputRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleDeleteShop = (id: string) => {
    if (confirm('Delete this shop?')) store.deleteShop(id);
  };

  const handleSaveShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShop) {
      if (isAddingShop) store.addShop(editingShop);
      else store.updateShop(editingShop);
      setEditingShop(null);
      setIsAddingShop(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'shop' | 'item', itemId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'shop' && editingShop) {
          setEditingShop({ ...editingShop, image: base64String });
        } else if (type === 'item' && itemId && editingShop) {
          const newItems = editingShop.items.map(it => it.id === itemId ? { ...it, image: base64String } : it);
          setEditingShop({ ...editingShop, items: newItems });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (shop: Shop) => {
    const newItem: Item = {
      id: `it-${Date.now()}`,
      shopId: shop.id,
      name: 'New Item',
      price: 0,
      unit: 'Piece',
      unitCategory: UnitCategory.COUNT,
      image: 'https://via.placeholder.com/150'
    };
    if (editingShop?.id === shop.id) {
       setEditingShop({...editingShop, items: [...editingShop.items, newItem]});
    } else {
       store.updateShop({ ...shop, items: [...shop.items, newItem] });
    }
  };

  const removeItem = (id: string) => {
    if (editingShop) {
      setEditingShop({ ...editingShop, items: editingShop.items.filter(it => it.id !== id) });
    }
  };

  const updateItemField = (id: string, field: keyof Item, value: any) => {
    if (editingShop) {
      setEditingShop({
        ...editingShop,
        items: editingShop.items.map(it => {
          if (it.id === id) {
            const updated = { ...it, [field]: value };
            // If category changes, reset unit to first valid option
            if (field === 'unitCategory') {
              updated.unit = UNIT_OPTIONS[value as UnitCategory][0];
            }
            return updated;
          }
          return it;
        })
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Shop Management</h2>
        <button 
          onClick={() => {
            setEditingShop({ id: Date.now().toString(), name: '', type: '', image: '', items: [] });
            setIsAddingShop(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors"
        >
          Add New Shop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {store.shops.map((shop: Shop) => (
          <div key={shop.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 p-4 items-center">
              <img src={shop.image || 'https://via.placeholder.com/150'} className="h-16 w-16 object-cover rounded-xl border shadow-sm" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{shop.name}</h3>
                <p className="text-xs text-slate-500">{shop.type} • {shop.items.length} items</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => { setEditingShop(shop); setIsAddingShop(false); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => handleDeleteShop(shop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Inventory Preview</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {shop.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100 text-[11px] shadow-sm">
                    <div className="flex items-center gap-2">
                      <img src={item.image} className="w-7 h-7 rounded-lg object-cover border" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-700">Rs. {item.price}</p>
                      <p className="text-[9px] text-slate-400">{item.unit}</p>
                    </div>
                  </div>
                ))}
                {shop.items.length === 0 && <p className="text-center text-slate-400 text-[10px] py-4 italic">No items yet</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingShop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{isAddingShop ? 'Create New Shop' : `Edit Shop: ${editingShop.name}`}</h3>
                <p className="text-xs text-slate-500">Configure shop details and inventory pricing</p>
              </div>
              <button onClick={() => setEditingShop(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <form onSubmit={handleSaveShop} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm border-b pb-2">
                      <i className="fa-solid fa-circle-info text-emerald-500"></i> Basic Information
                    </h4>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Shop Name</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={editingShop.name}
                        onChange={e => setEditingShop({...editingShop, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ml-1">Category Type</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="e.g. Grocery, Meat"
                        value={editingShop.type}
                        onChange={e => setEditingShop({...editingShop, type: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm border-b pb-2">
                      <i className="fa-solid fa-camera text-emerald-500"></i> Shop Display Picture
                    </h4>
                    <div className="flex items-center gap-6">
                      <div className="h-32 w-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner relative group">
                        {editingShop.image ? <img src={editingShop.image} className="w-full h-full object-cover" /> : <i className="fa-solid fa-store text-3xl text-slate-300"></i>}
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                      </div>
                      <div className="flex-1">
                        <input 
                          type="file" accept="image/*" 
                          className="hidden" ref={fileInputRef}
                          onChange={(e) => handleImageUpload(e, 'shop')}
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 mb-2 block w-full shadow-sm"
                        >
                          <i className="fa-solid fa-upload mr-2"></i> Upload Banner
                        </button>
                        {editingShop.image && (
                          <button 
                            type="button"
                            onClick={() => setEditingShop({...editingShop, image: ''})}
                            className="text-red-500 text-[10px] font-bold hover:underline ml-1"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                      <i className="fa-solid fa-boxes-stacked text-emerald-500"></i> Inventory Items
                    </h4>
                    <button 
                      type="button"
                      onClick={() => addItem(editingShop)}
                      className="text-[11px] bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                    >
                      <i className="fa-solid fa-plus mr-1"></i> New Item
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {editingShop.items.map((item) => (
                      <div key={item.id} className="p-4 border border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors relative flex gap-4">
                        <div className="relative group w-24 h-24 flex-shrink-0">
                           <img src={item.image} className="w-full h-full rounded-2xl object-cover border border-slate-200 shadow-sm" />
                           <button 
                              type="button"
                              onClick={() => itemFileInputRef.current[item.id]?.click()}
                              className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
                           >
                              <i className="fa-solid fa-camera"></i>
                           </button>
                           {/* Fix: Wrap ref assignment in braces to return void and avoid TypeScript error */}
                           <input 
                              type="file" accept="image/*" className="hidden"
                              ref={el => { itemFileInputRef.current[item.id] = el; }}
                              onChange={(e) => handleImageUpload(e, 'item', item.id)}
                           />
                        </div>
                        <div className="flex-1 space-y-3">
                          <input 
                            type="text" placeholder="Item name"
                            className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none transition-colors"
                            value={item.name}
                            onChange={e => updateItemField(item.id, 'name', e.target.value)}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                               <label className="text-[9px] font-bold text-slate-400 block ml-1">Price (Rs.)</label>
                               <input 
                                  type="number" 
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                                  value={item.price}
                                  onChange={e => updateItemField(item.id, 'price', parseFloat(e.target.value) || 0)}
                               />
                            </div>
                            <div>
                               <label className="text-[9px] font-bold text-slate-400 block ml-1">Category</label>
                               <select 
                                  className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                                  value={item.unitCategory}
                                  onChange={e => updateItemField(item.id, 'unitCategory', e.target.value as UnitCategory)}
                               >
                                  {Object.values(UnitCategory).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                               </select>
                            </div>
                          </div>
                          <div>
                             <label className="text-[9px] font-bold text-slate-400 block ml-1">Specific Unit</label>
                             <select 
                                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                                value={item.unit}
                                onChange={e => updateItemField(item.id, 'unit', e.target.value)}
                             >
                                {UNIT_OPTIONS[item.unitCategory].map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                             </select>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 border border-red-100 shadow-sm transition-colors"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      </div>
                    ))}
                    {editingShop.items.length === 0 && <p className="col-span-2 text-center py-12 text-slate-400 italic text-sm border-2 border-dashed rounded-3xl">Your inventory is currently empty. Click "New Item" to start adding products.</p>}
                  </div>
                </div>

                <div className="pt-8 border-t flex gap-4 pb-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingShop(null)} 
                    className="flex-1 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
                  >
                    Save Shop & Items
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;
