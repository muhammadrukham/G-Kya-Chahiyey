
import React, { useState } from 'react';
import { User, UserRole, Sector } from '../../types';
import { SECTORS, BLOCKS, LANES } from '../../constants';

interface SignupProps {
  onSignup: (user: User) => boolean;
  onSwitch: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitch }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    whatsappNumber: '',
    sector: Sector.SECTOR_1,
    houseNumber: '',
    streetNumber: '',
    block: '',
    lane: '',
    isWhatsappDifferent: false
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.isWhatsappDifferent ? formData.whatsappNumber : formData.mobileNumber,
      role: UserRole.CUSTOMER,
      address: {
        sector: formData.sector,
        houseNumber: formData.houseNumber,
        streetNumber: formData.streetNumber,
        block: formData.sector === Sector.SECTOR_4 ? formData.block : undefined,
        lane: formData.sector === Sector.SECTOR_4 ? formData.lane : undefined,
      }
    };

    if (!onSignup(newUser)) {
      setError('Mobile number already registered');
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
          <input
            type="text" required
            className="w-full px-4 py-2 rounded-lg border border-slate-200"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number (Login Username) *</label>
          <input
            type="tel" required
            className="w-full px-4 py-2 rounded-lg border border-slate-200"
            value={formData.mobileNumber}
            onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="whatsappDiff"
            checked={formData.isWhatsappDifferent}
            onChange={e => setFormData({...formData, isWhatsappDifferent: e.target.checked})}
          />
          <label htmlFor="whatsappDiff" className="text-sm text-slate-600 cursor-pointer">WhatsApp number is different</label>
        </div>

        {formData.isWhatsappDifferent && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Number *</label>
            <input
              type="tel" required
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              value={formData.whatsappNumber}
              onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
            />
          </div>
        )}

        <hr className="my-4" />
        <h3 className="font-semibold text-slate-800">Address Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Sector *</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              value={formData.sector}
              onChange={e => setFormData({...formData, sector: e.target.value as Sector})}
            >
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">House # *</label>
            <input
              type="text" required
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              value={formData.houseNumber}
              onChange={e => setFormData({...formData, houseNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Street # *</label>
            <input
              type="text" required
              className="w-full px-4 py-2 rounded-lg border border-slate-200"
              value={formData.streetNumber}
              onChange={e => setFormData({...formData, streetNumber: e.target.value})}
            />
          </div>

          {formData.sector === Sector.SECTOR_4 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Block *</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  value={formData.block}
                  onChange={e => setFormData({...formData, block: e.target.value})}
                >
                  <option value="">Select Block</option>
                  {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lane # *</label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-200"
                  value={formData.lane}
                  onChange={e => setFormData({...formData, lane: e.target.value})}
                >
                  <option value="">Select Lane</option>
                  {LANES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors mt-4"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-6 text-center text-slate-500 text-sm">
        Already have an account?{' '}
        <button onClick={onSwitch} className="text-emerald-600 font-semibold hover:underline">
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Signup;
