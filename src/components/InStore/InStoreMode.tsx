import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  MapPin
} from 'lucide-react';
import type { StrategyResult } from '../../types';
import { STORE_CHAINS } from '../../data/storesData';
import { formatMoney } from '../../services/geoUtils';

interface InStoreModeProps {
  strategy: StrategyResult;
  onExit: () => void;
}

export const InStoreMode: React.FC<InStoreModeProps> = ({ strategy, onExit }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [checkedItemIds, setCheckedItemIds] = useState<Set<string>>(new Set());

  const currentStop = strategy.stops[currentStopIndex];
  if (!currentStop) return null;

  const chain = STORE_CHAINS[currentStop.store.chain];

  const toggleCheck = (productId: string) => {
    setCheckedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const checkedInThisStop = currentStop.items.filter((item) =>
    checkedItemIds.has(item.product.id)
  );
  const progressPercent = Math.round(
    (checkedInThisStop.length / currentStop.items.length) * 100
  );

  const runningSubtotal = checkedInThisStop.reduce(
    (acc, it) => acc + it.totalPrice,
    0
  );

  const isCurrentStopComplete =
    checkedInThisStop.length === currentStop.items.length &&
    currentStop.items.length > 0;

  const handleNextStore = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    if (currentStopIndex < strategy.stops.length - 1) {
      setCurrentStopIndex((prev) => prev + 1);
    } else {
      // Completed all stores!
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
      alert(`Felicitări! Ai finalizat toate cumpărăturile și ai economisit ${formatMoney(strategy.netSavings)}!`);
      onExit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Înapoi la Plan</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            Mod Activ: În Magazin
          </span>
        </div>
      </div>

      {/* Multi-Store Stepper (if > 1 store) */}
      {strategy.stops.length > 1 && (
        <div className="flex items-center justify-between mb-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          {strategy.stops.map((stop, idx) => {
            const stChain = STORE_CHAINS[stop.store.chain];
            const isCurrent = idx === currentStopIndex;
            const isDone = idx < currentStopIndex;

            return (
              <button
                key={stop.store.id}
                onClick={() => setCurrentStopIndex(idx)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] text-white"
                  style={{ backgroundColor: isCurrent ? '#10b981' : stChain.color }}
                >
                  {isDone ? <Check className="w-3 h-3 text-white" /> : idx + 1}
                </span>
                <span className="truncate">{stChain.shortName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Current Store Hero Card */}
      <div
        className="rounded-3xl p-5 mb-5 text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${chain.color} 0%, #0f172a 100%)`,
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider">
                Oprirea {currentStopIndex + 1} din {strategy.stops.length}
              </span>
              <span className="text-xs font-medium text-white/80">
                {currentStop.store.city}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">{currentStop.store.name}</h2>
            <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {currentStop.store.address}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-white/70 block uppercase font-bold">
              Buget estimat aici
            </span>
            <span className="text-2xl font-black text-white">
              {formatMoney(currentStop.subtotal)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 pt-4 border-t border-white/15">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span>Progres Cărucior</span>
            <span>
              {checkedInThisStop.length} / {currentStop.items.length} produse ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Items Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-5 divide-y divide-slate-100">
        <h3 className="text-sm font-bold text-slate-800 pb-3">
          Produse de pus în coș la {chain.name}:
        </h3>

        {currentStop.items.map((item) => {
          const isChecked = checkedItemIds.has(item.product.id);

          return (
            <div
              key={item.product.id}
              onClick={() => toggleCheck(item.product.id)}
              className={`py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                isChecked ? 'opacity-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div>
                  <p
                    className={`text-sm font-bold ${
                      isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.product.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.quantity} {item.product.unit} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-slate-900">
                  {formatMoney(item.totalPrice)}
                </span>
                {item.isPromo && (
                  <span className="block text-[10px] font-bold text-amber-600">
                    Preț promoțional
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 uppercase font-bold block">
            Verificat în coș:
          </span>
          <span className="text-lg font-black text-emerald-700">
            {formatMoney(runningSubtotal)}
          </span>
        </div>

        <button
          onClick={handleNextStore}
          className={`px-5 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-md ${
            isCurrentStopComplete
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <span>
            {currentStopIndex < strategy.stops.length - 1
              ? 'Mergi la următorul magazin'
              : 'Finalizează Cumpărăturile'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
