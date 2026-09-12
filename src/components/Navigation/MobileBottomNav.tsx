import React from 'react';
import { 
  ShoppingCart, 
  Map, 
  BarChart3, 
  Tag, 
  ArrowRight
} from 'lucide-react';
import type { StrategyResult } from '../../types';
import { formatMoney } from '../../services/geoUtils';

export type MobileTab = 'cart' | 'map' | 'routes' | 'promotions';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  itemCount: number;
  activeStrategy: StrategyResult | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  itemCount,
  activeStrategy,
}) => {
  const tabs: { id: MobileTab; label: string; icon: React.ReactNode; badge?: number | boolean }[] = [
    {
      id: 'cart',
      label: 'Coșul Meu',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: itemCount > 0 ? itemCount : undefined,
    },
    {
      id: 'map',
      label: 'Hartă & Rute',
      icon: <Map className="w-5 h-5" />,
    },
    {
      id: 'routes',
      label: 'Optimizare',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'promotions',
      label: 'Oferte & Scaner',
      icon: <Tag className="w-5 h-5" />,
      badge: true, // dot badge for deals
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      
      {/* Quick Floating Bar on Cart or Map tab */}
      {(activeTab === 'cart' || activeTab === 'map') && activeStrategy && itemCount > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => onSelectTab('routes')}
            className="w-full py-2.5 px-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold border border-slate-700/50 animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Traseu Optim:</span>
              <span className="text-emerald-400 font-black">
                {formatMoney(activeStrategy.productsTotal)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-300">
              <span>Vezi Rute</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Main Bottom Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 pb-safe shadow-lg flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                {tab.icon}
                
                {/* Count badge */}
                {typeof tab.badge === 'number' && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}

                {/* Dot badge */}
                {typeof tab.badge === 'boolean' && tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white w-2 h-2 rounded-full shadow-xs"></span>
                )}
              </div>

              <span className="text-[10px] tracking-tight mt-1 truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
