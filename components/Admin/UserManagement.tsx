
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">User Directory</h2>
          <p className="text-xs text-slate-500 font-medium">Manage accounts and delivery overrides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {store.users.map((user: User) => {
          const streetKey = `${user.address.sector}|${user.address.streetNumber}`;
          const customCharge = store.config.streetCharges[streetKey];
          
          return (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-lg border border-slate-100">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 leading-none">{user.fullName}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold tracking-widest mt-1.5 uppercase">{user.mobileNumber}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${user.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                  {user.role}
                </span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs">
                  <i className="fa-solid fa-location-dot text-slate-300 w-4"></i>
                  <div className="font-medium text-slate-600">
                    {user.address.sector} • St {user.address.streetNumber}, H {user.address.houseNumber}
                  </div>
                </div>
                
                {customCharge !== undefined ? (
                  <div className="bg-amber-50 text-amber-700 text-[10px] font-black px-3 py-2 rounded-xl border border-amber-100 flex items-center justify-between">
                    <span>STREET CHARGE OVERRIDE</span>
                    <span className="bg-white px-2 py-0.5 rounded-lg shadow-sm border border-amber-100">Rs. {customCharge}</span>
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">Using Sector Default Timing</div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => {
                    setEditingStreet({ 
                      sector: user.address.sector, 
                      street: user.address.streetNumber,
                      current: customCharge || 0 
                    });
                    setNewCharge(customCharge || 0);
                  }}
                  className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-coins"></i> Manage Fees
                </button>
                <button 
                  onClick={() => { if(confirm('Delete user?')) store.deleteUser(user.id); }}
                  className="w-11 h-11 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {store.users.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
           <p className="text-slate-400 font-bold">No registered users found.</p>
        </div>
      )}

      {editingStreet && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border animate-slide-up">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Street Fee Policy</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
              Define the delivery cost for all houses in <span className="text-emerald-600 font-black">{editingStreet.sector} - Street {editingStreet.street}</span>.
            </p>
            
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2.5 ml-1">Fixed Base Price (Rs.)</label>
                <input 
                  type="number"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none text-2xl font-black text-slate-900"
                  value={newCharge}
                  onChange={e => setNewCharge(parseInt(e.target.value) || 0)}
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setEditingStreet(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >Cancel</button>
                <button 
                  onClick={handleUpdateStreetCharge}
                  className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]"
                >Save Policy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
