
import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { UserRole } from './types';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CustomerDashboard from './components/Customer/CustomerDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const store = useStore();
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('To install: On Android, tap the three dots in Chrome and select "Install app". On iPhone, tap the Share button and select "Add to Home Screen".');
    }
  };

  const handleLogout = () => {
    store.logout();
    setView('login');
  };

  if (store.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 urdu-font">جی کیا چاہئیے</h2>
        <p className="text-sm text-slate-500 animate-pulse">Syncing with cloud database...</p>
      </div>
    );
  }

  if (!store.currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header 
          logo={store.config.logo} 
          onLogout={handleLogout} 
          currentUser={null} 
          onInstall={handleInstall}
          showInstall={!!deferredPrompt}
          syncing={store.syncing}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          {view === 'login' ? (
            <Login 
              onLogin={store.login} 
              onSwitch={() => setView('signup')} 
            />
          ) : (
            <Signup onSignup={store.signup} onSwitch={() => setView('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        logo={store.config.logo} 
        onLogout={handleLogout} 
        currentUser={store.currentUser}
        onInstall={handleInstall}
        showInstall={!!deferredPrompt}
        syncing={store.syncing}
      />
      <main className="flex-1 overflow-hidden">
        {store.currentUser.role === UserRole.ADMIN ? (
          <AdminDashboard store={store} />
        ) : (
          <CustomerDashboard store={store} />
        )}
      </main>
    </div>
  );
};

export default App;
