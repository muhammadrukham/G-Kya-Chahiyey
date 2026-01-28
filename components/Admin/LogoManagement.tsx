
import React, { useState, useRef } from 'react';

interface LogoManagementProps {
  store: any;
}

const LogoManagement: React.FC<LogoManagementProps> = ({ store }) => {
  const [logoUrl, setLogoUrl] = useState(store.config.logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    store.updateConfig({ logo: logoUrl });
    alert('App branding updated successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">App Settings</h2>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-2xl shadow-sm">
        <h3 className="font-bold mb-6 text-slate-700 flex items-center gap-2">
          <i className="fa-solid fa-palette text-emerald-500"></i>
          Application Branding
        </h3>
        
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="relative group">
              <div className="h-32 w-32 bg-white rounded-3xl flex items-center justify-center overflow-hidden border-2 border-emerald-100 shadow-inner">
                {logoUrl ? <img src={logoUrl} alt="Preview" className="h-full w-full object-contain p-2" /> : <i className="fa-solid fa-image text-4xl text-slate-200"></i>}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-emerald-600/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-3xl"
              >
                <i className="fa-solid fa-camera text-xl mb-1"></i>
                <span className="text-[10px] font-bold">CHANGE</span>
              </button>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 mb-1">Current App Logo</p>
              <p className="text-xs text-slate-500 mb-4">This logo represents "Ji Kya Chahiye" across the platform. It appears on the login screen, navigation header, and customer dashboards.</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm"
                >
                  <i className="fa-solid fa-upload mr-2"></i> Upload New Image
                </button>
                {logoUrl !== store.config.logo && (
                  <button 
                    onClick={() => setLogoUrl(store.config.logo)}
                    className="text-slate-400 text-xs hover:text-slate-600"
                  >
                    Reset Changes
                  </button>
                )}
              </div>
              <input 
                type="file" accept="image/*" className="hidden" 
                ref={fileInputRef} onChange={handleFileUpload} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Logo Data (Base64/URL)</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-mono truncate"
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  placeholder="Enter direct image URL or upload above..."
                />
                <button 
                  onClick={handleUpdate}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                 <i className="fa-solid fa-lightbulb text-white"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Optimization Tip</p>
                <p className="text-xs text-blue-800 leading-relaxed">Images with a resolution of around 512x512 pixels and a transparent background work best for the app icon.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoManagement;
