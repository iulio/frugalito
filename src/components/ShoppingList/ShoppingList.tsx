import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Tag, 
  ShoppingBag,
  Layers
} from 'lucide-react';
import type { Product, ShoppingItem } from '../../types';
import { CATEGORY_LABELS, SAMPLE_BASKETS } from '../../data/productsData';
import { formatMoney } from '../../services/geoUtils';

interface ShoppingListProps {
  products: Product[];
  items: ShoppingItem[];
  onAddItem: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearList: () => void;
  onLoadPreset: (basketItems: { productId: string; quantity: number }[]) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  products,
  items,
  onAddItem,
  onUpdateQuantity,
  onRemoveItem,
  onClearList,
  onLoadPreset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter products for the search dropdown / suggestions
  const filteredSuggestions = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCat =
        selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  // Find lowest price for a product
  const getLowestPrice = (product: Product) => {
    const validPrices = Object.values(product.prices)
      .filter((p) => p && p.available)
      .map((p) => p!.price);
    if (validPrices.length === 0) return 0;
    return Math.min(...validPrices);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full overflow-hidden">
      
      {/* Header & Quick Sample Baskets */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800 text-base">
              Lista Mea de Cumpărături
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-full">
              {items.length} {items.length === 1 ? 'produs' : 'produse'}
            </span>
          </div>

          {items.length > 0 && (
            <button
              onClick={onClearList}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Golește</span>
            </button>
          )}
        </div>

        {/* Preset Baskets Pills */}
        <div className="mt-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Coșuri rapide prestabilite:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_BASKETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onLoadPreset(preset.items)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-all text-left shadow-2xs hover:text-emerald-700"
                title={preset.description}
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Caută lapte, pâine, carne, cartofi, detergent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Category horizontal scroll */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toate
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, catMeta]) => (
            <button
              key={catKey}
              onClick={() => setSelectedCategory(catKey)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === catKey
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {catMeta.label}
            </button>
          ))}
        </div>

        {/* Search Results Dropdown / Quick Add List */}
        {searchTerm.length > 0 && (
          <div className="mt-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-white shadow-lg divide-y divide-slate-100">
            {filteredSuggestions.length === 0 ? (
              <p className="p-3 text-xs text-slate-400 text-center">
                Nu s-a găsit niciun produs corespunzător.
              </p>
            ) : (
              filteredSuggestions.map((prod) => {
                const isAlreadyAdded = items.some(
                  (i) => i.productId === prod.id
                );
                const lowest = getLowestPrice(prod);
                return (
                  <div
                    key={prod.id}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium">
                        de la {formatMoney(lowest)} / {prod.unit}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAddItem(prod);
                        setSearchTerm('');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAlreadyAdded ? '+ încă 1' : 'Adaugă'}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Active Items in the Basket */}
      <div className="flex-1 overflow-y-auto p-3 divide-y divide-slate-100">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600">Coșul tău este gol</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Alege un coș rapid de mai sus sau caută produse pentru a începe optimizarea.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const lowest = getLowestPrice(item.product);
            const hasPromo = Object.values(item.product.prices).some(
              (p) => p && p.isPromo
            );

            return (
              <div
                key={item.productId}
                className="py-2.5 flex items-center justify-between gap-2 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.product.name}
                    </span>
                    {hasPromo && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md">
                        <Tag className="w-2.5 h-2.5" /> Promo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    min. {formatMoney(lowest)} / {item.product.unit}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateQuantity(item.productId, -1)}
                    className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs shadow-2xs font-bold transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-xs font-bold text-slate-800 px-1.5 min-w-[36px] text-center">
                    {item.quantity} {item.product.unit}
                  </span>

                  <button
                    onClick={() => onUpdateQuantity(item.productId, 1)}
                    className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center text-xs shadow-2xs font-bold transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Remove item */}
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                  title="Șterge produs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
