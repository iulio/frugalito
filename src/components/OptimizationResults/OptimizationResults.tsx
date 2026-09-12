import React from 'react';
import { 
  Award, 
  Zap, 
  TrendingDown, 
  ArrowRight, 
  Clock, 
  Fuel, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import type { OptimizationOverview, StrategyType } from '../../types';
import { STORE_CHAINS } from '../../data/storesData';
import { formatDistance, formatMoney } from '../../services/geoUtils';

interface OptimizationResultsProps {
  overview: OptimizationOverview;
  activeStrategyType: StrategyType;
  onSelectStrategyType: (type: StrategyType) => void;
  onStartInStoreMode: () => void;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  overview,
  activeStrategyType,
  onSelectStrategyType,
  onStartInStoreMode,
}) => {
  const { strategies, settings } = overview;
  const currentStrategy = strategies[activeStrategyType];

  if (!currentStrategy || currentStrategy.stops.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center">
        <p className="text-sm font-semibold text-slate-600">
          Adaugă produse în lista de cumpărături pentru a rula optimizatorul.
        </p>
      </div>
    );
  }

  const strategyButtons: { type: StrategyType; label: string; icon: React.ReactNode; badgeColor: string }[] = [
    {
      type: 'smart_balance',
      label: '🏆 Smart Balance',
      icon: <Award className="w-4 h-4 text-emerald-500" />,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      type: 'one_stop',
      label: '⚡ Un Singur Magazin',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      type: 'max_savings',
      label: '💰 Economie Extremă',
      icon: <TrendingDown className="w-4 h-4 text-blue-500" />,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
      
      {/* Strategy Switcher Tabs */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80">
        <div className="grid grid-cols-3 gap-2">
          {strategyButtons.map((btn) => {
            const strat = strategies[btn.type];
            const isSelected = activeStrategyType === btn.type;
            return (
              <button
                key={btn.type}
                onClick={() => onSelectStrategyType(btn.type)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-100/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  {btn.icon}
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {btn.label}
                  </span>
                </div>
                {strat && (
                  <span className="text-[11px] font-black text-emerald-700 mt-1">
                    {formatMoney(strat.productsTotal)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Metrics Banner */}
      <div className="p-4 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 border-b border-slate-200/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                {currentStrategy.title}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {currentStrategy.badge}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {currentStrategy.tagline}
            </p>
          </div>

          <button
            onClick={onStartInStoreMode}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0"
          >
            <span>La Cumpărături</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Financial & Travel Stat Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
          
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Total Produse
            </span>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {formatMoney(currentStrategy.productsTotal)}
            </p>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              {settings.transportMode === 'car' ? <Fuel className="w-3 h-3 text-amber-500" /> : <Clock className="w-3 h-3 text-blue-500" />}
              {settings.transportMode === 'car' ? 'Cost Deplasare' : 'Timp Total'}
            </span>
            <p className="text-sm font-black text-slate-900 mt-0.5">
              {settings.transportMode === 'car'
                ? formatMoney(currentStrategy.transportCost)
                : `${currentStrategy.totalDurationMinutes} min`}
            </p>
            <span className="text-[10px] text-slate-400">
              {formatDistance(currentStrategy.totalDistanceKm)} traseu
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Cost Efectiv Total
            </span>
            <p className="text-sm font-black text-slate-800 mt-0.5">
              {formatMoney(currentStrategy.totalEffectiveCost)}
            </p>
            <span className="text-[10px] text-slate-400">
              (produse + deplasare)
            </span>
          </div>

          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Economie
            </span>
            <p className="text-sm font-black text-white mt-0.5">
              +{formatMoney(currentStrategy.netSavings)}
            </p>
            <span className="text-[10px] text-emerald-100">
              față de cel mai scump magazin
            </span>
          </div>

        </div>
      </div>

      {/* Detailed Itinerary per Store Stop */}
      <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Planul tău de traseu & repartiția coșului:</span>
          <span className="text-slate-500 font-normal">
            {currentStrategy.stops.length}{' '}
            {currentStrategy.stops.length === 1 ? 'magazin' : 'magazine'}
          </span>
        </div>

        {currentStrategy.stops.map((stop, index) => {
          const chain = STORE_CHAINS[stop.store.chain];
          return (
            <div
              key={stop.store.id}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white transition-colors shadow-2xs"
            >
              {/* Store Header bar */}
              <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-xs"
                    style={{ backgroundColor: chain.color }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">
                        {stop.store.name}
                      </span>
                      <span
                        className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md"
                        style={{
                          backgroundColor: chain.bgLight,
                          color: chain.color,
                        }}
                      >
                        {chain.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {stop.store.address} • {formatDistance(stop.distanceFromPrevKm)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-700">
                    {formatMoney(stop.subtotal)}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {stop.items.length} {stop.items.length === 1 ? 'produs' : 'produse'}
                  </p>
                </div>
              </div>

              {/* Items to buy at this store */}
              <div className="p-3 divide-y divide-slate-100">
                {stop.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="py-1.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="font-medium text-slate-700">
                        {item.product.name}
                      </span>
                      {item.isPromo && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                          Promoție
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">
                        {item.quantity} {item.product.unit} × {formatMoney(item.unitPrice)}
                      </span>
                      <span className="font-bold text-slate-900 w-16 text-right">
                        {formatMoney(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Dynamic Insight Banner (Exemplu cu cei 3 bani la cartofi) */}
        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2 text-xs text-blue-900 leading-relaxed">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Cum funcționează optimizarea inteligentă?</span>
            <p className="text-blue-800 text-[11px] mt-0.5">
              Dacă un produs (ex. cartofii) este cu 3 bani mai ieftin la un alt magazin, Frugalito nu te va trimite la kilometri distanță doar pentru câțiva bani, deoarece costul drumului și timpul tău pierdut depășesc cu mult economia. În schimb, dacă economiile sunt consistente (la carne, detergent sau coșul mare), traseul combinat devine profitabil!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
