import React from 'react';
import { 
  ShoppingCart, 
  Car, 
  Footprints, 
  MapPin, 
  Sliders, 
  CheckSquare, 
  Navigation,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import type { TransportMode } from '../../types';
import { CITY_PRESETS } from '../../data/storesData';

interface HeaderProps {
  transportMode: TransportMode;
  onToggleTransportMode: (mode: TransportMode) => void;
  selectedCityId: string;
  onSelectCity: (cityId: string) => void;
  onUseGps: () => void;
  isLocating: boolean;
  itemCount: number;
  inStoreMode: boolean;
  onToggleInStoreMode: () => void;
  onOpenSettings: () => void;
  currentView: 'dashboard' | 'promotions';
  onSelectView: (view: 'dashboard' | 'promotions') => void;
}

export const Header: React.FC<HeaderProps> = ({
  transportMode,
  onToggleTransportMode,
  selectedCityId,
  onSelectCity,
  onUseGps,
  isLocating,
  itemCount,
  inStoreMode,
  onToggleInStoreMode,
  onOpenSettings,
  currentView,
  onSelectView,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  Frugalito
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Smart Basket
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Optimizare coș supermarket: prețuri reale + costul deplasării
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs: Dashboard vs Promoții */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Optimizator Coș</span>
            </button>

            <button
              onClick={() => onSelectView('promotions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'promotions'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Scaner Promoții</span>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                HOT
              </span>
            </button>
          </div>

          {/* Transport Mode Switcher (Car vs Foot/Bike) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onToggleTransportMode('car')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                transportMode === 'car'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Calcul combustibil (~0.85 lei/km) + timp"
            >
              <Car className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cu Mașina</span>
            </button>

            <button
              onClick={() => onToggleTransportMode('foot_bike')}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                transportMode === 'foot_bike'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Fără combustibil (0 lei), optimizare timp mers pe jos"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pe jos / Bicicletă</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* City Selector */}
            <div className="relative hidden sm:flex items-center">
              <MapPin className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <select
                value={selectedCityId}
                onChange={(e) => onSelectCity(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer max-w-[140px] md:max-w-[200px] truncate"
              >
                {CITY_PRESETS.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Locate Button */}
            <button
              onClick={onUseGps}
              disabled={isLocating}
              className="flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors disabled:opacity-50"
              title="Locația mea GPS"
            >
              <Navigation className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">GPS</span>
            </button>

            {/* In-Store Mode Button */}
            <button
              onClick={onToggleInStoreMode}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                inStoreMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{inStoreMode ? 'Ieși din Magazin' : 'Mod Magazin'}</span>
              {itemCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  inStoreMode ? 'bg-amber-700 text-amber-100' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {itemCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              title="Setări"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
