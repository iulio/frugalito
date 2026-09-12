import type { Product, PromotionalDeal, StoreChain } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- LEGUME & FRUCTE ---
  {
    id: 'cartofi_albi',
    name: 'Cartofi albi de consum',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 2,
    prices: {
      lidl: { price: 2.46, oldPrice: 2.89, available: true, isPromo: true, promoLabel: '-15% SuperPreț' },
      kaufland: { price: 2.49, available: true }, // exact exemplul utilizatorului (+3 bani)
      carrefour: { price: 2.59, available: true },
      auchan: { price: 2.49, available: true },
      mega_image: { price: 2.89, available: true },
      penny: { price: 2.45, oldPrice: 2.79, available: true, isPromo: true, promoLabel: 'Promoție Săptămânală' },
      profi: { price: 2.69, available: true },
    },
  },
  {
    id: 'ceapa_galbena',
    name: 'Ceapă galbenă uscată',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 1,
    prices: {
      lidl: { price: 2.99, available: true },
      kaufland: { price: 2.89, oldPrice: 3.49, available: true, isPromo: true, promoLabel: '-17% Kaufland Card' },
      carrefour: { price: 3.19, available: true },
      auchan: { price: 2.95, available: true },
      mega_image: { price: 3.49, available: true },
      penny: { price: 2.89, available: true },
      profi: { price: 3.29, available: true },
    },
  },
  {
    id: 'morcovi',
    name: 'Morcovi proaspeți calitatea I',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 1,
    prices: {
      lidl: { price: 3.29, available: true },
      kaufland: { price: 2.99, oldPrice: 3.79, available: true, isPromo: true, promoLabel: '-21% Ofertă Prospețime' },
      carrefour: { price: 3.49, available: true },
      auchan: { price: 3.19, available: true },
      mega_image: { price: 3.89, available: true },
      penny: { price: 3.09, available: true },
      profi: { price: 3.59, available: true },
    },
  },
  {
    id: 'rosii',
    name: 'Roșii proaspete ciorchine',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 1.5,
    prices: {
      lidl: { price: 8.99, available: true },
      kaufland: { price: 7.99, oldPrice: 10.99, available: true, isPromo: true, promoLabel: '-27% Promoție' },
      carrefour: { price: 9.49, available: true },
      auchan: { price: 8.49, available: true },
      mega_image: { price: 11.20, available: true },
      penny: { price: 8.29, available: true },
      profi: { price: 9.99, available: true },
    },
  },
  {
    id: 'banane',
    name: 'Banane premium',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 1.5,
    prices: {
      lidl: { price: 5.99, available: true },
      kaufland: { price: 5.79, available: true, isPromo: true, promoLabel: '-12%' },
      carrefour: { price: 6.49, available: true },
      auchan: { price: 5.99, available: true },
      mega_image: { price: 7.29, available: true },
      penny: { price: 5.89, available: true },
      profi: { price: 6.79, available: true },
    },
  },
  {
    id: 'mere_idared',
    name: 'Mere românești Idared',
    category: 'legume_fructe',
    unit: 'kg',
    defaultQty: 2,
    prices: {
      lidl: { price: 4.49, available: true },
      kaufland: { price: 4.29, available: true },
      carrefour: { price: 4.89, available: true },
      auchan: { price: 4.19, available: true, isPromo: true, promoLabel: '-15%' },
      mega_image: { price: 5.49, available: true },
      penny: { price: 4.39, available: true },
      profi: { price: 4.99, available: true },
    },
  },

  // --- LACTATE & OUĂ ---
  {
    id: 'lapte_1_5',
    name: 'Lapte proaspăt 1.5% grăsime (1L)',
    category: 'lactate_oua',
    unit: 'buc',
    defaultQty: 2,
    prices: {
      lidl: { price: 5.19, available: true }, // Pilos
      kaufland: { price: 5.25, available: true }, // K-Classic
      carrefour: { price: 5.49, available: true },
      auchan: { price: 5.19, available: true },
      mega_image: { price: 6.20, available: true },
      penny: { price: 5.09, available: true, isPromo: true, promoLabel: 'SuperPreț' },
      profi: { price: 5.89, available: true },
    },
  },
  {
    id: 'lapte_3_5',
    name: 'Lapte 3.5% grăsime (1L)',
    category: 'lactate_oua',
    unit: 'buc',
    defaultQty: 2,
    prices: {
      lidl: { price: 6.19, available: true },
      kaufland: { price: 6.29, available: true },
      carrefour: { price: 6.69, available: true },
      auchan: { price: 6.19, available: true },
      mega_image: { price: 7.49, available: true },
      penny: { price: 6.15, available: true },
      profi: { price: 6.99, available: true },
    },
  },
  {
    id: 'oua_m_10',
    name: 'Ouă de găină proaspete mărimea M (10 buc)',
    category: 'lactate_oua',
    unit: 'pachet',
    defaultQty: 1,
    prices: {
      lidl: { price: 9.49, available: true },
      kaufland: { price: 8.99, available: true, isPromo: true, promoLabel: '-15%' },
      carrefour: { price: 10.20, available: true },
      auchan: { price: 9.69, available: true },
      mega_image: { price: 11.90, available: true },
      penny: { price: 9.29, available: true },
      profi: { price: 10.50, available: true },
    },
  },
  {
    id: 'iaurt_grecesc_10',
    name: 'Iaurt grecesc 10% grăsime (400g)',
    category: 'lactate_oua',
    unit: 'buc',
    defaultQty: 2,
    prices: {
      lidl: { price: 5.49, available: true }, // Milbona
      kaufland: { price: 5.59, available: true },
      carrefour: { price: 6.49, available: true },
      auchan: { price: 5.89, available: true },
      mega_image: { price: 7.20, available: true },
      penny: { price: 5.39, available: true },
      profi: { price: 6.69, available: true },
    },
  },
  {
    id: 'unt_82',
    name: 'Unt 82% grăsime (200g)',
    category: 'lactate_oua',
    unit: 'buc',
    defaultQty: 1,
    prices: {
      lidl: { price: 10.99, available: true },
      kaufland: { price: 9.99, available: true, isPromo: true, promoLabel: '-20%' },
      carrefour: { price: 11.90, available: true },
      auchan: { price: 10.79, available: true },
      mega_image: { price: 13.50, available: true },
      penny: { price: 10.49, available: true },
      profi: { price: 12.20, available: true },
    },
  },
  {
    id: 'telemea_vaca_500g',
    name: 'Telemea de vacă maturată (500g)',
    category: 'lactate_oua',
    unit: 'buc',
    defaultQty: 1,
    prices: {
      lidl: { price: 17.99, available: true },
      kaufland: { price: 16.99, available: true, isPromo: true, promoLabel: '-18%' },
      carrefour: { price: 19.50, available: true },
      auchan: { price: 18.20, available: true },
      mega_image: { price: 22.90, available: true },
      penny: { price: 17.49, available: true },
      profi: { price: 20.50, available: true },
    },
  },

  // --- CARNE & MEZELURI ---
  {
    id: 'piept_pui_dezosat',
    name: 'Piept de pui dezosat fără piele (1kg)',
    category: 'carne_mezeluri',
    unit: 'kg',
    defaultQty: 1.5,
    prices: {
      lidl: { price: 26.99, available: true, isPromo: true, promoLabel: '-15%' },
      kaufland: { price: 27.99, available: true },
      carrefour: { price: 31.50, available: true },
      auchan: { price: 28.90, available: true },
      mega_image: { price: 35.20, available: true },
      penny: { price: 27.49, available: true },
      profi: { price: 33.90, available: true },
    },
  },
  {
    id: 'pulpe_pui_superioare',
    name: 'Pulpe de pui superioare dezosate (1kg)',
    category: 'carne_mezeluri',
    unit: 'kg',
    defaultQty: 1,
    prices: {
      lidl: { price: 21.99, available: true },
      kaufland: { price: 20.49, available: true, isPromo: true, promoLabel: '-20%' },
      carrefour: { price: 23.90, available: true },
      auchan: { price: 22.10, available: true },
      mega_image: { price: 27.50, available: true },
      penny: { price: 21.49, available: true },
      profi: { price: 25.90, available: true },
    },
  },
  {
    id: 'carne_tocata_amestec',
    name: 'Carne tocată amestec porc-vită (500g)',
    category: 'carne_mezeluri',
    unit: 'pachet',
    defaultQty: 2,
    prices: {
      lidl: { price: 12.99, available: true },
      kaufland: { price: 11.99, available: true, isPromo: true, promoLabel: '-22%' },
      carrefour: { price: 14.50, available: true },
      auchan: { price: 13.20, available: true },
      mega_image: { price: 16.90, available: true },
      penny: { price: 12.49, available: true },
      profi: { price: 15.40, available: true },
    },
  },

  // --- PANIFICAȚIE ---
  {
    id: 'paine_toast_alba',
    name: 'Pâine toast feliată albă (600g)',
    category: 'panificatie',
    unit: 'buc',
    defaultQty: 1,
    prices: {
      lidl: { price: 4.49, available: true },
      kaufland: { price: 4.59, available: true },
      carrefour: { price: 4.99, available: true },
      auchan: { price: 4.39, available: true },
      mega_image: { price: 5.79, available: true },
      penny: { price: 4.29, available: true, isPromo: true, promoLabel: 'Promo' },
      profi: { price: 5.29, available: true },
    },
  },
  {
    id: 'paine_franzela_alba',
    name: 'Franzelă albă simplă (300g)',
    category: 'panificatie',
    unit: 'buc',
    defaultQty: 2,
    prices: {
      lidl: { price: 1.89, available: true },
      kaufland: { price: 1.79, available: true },
      carrefour: { price: 2.19, available: true },
      auchan: { price: 1.85, available: true },
      mega_image: { price: 2.69, available: true },
      penny: { price: 1.89, available: true },
      profi: { price: 2.39, available: true },
    },
  },

  // --- BĂCĂNIE ---
  {
    id: 'ulei_floarea_soarelui_1l',
    name: 'Ulei rafinat floarea-soarelui (1L)',
    category: 'bacanie',
    unit: 'buc',
    defaultQty: 2,
    prices: {
      lidl: { price: 6.89, available: true },
      kaufland: { price: 6.49, available: true, isPromo: true, promoLabel: '-16%' },
      carrefour: { price: 7.29, available: true },
      auchan: { price: 6.79, available: true },
      mega_image: { price: 8.49, available: true },
      penny: { price: 6.69, available: true },
      profi: { price: 7.89, available: true },
    },
  },
  {
    id: 'faina_alba_000',
    name: 'Făină albă de grâu tip 000 (1kg)',
    category: 'bacanie',
    unit: 'kg',
    defaultQty: 2,
    prices: {
      lidl: { price: 2.99, available: true },
      kaufland: { price: 2.89, available: true },
      carrefour: { price: 3.29, available: true },
      auchan: { price: 2.89, available: true },
      mega_image: { price: 3.79, available: true },
      penny: { price: 2.79, available: true, isPromo: true, promoLabel: 'Hit Preț' },
      profi: { price: 3.39, available: true },
    },
  },
  {
    id: 'zahar_alb_1kg',
    name: 'Zahăr alb cristal (1kg)',
    category: 'bacanie',
    unit: 'kg',
    defaultQty: 2,
    prices: {
      lidl: { price: 4.39, available: true },
      kaufland: { price: 4.29, available: true },
      carrefour: { price: 4.69, available: true },
      auchan: { price: 4.35, available: true },
      mega_image: { price: 5.19, available: true },
      penny: { price: 4.19, available: true, isPromo: true, promoLabel: 'Promo' },
      profi: { price: 4.89, available: true },
    },
  },
  {
    id: 'paste_penne_500g',
    name: 'Paste Barilla Penne Rigate (500g)',
    category: 'bacanie',
    unit: 'pachet',
    defaultQty: 2,
    prices: {
      lidl: { price: 4.99, available: true, isPromo: true, promoLabel: '-30%' },
      kaufland: { price: 5.49, available: true },
      carrefour: { price: 6.20, available: true },
      auchan: { price: 5.79, available: true },
      mega_image: { price: 7.50, available: true },
      penny: { price: 5.69, available: true },
      profi: { price: 6.90, available: true },
    },
  },
  {
    id: 'cafea_boabe_500g',
    name: 'Cafea măcinată Jacobs Krönung (500g)',
    category: 'bacanie',
    unit: 'pachet',
    defaultQty: 1,
    prices: {
      lidl: { price: 26.90, available: true },
      kaufland: { price: 23.99, available: true, isPromo: true, promoLabel: '-28%' },
      carrefour: { price: 28.50, available: true },
      auchan: { price: 25.90, available: true },
      mega_image: { price: 32.90, available: true },
      penny: { price: 24.99, available: true },
      profi: { price: 29.90, available: true },
    },
  },

  // --- BĂUTURI ---
  {
    id: 'apa_plata_borsec_2l',
    name: 'Apă minerală naturală plată Borsec (2L)',
    category: 'bauturi',
    unit: 'buc',
    defaultQty: 6,
    prices: {
      lidl: { price: 3.49, available: true },
      kaufland: { price: 3.39, available: true },
      carrefour: { price: 3.69, available: true },
      auchan: { price: 3.29, available: true, isPromo: true, promoLabel: 'Pachet 6x' },
      mega_image: { price: 4.19, available: true },
      penny: { price: 3.39, available: true },
      profi: { price: 3.89, available: true },
    },
  },
  {
    id: 'bere_blonda_doza',
    name: 'Bere blondă Ursus Premium doză (0.5L)',
    category: 'bauturi',
    unit: 'buc',
    defaultQty: 6,
    prices: {
      lidl: { price: 3.89, available: true },
      kaufland: { price: 3.69, available: true, isPromo: true, promoLabel: '-18%' },
      carrefour: { price: 4.19, available: true },
      auchan: { price: 3.79, available: true },
      mega_image: { price: 4.79, available: true },
      penny: { price: 3.75, available: true },
      profi: { price: 4.39, available: true },
    },
  },

  // --- CURĂȚENIE & MENAJ ---
  {
    id: 'detergent_rufe_ariel',
    name: 'Detergent rufe pudră/lichid Ariel 40 spălări',
    category: 'curatenie_menaj',
    unit: 'buc',
    defaultQty: 1,
    prices: {
      lidl: { price: 56.90, available: true },
      kaufland: { price: 49.99, available: true, isPromo: true, promoLabel: '-32%' }, // mega promo
      carrefour: { price: 62.50, available: true },
      auchan: { price: 54.90, available: true },
      mega_image: { price: 74.90, available: true },
      penny: { price: 52.90, available: true },
      profi: { price: 66.50, available: true },
    },
  },
  {
    id: 'detergent_vase_fairy',
    name: 'Detergent pentru vase Fairy Lemon (800ml)',
    category: 'curatenie_menaj',
    unit: 'buc',
    defaultQty: 1,
    prices: {
      lidl: { price: 12.49, available: true },
      kaufland: { price: 10.99, available: true, isPromo: true, promoLabel: '-20%' },
      carrefour: { price: 13.20, available: true },
      auchan: { price: 11.89, available: true },
      mega_image: { price: 15.50, available: true },
      penny: { price: 11.49, available: true },
      profi: { price: 13.90, available: true },
    },
  },
  {
    id: 'hartie_igienica_zewa',
    name: 'Hârtie igienică Zewa Deluxe 3 straturi (8 role)',
    category: 'curatenie_menaj',
    unit: 'pachet',
    defaultQty: 1,
    prices: {
      lidl: { price: 18.99, available: true },
      kaufland: { price: 17.49, available: true, isPromo: true, promoLabel: '-25%' },
      carrefour: { price: 21.50, available: true },
      auchan: { price: 19.20, available: true },
      mega_image: { price: 24.90, available: true },
      penny: { price: 18.49, available: true },
      profi: { price: 22.90, available: true },
    },
  },
];

