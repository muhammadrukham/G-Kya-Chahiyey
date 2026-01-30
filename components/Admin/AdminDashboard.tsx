
import React, { useState } from 'react';
import { UserRole, Shop, Order, OrderStatus } from '../../types';
import UserManagement from './UserManagement';
import ShopManagement from './ShopManagement';
import OrderManagement from './OrderManagement';
import LogoManagement from './LogoManagement';
import DeliveryManagement from './DeliveryManagement';
import { updateSupabaseConfig, resetSupabaseConfig } from '../../services/supabase';

interface AdminDashboardProps {
  store: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'shops' | 'users' | 'delivery' | 'settings'>('orders');
  const [customUrl, setCustomUrl] = useState(localStorage.getItem('JKC_SUPABASE_URL') || '');
  const [customKey, setCustomKey] = useState(localStorage.getItem('JKC_SUPABASE_KEY') || '');

  const handleConnectCloud = () => {
    if (!customUrl || !customKey) {
      alert('Please enter both Supabase URL and Anon Key.');
      return;
    }
    if (confirm('The app will reload to connect to the new database. Proceed?')) {
      updateSupabaseConfig(customUrl, customKey);
    }
  };

  const handleResetCloud = () => {
    if (confirm('Reset to default demo database? App will reload.')) {
      resetSupabaseConfig();
    }
  };

  const isCustom = !!localStorage.getItem('JKC_SUPABASE_URL');

  return (
    <div className="h-full flex overflow-hidden">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <i className="fa-solid fa-shield-halved"></i>
             </div>
             <span className="font-bold text-white urdu-font">ایڈمن پینل</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-box"></i> Orders
          </button>
          <button 
            onClick={() => setActiveTab('shops')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'shops' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-store"></i> Shops & Items
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'users' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-users"></i> User Management
          </button>
          <button 
            onClick={() => setActiveTab('delivery')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'delivery' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-clock"></i> Delivery Timing
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-cloud-bolt"></i> App & Cloud
          </button>
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'orders' && <OrderManagement store={store} />}
          {activeTab === 'shops' && <ShopManagement store={store} />}
          {activeTab === 'users' && <UserManagement store={store} />}
          {activeTab === 'delivery' && <DeliveryManagement store={store} />}
          {activeTab === 'settings' && (
            <div className="space-y-10">
              <LogoManagement store={store} />
              
              <div className="bg-white p-8 rounded-3xl border border-blue-200 max-w-2xl shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                   <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${isCustom ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {isCustom ? 'Private Cloud Active' : 'Demo Mode Active'}
                   </div>
                </div>
                <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-earth-americas text-blue-500"></i>
                  Supabase Cloud Control Center
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Connect your own **Supabase Project** to enable private multi-user sync. 
                  All customer orders and accounts will be saved to your private database.
                </p>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Supabase Project URL</label>
                      <input 
                        type="text" 
                        placeholder="https://xyz.supabase.co" 
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Supabase Anon (Public) Key</label>
                      <input 
                        type="password" 
                        placeholder="Your public anon key..." 
                        value={customKey}
                        onChange={(e) => setCustomKey(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleConnectCloud}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                      Save & Reconnect
                    </button>
                    {isCustom && (
                      <button 
                        onClick={handleResetCloud}
                        className="px-6 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        Reset to Demo
                      </button>
                    )}
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-black text-slate-800 mb-3 uppercase flex items-center gap-2">
                      <i className="fa-solid fa-circle-info text-blue-400"></i> Setup Checklist
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-500">
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-check text-emerald-500"></i>
                        <span>Create project at <strong>supabase.com</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-check text-emerald-500"></i>
                        <span>Run the SQL Script in <strong>SQL Editor</strong></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <i className="fa-solid fa-check text-emerald-500"></i>
                        <span>Copy URL/Key from <strong>Settings {' > '} API</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-mobile-screen-button text-emerald-500"></i>
                  Native App Build (Android/iOS)
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  This app is optimized for **Capacitor**. You can convert this code into a real APK or iOS app to share with your customers.
                </p>
                <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl space-y-3 text-[11px] font-mono mb-6 overflow-x-auto shadow-inner">
                  <p className="opacity-50"># Command sequence to build APK</p>
                  <p>npm run build</p>
                  <p>npx cap sync</p>
                  <p>npx cap open android</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <i className="fa-solid fa-lightbulb text-amber-400"></i>
                  Note: Remember to update your logo in the Branding tab before building.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
