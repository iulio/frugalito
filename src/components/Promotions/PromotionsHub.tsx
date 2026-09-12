import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RefreshCw, 
  Plus, 
  Check, 
  Tag, 
  Flame, 
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import type { Product, PromotionalDeal } from '../../types';
import { STORE_CHAINS } from '../../data/storesData';
import { CATEGORY_LABELS, getPromotionalDeals } from '../../data/productsData';
import { formatMoney } from '../../services/geoUtils';

interface PromotionsHubProps {
  products: Product[];
  onAddProductToCart: (product: Product, quantity?: number) => void;
  cartProductIds: Set<string>;
}

export const PromotionsHub: React.FC<PromotionsHubProps> = ({
  products,
  onAddProductToCart,
  cartProductIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [addedDealId, setAddedDealId] = useState<string | null>(null);

  // Extract all deals from catalog
  const allDeals = useMemo(() => getPromotionalDeals(products), [products]);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    return allDeals.filter((deal) => {
      const matchesSearch =
        deal.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.promoLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChain =
        selectedChain === 'all' || deal.chain === selectedChain;

      const matchesCategory =
        selectedCategory === 'all' || deal.product.category === selectedCategory;

      const matchesDiscount = deal.discountPercent >= minDiscount;

      return matchesSearch && matchesChain && matchesCategory && matchesDiscount;
    });
  }, [allDeals, searchTerm, selectedChain, selectedCategory, minDiscount]);

  // Simulate scanning of store catalogs & flyers
  const handleScanCatalogs = () => {
    setIsScanning(true);
    setScanSuccessMessage(null);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccessMessage('Scanat cu succes: 7 rețele verificate, 18 oferte active sincronizate!');
      setTimeout(() => setScanSuccessMessage(null), 4000);
    }, 1200);
  };

  const handleAddToCartWithFeedback = (deal: PromotionalDeal) => {
    onAddProductToCart(deal.product, 1);
    setAddedDealId(deal.id);
    setTimeout(() => setAddedDealId(null), 1500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
      
      {/* Top Banner & Scanner Action */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-300" />
                Live Deals & Cataloage
              </span>
              <span className="text-xs text-white/80">
                Toate marile rețele din România
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Scaner Promoții & Oferte Săptămânale
            </h2>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Descoperă reducerile de la raft din Lidl, Kaufland, Carrefour, Auchan, Mega Image, Penny și Profi. Adaugă-le cu un singur click în coșul inteligent Frugalito.
            </p>
          </div>

          <button
            onClick={handleScanCatalogs}
            disabled={isScanning}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-auto disabled:opacity-75"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Se scanează cataloagele...' : 'Actualizează Oferte'}</span>
          </button>
        </div>

        {/* Scan success alert */}
        {scanSuccessMessage && (
          <div className="mt-3 p-2.5 bg-emerald-500/30 border border-emerald-400/40 rounded-xl text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{scanSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
        
        {/* Search and min discount */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Caută în promoții (ex: pui, cafea, ariel, lapte)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Discount pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Reducere:
            </span>
            {[0, 15, 20, 25].map((thresh) => (
              <button
                key={thresh}
                onClick={() => setMinDiscount(thresh)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  minDiscount === thresh
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {thresh === 0 ? 'Toate' : `≥ ${thresh}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Store Chain Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          <button
            onClick={() => setSelectedChain('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedChain === 'all'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Toate Magazinele ({allDeals.length})
          </button>

          {Object.entries(STORE_CHAINS).map(([chainKey, chainMeta]) => {
            const countInChain = allDeals.filter((d) => d.chain === chainKey).length;
            const isSelected = selectedChain === chainKey;

            return (
              <button
                key={chainKey}
                onClick={() => setSelectedChain(chainKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white border-transparent shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: isSelected ? chainMeta.color : undefined,
                }}
              >
                <span>{chainMeta.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {countInChain}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toate Categoriile
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === catKey
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-200/60 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {catMeta.label}
            </button>
          ))}
        </div>

      </div>

      {/* Deals Grid */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[700px]">
        {filteredDeals.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Tag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-600">Nu au fost găsite promoții</p>
            <p className="text-xs text-slate-400 mt-1">
              Încearcă să resetezi filtrele sau termenul de căutare.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredDeals.map((deal) => {
              const chainMeta = STORE_CHAINS[deal.chain];
              const isAlreadyInCart = cartProductIds.has(deal.product.id);
              const wasJustAdded = addedDealId === deal.id;

              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Top Store Badge & Discount Tag */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className="px-2.5 py-1 rounded-lg text-[11px] font-black tracking-tight text-white shadow-2xs"
                        style={{ backgroundColor: chainMeta.color }}
                      >
                        {chainMeta.name}
                      </span>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 border border-rose-200">
                        -{deal.discountPercent}% REDUCERE
                      </span>
                    </div>

                    {/* Product Name */}
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {deal.product.name}
                    </h4>
                    
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {deal.promoLabel}
                    </p>
                  </div>

                  {/* Price Section & Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-1.5">
                          {formatMoney(deal.oldPrice)}
                        </span>
                        <span className="text-base font-black text-slate-900">
                          {formatMoney(deal.price)}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">
                          / {deal.product.unit}
                        </span>
                      </div>

                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        Economisești {formatMoney(deal.savingsLei)}
                      </span>
                    </div>

                    {/* Add to basket button */}
                    <button
                      onClick={() => handleAddToCartWithFeedback(deal)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                        wasJustAdded
                          ? 'bg-emerald-600 text-white'
                          : isAlreadyInCart
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {wasJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Adăugat în Coș!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>
                            {isAlreadyInCart
                              ? '+1 în Coș (Deja prezent)'
                              : 'Adaugă în Coșul Inteligent'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
