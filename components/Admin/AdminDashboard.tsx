
import React, { useState } from 'react';
import { UserRole, Shop, Order, OrderStatus } from '../../types';
import UserManagement from './UserManagement';
import ShopManagement from './ShopManagement';
import OrderManagement from './OrderManagement';
import LogoManagement from './LogoManagement';

interface AdminDashboardProps {
  store: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ store }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'shops' | 'users' | 'settings'>('orders');

  return (
    <div className="h-full flex overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 text-emerald-400 font-bold text-xl urdu-font border-b border-slate-800">
          Admin Panel
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
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-gear"></i> App Branding
          </button>
        </nav>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'orders' && <OrderManagement store={store} />}
          {activeTab === 'shops' && <ShopManagement store={store} />}
          {activeTab === 'users' && <UserManagement store={store} />}
          {activeTab === 'settings' && (
            <div className="space-y-10">
              <LogoManagement store={store} />
              <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-2xl shadow-sm">
                <h3 className="font-bold mb-4 text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-mobile-screen-button text-emerald-500"></i>
                  Mobile App Installation
                </h3>
                <p className="text-sm text-slate-600 mb-4">You have enabled PWA (Progressive Web App) features. This allows your customers to install the app on their phones without needing an APK file from the Play Store.</p>
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs text-slate-700 border">
                  <p className="font-bold">How customers install:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>On Android:</strong> Click "Install App" in the header OR tap the 3-dot menu in Chrome and select "Install App".</li>
                    <li><strong>On iPhone:</strong> Open the link in Safari, tap the Share icon, and select "Add to Home Screen".</li>
                  </ul>
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
