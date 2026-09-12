export type StoreChain = 
  | 'lidl' 
  | 'kaufland' 
  | 'carrefour' 
  | 'auchan' 
  | 'mega_image' 
  | 'penny' 
  | 'profi';

export interface StoreChainConfig {
  name: string;
  shortName: string;
  color: string;
  textColor: string;
  bgLight: string;
  borderColor: string;
  badgeBg: string;
  markerColor: string;
}

export interface Store {
  id: string;
  chain: StoreChain;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  openHours: string;
}

export type ProductCategory = 
  | 'legume_fructe' 
  | 'lactate_oua' 
  | 'carne_mezeluri' 
  | 'panificatie' 
  | 'bacanie' 
  | 'bauturi' 
  | 'curatenie_menaj' 
  | 'dulciuri_gustari';

export interface ProductPrice {
  price: number; // in RON
  oldPrice?: number;
  isPromo?: boolean;
  promoLabel?: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: 'kg' | 'buc' | 'L' | 'pachet';
  defaultQty: number;
  icon?: string;
  prices: Partial<Record<StoreChain, ProductPrice>>;
}

export interface ShoppingItem {
  productId: string;
  product: Product;
  quantity: number;
  checked?: boolean; // For in-store mode
}

export type TransportMode = 'car' | 'foot_bike';

export interface OptimizerSettings {
  transportMode: TransportMode;
  searchRadiusKm: number; // e.g. 5
  fuelCostPerKm: number; // e.g. 0.85 RON/km
  storeStopFrictionCost: number; // e.g. 10 RON per extra store (time + hassle)
  footTimeFrictionCostPerStore: number; // e.g. 8 RON
}

export interface StorePurchaseItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isPromo?: boolean;
  savingsVsHighest: number;
}

export interface StoreStopPlan {
  store: Store;
  items: StorePurchaseItem[];
  subtotal: number;
  distanceFromPrevKm: number;
  durationMinutes: number;
}

export type StrategyType = 'smart_balance' | 'one_stop' | 'max_savings';

export interface StrategyResult {
  type: StrategyType;
  title: string;
  badge: string;
  tagline: string;
  stops: StoreStopPlan[];
  productsTotal: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  transportCost: number;
  totalEffectiveCost: number; // productsTotal + transportCost + extraStopFriction
  netSavings: number; // compared to most expensive single store
  missingItemsCount: number;
}

export interface OptimizationOverview {
  userLocation: { lat: number; lng: number; label: string };
  settings: OptimizerSettings;
  strategies: {
    smart_balance: StrategyResult | null;
    one_stop: StrategyResult | null;
    max_savings: StrategyResult | null;
  };
  cheapestSingleStoreId?: string;
  highestSingleStoreCost: number;
}

export interface PromotionalDeal {
  id: string;
  product: Product;
  chain: StoreChain;
  price: number;
  oldPrice: number;
  discountPercent: number;
  savingsLei: number;
  promoLabel: string;
  validUntil: string;
}

