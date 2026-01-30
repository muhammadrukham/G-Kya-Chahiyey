
import React from 'react';
import { User, UserRole } from '../types';

interface HeaderProps {
  logo: string;
  onLogout: () => void;
  currentUser: User | null;
  onInstall: () => void;
  showInstall: boolean;
  syncing?: boolean;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ logo, onLogout, currentUser, onInstall, showInstall, syncing, onMenuToggle }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        {currentUser?.role === UserRole.ADMIN && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        )}
        <div className="relative">
          <img src={logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-lg" />
          {syncing && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-emerald-600 urdu-font leading-tight">جی کیا چاہئیے</h1>
          {syncing && <p className="text-[7px] md:text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">Syncing...</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        {showInstall && (
          <button 
            onClick={onInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-200"
          >
            <i className="fa-solid fa-download"></i>
            <span className="hidden sm:inline">Install</span>
          </button>
        )}

        {currentUser && (
          <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{currentUser.fullName}</p>
              <div className="flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[9px] text-slate-500 font-bold uppercase">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
