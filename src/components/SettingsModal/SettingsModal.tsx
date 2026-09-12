import React from 'react';
import { X, Sliders, Fuel, MapPin, Gauge } from 'lucide-react';
import type { OptimizerSettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: OptimizerSettings;
  onUpdateSettings: (newSettings: OptimizerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Parametri de Optimizare Frugalito
            </h3>
            <p className="text-xs text-slate-500">
              Personalizează costurile de deplasare și valoarea timpului tău
            </p>
          </div>
        </div>

        <div className="space-y-5">
          
          {/* 1. Search Radius */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Rază maximă de căutare magazine
              </label>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {settings.searchRadiusKm} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={settings.searchRadiusKm}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  searchRadiusKm: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 km (în cartier)</span>
              <span>5 km (oraș)</span>
              <span>15 km (metropolitan)</span>
            </div>
          </div>

          {/* 2. Fuel Cost per Km (For Car) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                Cost carburant & uzură mașină
              </label>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                {settings.fuelCostPerKm.toFixed(2)} lei / km
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="1.80"
              step="0.05"
              value={settings.fuelCostPerKm}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  fuelCostPerKm: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.40 lei (economic / GPL)</span>
              <span>0.85 lei (standard)</span>
              <span>1.50 lei (consum urban mare)</span>
            </div>
          </div>

          {/* 3. Time Value & Extra Store Hassle Penalty */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                Valoarea timpului / Efort per magazin suplimentar
              </label>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {settings.storeStopFrictionCost} lei / oprire
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={settings.storeStopFrictionCost}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  storeStopFrictionCost: Number(e.target.value),
                })
              }
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-500 mt-1 leading-tight">
              Algoritmul va recomanda un al 2-lea magazin doar dacă economiile depășesc această sumă + combustibilul.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Salvează și Închide
          </button>
        </div>

      </div>
    </div>
  );
};
