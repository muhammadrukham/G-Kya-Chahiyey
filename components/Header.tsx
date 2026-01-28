
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  logo: string;
  onLogout: () => void;
  currentUser: User | null;
  onInstall: () => void;
  showInstall: boolean;
}

const Header: React.FC<HeaderProps> = ({ logo, onLogout, currentUser, onInstall, showInstall }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <img src={logo} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
        <h1 className="text-xl font-bold text-emerald-600 urdu-font">جی کیا چاہئیے</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {showInstall && (
          <button 
            onClick={onInstall}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-200"
          >
            <i className="fa-solid fa-download"></i>
            Install App
          </button>
        )}

        {currentUser && (
          <div className="flex items-center gap-6 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{currentUser.fullName}</p>
              <p className="text-xs text-slate-500">{currentUser.role} • {currentUser.mobileNumber}</p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
