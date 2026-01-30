
import React, { useState } from 'react';
import { User, UserRole, Sector } from '../../types';

interface UserManagementProps {
  store: any;
}

const UserManagement: React.FC<UserManagementProps> = ({ store }) => {
  const [editingStreet, setEditingStreet] = useState<{ sector: Sector, street: string, current: number } | null>(null);
  const [newCharge, setNewCharge] = useState<number>(0);

  const handleUpdateStreetCharge = () => {
    if (!editingStreet) return;
    const key = `${editingStreet.sector}|${editingStreet.street}`;
    const streetCharges = { ...store.config.streetCharges, [key]: newCharge };
    store.updateConfig({ streetCharges });
    setEditingStreet(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr className="text-left text-xs font-bold text-slate-400 uppercase">
              <th className="p-4">Name</th>
              <th className="p-4">Mobile</th>
              <th className="p-4">Role</th>
              <th className="p-4">Address</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {store.users.map((user: User) => {
              const streetKey = `${user.address.sector}|${user.address.streetNumber}`;
              const customCharge = store.config.streetCharges[streetKey];
              
              return (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{user.fullName}</td>
                  <td className="p-4">{user.mobileNumber}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    <p>{user.address.sector}</p>
                    <p className="text-slate-400">Street {user.address.streetNumber}, House {user.address.houseNumber}</p>
                    {customCharge !== undefined && (
                      <span className="inline-block mt-1 bg-amber-50 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-100">
                        Custom Charge: Rs. {customCharge}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingStreet({ 
                            sector: user.address.sector, 
                            street: user.address.streetNumber,
                            current: customCharge || 0 
                          });
                          setNewCharge(customCharge || 0);
                        }}
                        className="text-emerald-500 hover:text-emerald-700 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Set Base Charge for this Street"
                      >
                        <i className="fa-solid fa-coins"></i>
                      </button>
                      <button 
                        onClick={() => { if(confirm('Delete user?')) store.deleteUser(user.id); }}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editingStreet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border animate-bounce-subtle">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Street Delivery Charge</h3>
            <p className="text-xs text-slate-500 mb-6">
              Setting charge for <span className="font-bold text-slate-700">{editingStreet.sector} - Street {editingStreet.street}</span>. This applies to all users on this street.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Base Price (Rs.)</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold"
                  value={newCharge}
                  onChange={e => setNewCharge(parseInt(e.target.value) || 0)}
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingStreet(null)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStreetCharge}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                  Save Charge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
