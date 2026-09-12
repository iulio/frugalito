import React, { useState, useMemo } from 'react';
import { Header } from './components/Header/Header';
import { ShoppingList } from './components/ShoppingList/ShoppingList';
import { InteractiveMap } from './components/Map/InteractiveMap';
import { OptimizationResults } from './components/OptimizationResults/OptimizationResults';
import { InStoreMode } from './components/InStore/InStoreMode';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { PromotionsHub } from './components/Promotions/PromotionsHub';
import { MobileBottomNav, type MobileTab } from './components/Navigation/MobileBottomNav';
import { InstallPromptModal } from './components/InstallPrompt/InstallPromptModal';

import type {
  Product,
  ShoppingItem,
  OptimizerSettings,
  StrategyType,
  TransportMode,
  Store,
} from './types';
import { INITIAL_PRODUCTS } from './data/productsData';
import { INITIAL_STORES, CITY_PRESETS } from './data/storesData';
import { optimizeShoppingList } from './services/optimizer';

export const App: React.FC = () => {
  // 1. Initial State: Pre-loaded with realistic basket
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores] = useState<Store[]>(INITIAL_STORES);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    {
      productId: 'cartofi_albi',
      product: INITIAL_PRODUCTS.find((p) => p.id === 'cartofi_albi')!,
      quantity: 2,
    },
    {
      productId: 'lapte_1_5',
      product: INITIAL_PRODUCTS.find((p) => p.id === 'lapte_1_5')!,
      quantity: 2,
    },
    {
      productId: 'oua_m_10',
      product: INITIAL_PRODUCTS.find((p) => p.id === 'oua_m_10')!,
      quantity: 1,
    },
    {
      productId: 'piept_pui_dezosat',
      product: INITIAL_PRODUCTS.find((p) => p.id === 'piept_pui_dezosat')!,
      quantity: 1.5,
    },
    {
      productId: 'detergent_rufe_ariel',
      product: INITIAL_PRODUCTS.find((p) => p.id === 'detergent_rufe_ariel')!,
      quantity: 1,
    },
  ]);

  // User location and city selection
  const [selectedCityId, setSelectedCityId] = useState<string>('bucuresti_titan');
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    label: string;
  }>({
    lat: 44.4225,
    lng: 26.1550,
    label: 'București (Sector 3 - Titan/Dristor)',
  });

  const [isLocating, setIsLocating] = useState(false);

  // Optimizer settings
  const [settings, setSettings] = useState<OptimizerSettings>({
    transportMode: 'car',
    searchRadiusKm: 5,
    fuelCostPerKm: 0.85,
    storeStopFrictionCost: 10,
    footTimeFrictionCostPerStore: 8,
  });

  const [activeStrategyType, setActiveStrategyType] =
    useState<StrategyType>('smart_balance');
  const [inStoreMode, setInStoreMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Mobile & Desktop Views
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('cart');
  const [currentDesktopView, setCurrentDesktopView] = useState<'dashboard' | 'promotions'>('dashboard');

  // Set of product IDs currently in cart
  const cartProductIds = useMemo(() => {
    return new Set(shoppingList.map((i) => i.productId));
  }, [shoppingList]);

  // 2. Run optimization engine
  const optimizationOverview = useMemo(() => {
    return optimizeShoppingList(shoppingList, stores, userLocation, settings);
  }, [shoppingList, stores, userLocation, settings]);

  const activeStrategy = optimizationOverview.strategies[activeStrategyType];

  // 3. Handlers
  const handleToggleTransportMode = (mode: TransportMode) => {
    setSettings((prev) => ({ ...prev, transportMode: mode }));
  };

  const handleSelectCity = (cityId: string) => {
    const city = CITY_PRESETS.find((c) => c.id === cityId);
    if (city) {
      setSelectedCityId(city.id);
      setUserLocation({
        lat: city.lat,
        lng: city.lng,
        label: city.name,
      });
    }
  };

  const handleSelectUserLocation = (lat: number, lng: number) => {
    setUserLocation({
      lat,
      lng,
      label: `Coordonate selectate: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocația nu este suportată de browserul dumneavoastră.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Locația ta detectată prin GPS',
        });
      },
      (error) => {
        setIsLocating(false);
        alert(
          'Nu am putut obține locația GPS (' +
            error.message +
            '). Puteți alege manual un punct pe hartă.'
        );
      }
    );
  };

  const handleAddItem = (product: Product, quantity?: number) => {
    setShoppingList((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + (quantity || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity: quantity || product.defaultQty,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setShoppingList((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setShoppingList((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearList = () => {
    setShoppingList([]);
  };

  const handleLoadPreset = (
    presetItems: { productId: string; quantity: number }[]
  ) => {
    const newItems: ShoppingItem[] = [];
    for (const p of presetItems) {
      const foundProduct = products.find((prod) => prod.id === p.productId);
      if (foundProduct) {
        newItems.push({
          productId: p.productId,
          product: foundProduct,
          quantity: p.quantity,
        });
      }
    }
    setShoppingList(newItems);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-16 md:pb-0">
      
      {/* Top Navbar */}
      <Header
        transportMode={settings.transportMode}
        onToggleTransportMode={handleToggleTransportMode}
        selectedCityId={selectedCityId}
        onSelectCity={handleSelectCity}
        onUseGps={handleUseGps}
        isLocating={isLocating}
        itemCount={shoppingList.length}
        inStoreMode={inStoreMode}
        onToggleInStoreMode={() => setInStoreMode(!inStoreMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentView={currentDesktopView}
        onSelectView={setCurrentDesktopView}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6">
        
        {inStoreMode ? (
          // In-Store Active Mode Screen
          activeStrategy ? (
            <InStoreMode
              strategy={activeStrategy}
              onExit={() => setInStoreMode(false)}
            />
          ) : (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                Nicio strategie calculată. Adaugă produse pentru a începe cumpărăturile.
              </p>
              <button
                onClick={() => setInStoreMode(false)}
                className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Înapoi
              </button>
            </div>
          )
        ) : (
          <>
            {/* DESKTOP VIEW (hidden on mobile) */}
            <div className="hidden md:block">
              {currentDesktopView === 'promotions' ? (
                <PromotionsHub
                  products={products}
                  onAddProductToCart={handleAddItem}
                  cartProductIds={cartProductIds}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column: Smart Shopping List Builder (4 cols) */}
                  <div className="lg:col-span-4 h-[780px]">
                    <ShoppingList
                      products={products}
                      items={shoppingList}
                      onAddItem={handleAddItem}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onClearList={handleClearList}
                      onLoadPreset={handleLoadPreset}
                    />
                  </div>

                  {/* Right Column: Map & Optimization Results (8 cols) */}
                  <div className="lg:col-span-8 flex flex-col gap-5">
                    
                    {/* Interactive Map View */}
                    <div className="h-[360px] sm:h-[400px]">
                      <InteractiveMap
                        userLocation={userLocation}
                        stores={stores}
                        selectedStrategy={activeStrategy}
                        searchRadiusKm={settings.searchRadiusKm}
                        onSelectUserLocation={handleSelectUserLocation}
                      />
                    </div>

                    {/* Optimization Results Cards & Itinerary */}
                    <OptimizationResults
                      overview={optimizationOverview}
                      activeStrategyType={activeStrategyType}
                      onSelectStrategyType={setActiveStrategyType}
                      onStartInStoreMode={() => setInStoreMode(true)}
                    />

                  </div>

                </div>
              )}
            </div>

            {/* MOBILE VIEW (tab-based, visible only on mobile) */}
            <div className="block md:hidden">
              {activeMobileTab === 'cart' && (
                <div className="min-h-[580px]">
                  <ShoppingList
                    products={products}
                    items={shoppingList}
                    onAddItem={handleAddItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearList={handleClearList}
                    onLoadPreset={handleLoadPreset}
                  />
                </div>
              )}

              {activeMobileTab === 'map' && (
                <div className="h-[calc(100vh-140px)] min-h-[480px]">
                  <InteractiveMap
                    userLocation={userLocation}
                    stores={stores}
                    selectedStrategy={activeStrategy}
                    searchRadiusKm={settings.searchRadiusKm}
                    onSelectUserLocation={handleSelectUserLocation}
                  />
                </div>
              )}

              {activeMobileTab === 'routes' && (
                <div>
                  <OptimizationResults
                    overview={optimizationOverview}
                    activeStrategyType={activeStrategyType}
                    onSelectStrategyType={setActiveStrategyType}
                    onStartInStoreMode={() => setInStoreMode(true)}
                  />
                </div>
              )}

              {activeMobileTab === 'promotions' && (
                <div>
                  <PromotionsHub
                    products={products}
                    onAddProductToCart={handleAddItem}
                    cartProductIds={cartProductIds}
                  />
                </div>
              )}
            </div>
          </>
        )}

      </main>

      {/* Mobile Bottom Navigation Bar */}
      {!inStoreMode && (
        <MobileBottomNav
          activeTab={activeMobileTab}
          onSelectTab={setActiveMobileTab}
          itemCount={shoppingList.length}
          activeStrategy={activeStrategy}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Android 1-Click Install & Share Banner */}
      <InstallPromptModal />

    </div>
  );
};

export default App;
