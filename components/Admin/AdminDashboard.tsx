
import React, { useState } from 'react';
import { UserRole, Shop, Order, OrderStatus } from '../../types';
import UserManagement from './UserManagement';
import ShopManagement from './ShopManagement';
import OrderManagement from './OrderManagement';
import LogoManagement from './LogoManagement';
import DeliveryManagement from './DeliveryManagement';

interface AdminDashboardProps {
  store: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'shops' | 'users' | 'delivery' | 'settings'>('orders');

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
                   <div className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Cloud Ready</div>
                </div>
                <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-earth-americas text-blue-500"></i>
                  Multi-User Cloud Setup
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  To allow multiple customers and the admin to see each other's data in real-time, you need a **Cloud Database**. The app is currently using your phone's memory (Local Storage).
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">Step 1: Create a Database</h4>
                    <p className="text-xs text-slate-500">Sign up for a free account at <strong>Firebase.google.com</strong> or <strong>Supabase.com</strong>.</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">Step 2: Connect Key</h4>
                    <div className="flex gap-2">
                       <input 
                         type="password" 
                         placeholder="Enter your Cloud API Key..." 
                         className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Connect</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-mobile-screen-button text-emerald-500"></i>
                  Mobile App (APK) Generation
                </h3>
                <p className="text-sm text-slate-600 mb-4">The code is optimized for native conversion using Capacitor.</p>
                <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl space-y-3 text-xs font-mono mb-6 overflow-x-auto">
                  <p># Sync code to Android Studio</p>
                  <p>npm run build</p>
                  <p>npx cap sync</p>
                  <p>npx cap open android</p>
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
