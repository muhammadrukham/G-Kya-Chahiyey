
import React from 'react';
import { SectorTiming } from '../../types';

interface DeliveryManagementProps {
  store: any;
}

const DeliveryManagement: React.FC<DeliveryManagementProps> = ({ store }) => {
  const timings = store.config.deliveryTimings;
  const editWindow = store.config.editWindowSeconds || 45;
  const streetCharges = store.config.streetCharges || {};

  const updateTiming = (key: string, field: keyof SectorTiming, value: number) => {
    const newTimings = { ...timings };
    newTimings[key] = { ...newTimings[key], [field]: value };
    store.updateConfig({ deliveryTimings: newTimings });
  };

  const updateEditWindow = (seconds: number) => {
    store.updateConfig({ editWindowSeconds: seconds });
  };

  const deleteStreetCharge = (key: string) => {
    const newCharges = { ...streetCharges };
    delete newCharges[key];
    store.updateConfig({ streetCharges: newCharges });
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Logistics & Timing</h2>
          <p className="text-xs text-slate-500">Manage delivery estimates, base charges, and modification windows.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-stopwatch"></i>
            Customer Order Edit Window
          </h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Timer (Seconds)</label>
              <div className="flex gap-4">
                <input 
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold text-slate-700"
                  value={editWindow}
                  onChange={e => updateEditWindow(parseInt(e.target.value) || 0)}
                />
                <div className="px-6 py-3 bg-slate-50 border rounded-xl flex items-center justify-center font-bold text-slate-400">
                  SEC
                </div>
              </div>
            </div>
            <div className="w-48 text-[11px] text-slate-500 leading-relaxed italic">
              Customers can modify or cancel their orders for this amount of time after placing them.
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-blue-100 shadow-sm">
          <h3 className="font-bold text-blue-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-road"></i>
            Street-Specific Overrides
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(streetCharges).map(([key, charge]) => {
              const [sector, street] = key.split('|');
              return (
                <div key={key} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{sector}</span>
                    <span className="text-sm font-bold text-slate-800">Street {street}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-blue-600">Rs. {charge as number}</span>
                    <button 
                      onClick={() => deleteStreetCharge(key)}
                      className="text-red-300 hover:text-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              );
            })}
            {Object.keys(streetCharges).length === 0 && (
              <div className="text-center py-6 text-slate-400 italic text-xs border border-dashed rounded-2xl">
                No street-specific charges configured. You can add them from the "User Management" tab.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-slate-800 border-b pb-2">Sector Delivery Settings (Default)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(timings).map(([key, rule]: [string, any]) => (
            <div key={key} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                <i className="fa-solid fa-location-dot"></i>
                {key}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Base Delivery Charge (Rs.)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg text-sm font-bold bg-emerald-50 border-emerald-100"
                    value={rule.baseCharge || 0}
                    onChange={e => updateTiming(key, 'baseCharge', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Base Min Mins</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={rule.baseMin}
                    onChange={e => updateTiming(key, 'baseMin', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Base Max Mins</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={rule.baseMax}
                    onChange={e => updateTiming(key, 'baseMax', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Item Threshold</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={rule.threshold}
                    onChange={e => updateTiming(key, 'threshold', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Add per Item</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={rule.additionalPerItem}
                    onChange={e => updateTiming(key, 'additionalPerItem', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-dashed text-[11px] text-slate-600">
                <span className="font-bold">Logic:</span> Base Charge applies first. Time is {rule.baseMin}-{rule.baseMax} mins. If items {'>'} {rule.threshold}, add {rule.additionalPerItem} mins for each extra item.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryManagement;
