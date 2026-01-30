
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  logo: string;
  onLogout: () => void;
  currentUser: User | null;
  onInstall: () => void;
  showInstall: boolean;
  syncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, onLogout, currentUser, onInstall, showInstall, syncing }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
          {syncing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-emerald-600 urdu-font">جی کیا چاہئیے</h1>
          {syncing && <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Syncing...</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {showInstall && (
          <button 
            onClick={onInstall}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-200"
          >
            <i className="fa-solid fa-download"></i>
            <span className="hidden xs:inline">Install App</span>
          </button>
        )}

        {currentUser && (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{currentUser.fullName}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
