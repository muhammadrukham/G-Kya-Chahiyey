
import React, { useState, useRef } from 'react';
import { Shop, Item } from '../../types';

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
      unit: 'per unit',
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
        items: editingShop.items.map(it => it.id === id ? { ...it, [field]: value } : it)
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
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-200"
        >
          Add New Shop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {store.shops.map((shop: Shop) => (
          <div key={shop.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="flex gap-4 p-4 items-center">
              <img src={shop.image || 'https://via.placeholder.com/150'} className="h-16 w-16 object-cover rounded-lg border" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{shop.name}</h3>
                <p className="text-xs text-slate-500">{shop.type} • {shop.items.length} items</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingShop(shop); setIsAddingShop(false); }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button onClick={() => handleDeleteShop(shop.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase text-slate-400">Items List</span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {shop.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.image} className="w-6 h-6 rounded object-cover border" />
                      <span>{item.name} (Rs. {item.price})</span>
                    </div>
                  </div>
                ))}
                {shop.items.length === 0 && <p className="text-center text-slate-400 text-[10px]">No items yet</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingShop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold">{isAddingShop ? 'Create New Shop' : `Editing: ${editingShop.name}`}</h3>
              <button onClick={() => setEditingShop(null)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSaveShop} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 border-b pb-2">Basic Information</h4>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Shop Name</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2 border rounded-xl"
                        value={editingShop.name}
                        onChange={e => setEditingShop({...editingShop, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Category Type</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-2 border rounded-xl"
                        placeholder="e.g. Grocery, Meat"
                        value={editingShop.type}
                        onChange={e => setEditingShop({...editingShop, type: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700 border-b pb-2">Shop Display Picture</h4>
                    <div className="flex items-center gap-6">
                      <div className="h-28 w-28 bg-slate-100 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden">
                        {editingShop.image ? <img src={editingShop.image} className="w-full h-full object-cover" /> : <i className="fa-solid fa-store text-2xl text-slate-300"></i>}
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
                          className="bg-white border-2 border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 mb-2 block w-full"
                        >
                          <i className="fa-solid fa-upload mr-2"></i> Upload Photo
                        </button>
                        {editingShop.image && (
                          <button 
                            type="button"
                            onClick={() => setEditingShop({...editingShop, image: ''})}
                            className="text-red-500 text-xs font-bold hover:underline"
                          >
                            Remove Picture
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-slate-700">Inventory Items</h4>
                    <button 
                      type="button"
                      onClick={() => addItem(editingShop)}
                      className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-200"
                    >
                      <i className="fa-solid fa-plus mr-1"></i> Add Item
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingShop.items.map((item) => (
                      <div key={item.id} className="p-4 border rounded-2xl bg-slate-50 relative flex gap-4">
                        <div className="relative group w-20 h-20 flex-shrink-0">
                           <img src={item.image} className="w-20 h-20 rounded-xl object-cover border" />
                           <button 
                              type="button"
                              onClick={() => itemFileInputRef.current[item.id]?.click()}
                              className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                           >
                              <i className="fa-solid fa-camera"></i>
                           </button>
                           <input 
                              type="file" accept="image/*" className="hidden"
                              ref={el => itemFileInputRef.current[item.id] = el}
                              onChange={(e) => handleImageUpload(e, 'item', item.id)}
                           />
                        </div>
                        <div className="flex-1 space-y-2">
                          <input 
                            type="text" placeholder="Item name"
                            className="w-full text-sm font-bold bg-transparent border-b border-slate-200 focus:border-emerald-500 outline-none"
                            value={item.name}
                            onChange={e => updateItemField(item.id, 'name', e.target.value)}
                          />
                          <div className="flex gap-2">
                            <input 
                              type="number" placeholder="Price"
                              className="w-24 text-xs p-1 border rounded"
                              value={item.price}
                              onChange={e => updateItemField(item.id, 'price', parseFloat(e.target.value))}
                            />
                            <input 
                              type="text" placeholder="Unit (per kg)"
                              className="flex-1 text-xs p-1 border rounded"
                              value={item.unit}
                              onChange={e => updateItemField(item.id, 'unit', e.target.value)}
                            />
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                        >
                          <i className="fa-solid fa-xmark text-xs"></i>
                        </button>
                      </div>
                    ))}
                    {editingShop.items.length === 0 && <p className="col-span-2 text-center py-8 text-slate-400 italic text-sm">No items in inventory. Click "Add Item" to start.</p>}
                  </div>
                </div>

                <div className="pt-6 border-t flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setEditingShop(null)} 
                    className="flex-1 py-3 rounded-xl bg-slate-100 font-bold hover:bg-slate-200"
                  >
                    Cancel Changes
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                  >
                    Save All Data
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