export const CATEGORY_LABELS: Record<string, { label: string; iconName: string }> = {
  legume_fructe: { label: 'Legume & Fructe', iconName: 'Apple' },
  lactate_oua: { label: 'Lactate & Ouă', iconName: 'Egg' },
  carne_mezeluri: { label: 'Carne & Mezeluri', iconName: 'Drumstick' },
  panificatie: { label: 'Panificație', iconName: 'Wheat' },
  bacanie: { label: 'Băcănie', iconName: 'Package' },
  bauturi: { label: 'Băuturi', iconName: 'CupSoda' },
  curatenie_menaj: { label: 'Curățenie & Menaj', iconName: 'Sparkles' },
  dulciuri_gustari: { label: 'Dulciuri & Gustări', iconName: 'Cookie' },
};

export const SAMPLE_BASKETS = [
  {
    name: 'Coș Esențial de Bază',
    description: 'Cartofi, Pâine, Lapte, Ouă, Ulei, Făină',
    items: [
      { productId: 'cartofi_albi', quantity: 2 },
      { productId: 'paine_toast_alba', quantity: 1 },
      { productId: 'lapte_1_5', quantity: 2 },
      { productId: 'oua_m_10', quantity: 1 },
      { productId: 'ulei_floarea_soarelui_1l', quantity: 1 },
      { productId: 'faina_alba_000', quantity: 1 },
    ],
  },
  {
    name: 'Cumpărături Mari de Weekend',
    description: 'Familie: carne, legume, lactate, cafea, detergent Ariel',
    items: [
      { productId: 'piept_pui_dezosat', quantity: 2 },
      { productId: 'carne_tocata_amestec', quantity: 2 },
      { productId: 'cartofi_albi', quantity: 4 },
      { productId: 'rosii', quantity: 2 },
      { productId: 'banane', quantity: 2 },
      { productId: 'lapte_3_5', quantity: 3 },
      { productId: 'oua_m_10', quantity: 2 },
      { productId: 'telemea_vaca_500g', quantity: 1 },
      { productId: 'unt_82', quantity: 1 },
      { productId: 'paste_penne_500g', quantity: 3 },
      { productId: 'cafea_boabe_500g', quantity: 1 },
      { productId: 'apa_plata_borsec_2l', quantity: 6 },
      { productId: 'detergent_rufe_ariel', quantity: 1 },
      { productId: 'hartie_igienica_zewa', quantity: 1 },
    ],
  },
  {
    name: 'Grătar & Relaxare',
    description: 'Carne, pâine, legume proaspete, bere rece',
    items: [
      { productId: 'pulpe_pui_superioare', quantity: 2 },
      { productId: 'rosii', quantity: 2 },
      { productId: 'ceapa_galbena', quantity: 1 },
      { productId: 'paine_franzela_alba', quantity: 3 },
      { productId: 'bere_blonda_doza', quantity: 12 },
      { productId: 'apa_plata_borsec_2l', quantity: 4 },
    ],
  },
];

export function getPromotionalDeals(products: Product[]): PromotionalDeal[] {
  const deals: PromotionalDeal[] = [];

  products.forEach((product) => {
    Object.entries(product.prices).forEach(([chainKey, priceInfo]) => {
      if (priceInfo && priceInfo.available && priceInfo.isPromo) {
        const chain = chainKey as StoreChain;
        const price = priceInfo.price;
        const oldPrice = priceInfo.oldPrice || Math.round((price * 1.25) * 100) / 100;
        const savingsLei = Math.round((oldPrice - price) * 100) / 100;
        const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);

        deals.push({
          id: `${product.id}_${chain}`,
          product,
          chain,
          price,
          oldPrice,
          discountPercent,
          savingsLei,
          promoLabel: priceInfo.promoLabel || `-${discountPercent}% Ofertă`,
          validUntil: 'Duminică, 15 Sept.',
        });
      }
    });
  });

  // Sort by highest discount percentage
  return deals.sort((a, b) => b.discountPercent - a.discountPercent);
}

