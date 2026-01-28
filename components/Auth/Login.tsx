
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (mobile: string) => boolean;
  onSwitch: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitch }) => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(mobile)) {
      setError('User not found. Try "admin" or register a new account.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number (Username)</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="e.g. 03001234567"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
        >
          Sign In
        </button>
      </form>
      <div className="mt-6 text-center text-slate-500 text-sm">
        Don't have an account?{' '}
        <button onClick={onSwitch} className="text-emerald-600 font-semibold hover:underline">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default Login;
