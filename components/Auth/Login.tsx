
import React, { useState, useEffect } from 'react';

interface LoginProps {
  // Fixed: Updated return type to Promise<boolean> to match the store.login implementation
  onLogin: (mobile: string, password?: string, remember?: boolean) => Promise<boolean>;
  onSwitch: () => void;
  savedMobile?: string;
  savedPassword?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitch, savedMobile, savedPassword }) => {
  const [mobile, setMobile] = useState(savedMobile || '');
  const [password, setPassword] = useState(savedPassword || '');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (savedMobile) setMobile(savedMobile);
    if (savedPassword) setPassword(savedPassword);
  }, [savedMobile, savedPassword]);

  // Fixed: Made handleSubmit async to correctly await the login operation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(mobile, password, remember);
    if (!success) {
      setError('Invalid mobile number or password.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-slate-100">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
          <i className="fa-solid fa-lock text-2xl"></i>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
        <p className="text-sm text-slate-500 font-medium">Please enter your credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Mobile Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-phone text-xs"></i>
            </span>
            <input
              type="text"
              required
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700"
              placeholder="e.g. 03001234567"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <i className="fa-solid fa-key text-xs"></i>
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="hidden"
            />
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${remember ? 'bg-emerald-600 border-emerald-600 shadow-md shadow-emerald-100' : 'bg-white border-slate-200 group-hover:border-emerald-300'}`}>
              {remember && <i className="fa-solid fa-check text-[10px] text-white"></i>}
            </div>
            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember Me</span>
          </label>
          <button type="button" className="text-xs font-bold text-emerald-600 hover:underline">Forgot?</button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 animate-shake">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            <p className="text-xs font-bold text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98] mt-2"
        >
          Sign In
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-50 text-center">
        <p className="text-slate-500 text-xs font-medium">
          Don't have an account?{' '}
          <button onClick={onSwitch} className="text-emerald-600 font-black hover:underline ml-1">
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
