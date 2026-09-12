import type {
  Store,
  ShoppingItem,
  OptimizerSettings,
  StrategyResult,
  StoreStopPlan,
  StorePurchaseItem,
  OptimizationOverview,
} from '../types';
import {
  getHaversineDistanceKm,
  estimateTravelTimeMinutes,
} from './geoUtils';

/**
 * Optimizes the shopping basket considering store prices, distance, travel mode, and stop friction.
 */
export function optimizeShoppingList(
  shoppingList: ShoppingItem[],
  allStores: Store[],
  userLocation: { lat: number; lng: number; label: string },
  settings: OptimizerSettings
): OptimizationOverview {
  if (shoppingList.length === 0) {
    return {
      userLocation,
      settings,
      strategies: {
        smart_balance: null,
        one_stop: null,
        max_savings: null,
      },
      highestSingleStoreCost: 0,
    };
  }

  // 1. Filter stores within search radius (expand if less than 3 stores found)
  let candidateStores = allStores.map((store) => {
    const distFromUser = getHaversineDistanceKm(
      userLocation.lat,
      userLocation.lng,
      store.lat,
      store.lng
    );
    return { store, distFromUser };
  });

  candidateStores.sort((a, b) => a.distFromUser - b.distFromUser);

  let inRadius = candidateStores.filter(
    (s) => s.distFromUser <= settings.searchRadiusKm
  );
  if (inRadius.length < 3) {
    inRadius = candidateStores.slice(0, Math.min(5, candidateStores.length));
  }

  const stores = inRadius.map((s) => s.store);

  // 2. Evaluate all single stores (One-Stop candidates)
  const singleStoreEvaluations = stores.map((store) => {
    const stopPlan = buildStopPlanForStore(store, shoppingList, userLocation);
    const roundTripKm = Math.round(stopPlan.distanceFromPrevKm * 2 * 10) / 10;
    const travelDuration = estimateTravelTimeMinutes(roundTripKm, settings.transportMode);
    const transportCost = calculateTransportCost(roundTripKm, 1, settings);

    const totalEffectiveCost = stopPlan.subtotal + transportCost;

    return {
      store,
      stopPlan,
      roundTripKm,
      travelDuration,
      transportCost,
      totalEffectiveCost,
      missingCount: shoppingList.length - stopPlan.items.length,
    };
  });

  // Sort by total effective cost
  singleStoreEvaluations.sort((a, b) => a.totalEffectiveCost - b.totalEffectiveCost);

  const bestSingle = singleStoreEvaluations[0];
  const worstSingle = singleStoreEvaluations[singleStoreEvaluations.length - 1];
  const baselineCost = worstSingle ? worstSingle.stopPlan.subtotal : (bestSingle?.stopPlan.subtotal || 0);

  // Strategy 1: One-Stop Shop
  let oneStopResult: StrategyResult | null = null;
  if (bestSingle) {
    oneStopResult = {
      type: 'one_stop',
      title: 'Totul dintr-un singur magazin',
      badge: 'Confort Maxim',
      tagline: `Cumperi totul de la ${bestSingle.store.name} fără opriri suplimentare.`,
      stops: [
        {
          ...bestSingle.stopPlan,
          distanceFromPrevKm: bestSingle.roundTripKm,
          durationMinutes: bestSingle.travelDuration,
        },
      ],
      productsTotal: bestSingle.stopPlan.subtotal,
      totalDistanceKm: bestSingle.roundTripKm,
      totalDurationMinutes: bestSingle.travelDuration,
      transportCost: bestSingle.transportCost,
      totalEffectiveCost: bestSingle.totalEffectiveCost,
      netSavings: Math.max(0, baselineCost - bestSingle.stopPlan.subtotal),
      missingItemsCount: bestSingle.missingCount,
    };
  }

  // Strategy 2: Max Savings (Hardcore Frugal - absolute lowest price per item)
  const maxSavingsResult = buildMaxSavingsStrategy(
    shoppingList,
    stores,
    userLocation,
    settings,
    baselineCost
  );

  // Strategy 3: Smart Balance (Optimal 1-2 stores tradeoff)
  const smartBalanceResult = buildSmartBalanceStrategy(
    shoppingList,
    stores,
    userLocation,
    settings,
    oneStopResult,
    maxSavingsResult,
    baselineCost
  );

  return {
    userLocation,
    settings,
    strategies: {
      smart_balance: smartBalanceResult,
      one_stop: oneStopResult,
      max_savings: maxSavingsResult,
    },
    cheapestSingleStoreId: bestSingle?.store.id,
    highestSingleStoreCost: baselineCost,
  };
}

/**
 * Calculates transport cost based on distance, stop friction, and transport mode.
 */
function calculateTransportCost(
  distanceKm: number,
  storeCount: number,
  settings: OptimizerSettings
): number {
  if (settings.transportMode === 'car') {
    const fuel = distanceKm * settings.fuelCostPerKm;
    // Friction penalty for additional stores (starting from store 2)
    const extraStops = Math.max(0, storeCount - 1);
    const stopFriction = extraStops * settings.storeStopFrictionCost;
    return Math.round((fuel + stopFriction) * 100) / 100;
  } else {
    // Foot / Bicycle: 0 fuel cost, but time & effort friction per extra stop
    const extraStops = Math.max(0, storeCount - 1);
    const walkingEffort = extraStops * settings.footTimeFrictionCostPerStore;
    return Math.round(walkingEffort * 100) / 100;
  }
}

/**
 * Creates purchase item plan for a single store.
 */
function buildStopPlanForStore(
  store: Store,
  shoppingList: ShoppingItem[],
  userLocation: { lat: number; lng: number }
): StoreStopPlan {
  const distFromUser = getHaversineDistanceKm(
    userLocation.lat,
    userLocation.lng,
    store.lat,
    store.lng
  );

  const items: StorePurchaseItem[] = [];
  let subtotal = 0;

  for (const item of shoppingList) {
    const priceInfo = item.product.prices[store.chain];
    if (priceInfo && priceInfo.available) {
      const totalPrice = item.quantity * priceInfo.price;
      subtotal += totalPrice;
      items.push({
        product: item.product,
        quantity: item.quantity,
        unitPrice: priceInfo.price,
        totalPrice,
        isPromo: priceInfo.isPromo,
        savingsVsHighest: 0,
      });
    }
  }

  return {
    store,
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    distanceFromPrevKm: distFromUser,
    durationMinutes: 0,
  };
}

/**
 * Builds the Max Savings strategy where every item is bought at its absolute cheapest store.
 */
function buildMaxSavingsStrategy(
  shoppingList: ShoppingItem[],
  stores: Store[],
  userLocation: { lat: number; lng: number },
  settings: OptimizerSettings,
  baselineCost: number
): StrategyResult | null {
  // For each item, find the store with lowest price
  const storeItemsMap = new Map<string, StorePurchaseItem[]>();

  for (const item of shoppingList) {
    let cheapestStore: Store | null = null;
    let minPrice = Infinity;
    let isPromo = false;

    for (const store of stores) {
      const pInfo = item.product.prices[store.chain];
      if (pInfo && pInfo.available && pInfo.price < minPrice) {
        minPrice = pInfo.price;
        cheapestStore = store;
        isPromo = !!pInfo.isPromo;
      }
    }

    if (cheapestStore) {
      const currentList = storeItemsMap.get(cheapestStore.id) || [];
      const totalPrice = item.quantity * minPrice;
      currentList.push({
        product: item.product,
        quantity: item.quantity,
        unitPrice: minPrice,
        totalPrice,
        isPromo,
        savingsVsHighest: 0,
      });
      storeItemsMap.set(cheapestStore.id, currentList);
    }
  }

  // Get active stores and order route
  const activeStores = stores.filter((s) => storeItemsMap.has(s.id));
  if (activeStores.length === 0) return null;

  const orderedRoute = orderRouteTsp(userLocation, activeStores);
  const stops: StoreStopPlan[] = [];
  let productsTotal = 0;
  let totalDistanceKm = 0;
  let prevPoint = userLocation;

  for (const store of orderedRoute) {
    const items = storeItemsMap.get(store.id) || [];
    const subtotal = items.reduce((acc, i) => acc + i.totalPrice, 0);
    productsTotal += subtotal;

    const legDistance = getHaversineDistanceKm(
      prevPoint.lat,
      prevPoint.lng,
      store.lat,
      store.lng
    );
    totalDistanceKm += legDistance;

    const legDuration = estimateTravelTimeMinutes(legDistance, settings.transportMode);

    stops.push({
      store,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      distanceFromPrevKm: legDistance,
      durationMinutes: legDuration,
    });

    prevPoint = { lat: store.lat, lng: store.lng };
  }

  // Add return leg to user location
  const returnDist = getHaversineDistanceKm(
    prevPoint.lat,
    prevPoint.lng,
    userLocation.lat,
    userLocation.lng
  );
  totalDistanceKm += returnDist;

  const totalDistance = Math.round(totalDistanceKm * 10) / 10;
  const totalDuration = estimateTravelTimeMinutes(totalDistance, settings.transportMode);
  const transportCost = calculateTransportCost(totalDistance, stops.length, settings);
  const totalEffectiveCost = Math.round((productsTotal + transportCost) * 100) / 100;

  return {
    type: 'max_savings',
    title: 'Economie Extremă (Toate ofertele)',
    badge: `${stops.length} Magazine`,
    tagline: `Fiecare produs este cumpărat din magazinul cu prețul cel mai mic garantat.`,
    stops,
    productsTotal: Math.round(productsTotal * 100) / 100,
    totalDistanceKm: totalDistance,
    totalDurationMinutes: totalDuration,
    transportCost,
    totalEffectiveCost,
    netSavings: Math.max(0, Math.round((baselineCost - productsTotal) * 100) / 100),
    missingItemsCount: 0,
  };
}

/**
 * Builds the Smart Balance strategy (evaluates pairs of stores and compares with one-stop).
 */
function buildSmartBalanceStrategy(
  shoppingList: ShoppingItem[],
  stores: Store[],
  userLocation: { lat: number; lng: number },
  settings: OptimizerSettings,
  oneStopResult: StrategyResult | null,
  maxSavingsResult: StrategyResult | null,
  baselineCost: number
): StrategyResult {
  // If only 1 or 2 stores available, fallback to oneStop or maxSavings
  if (stores.length < 2 || !oneStopResult) {
    return oneStopResult || maxSavingsResult!;
  }

  // If shopping list is very small (1-2 items), going to multiple stores rarely makes sense
  // unless price difference is huge.
  let bestStrategy: StrategyResult = oneStopResult;
  let lowestEffectiveCost = oneStopResult.totalEffectiveCost;

  // Evaluate all pairs of stores (2 stores)
  for (let i = 0; i < stores.length; i++) {
    for (let j = i + 1; j < stores.length; j++) {
      const storeA = stores[i];
      const storeB = stores[j];

      // Route: User -> StoreA -> StoreB -> User (or reverse)
      const route1 = [storeA, storeB];
      const route2 = [storeB, storeA];

      const dist1 = calculateLoopDistance(userLocation, route1);
      const dist2 = calculateLoopDistance(userLocation, route2);
      const chosenRoute = dist1 <= dist2 ? route1 : route2;
      const totalDist = Math.min(dist1, dist2);

      const itemsA: StorePurchaseItem[] = [];
      const itemsB: StorePurchaseItem[] = [];
      let productsSum = 0;

      for (const item of shoppingList) {
        const priceA = item.product.prices[storeA.chain]?.price ?? Infinity;
        const priceB = item.product.prices[storeB.chain]?.price ?? Infinity;

        if (priceA === Infinity && priceB === Infinity) continue;

        if (priceA <= priceB) {
          const totalPrice = item.quantity * priceA;
          productsSum += totalPrice;
          itemsA.push({
            product: item.product,
            quantity: item.quantity,
            unitPrice: priceA,
            totalPrice,
            isPromo: item.product.prices[storeA.chain]?.isPromo,
            savingsVsHighest: 0,
          });
        } else {
          const totalPrice = item.quantity * priceB;
          productsSum += totalPrice;
          itemsB.push({
            product: item.product,
            quantity: item.quantity,
            unitPrice: priceB,
            totalPrice,
            isPromo: item.product.prices[storeB.chain]?.isPromo,
            savingsVsHighest: 0,
          });
        }
      }

      // If one store ended up with 0 items, it's just a 1-store plan
      if (itemsA.length === 0 || itemsB.length === 0) continue;

      const transportCost = calculateTransportCost(totalDist, 2, settings);
      const effectiveCost = productsSum + transportCost;

      // Check if this 2-store split is genuinely better than the best so far
      // by at least 2 RON net to justify the inconvenience
      if (effectiveCost < lowestEffectiveCost - 2.0) {
        lowestEffectiveCost = effectiveCost;

        // Build stops
        const stops: StoreStopPlan[] = [];
        let prev = userLocation;

        for (const st of chosenRoute) {
          const stItems = st.id === storeA.id ? itemsA : itemsB;
          const subtotal = stItems.reduce((acc, it) => acc + it.totalPrice, 0);
          const legDist = getHaversineDistanceKm(prev.lat, prev.lng, st.lat, st.lng);
          stops.push({
            store: st,
            items: stItems,
            subtotal: Math.round(subtotal * 100) / 100,
            distanceFromPrevKm: legDist,
            durationMinutes: estimateTravelTimeMinutes(legDist, settings.transportMode),
          });
          prev = { lat: st.lat, lng: st.lng };
        }

        bestStrategy = {
          type: 'smart_balance',
          title: 'Traseu Optim Recomandat',
          badge: '2 Magazine',
          tagline: `Economisești substanțial împărțind coșul între ${chosenRoute[0].name} și ${chosenRoute[1].name}.`,
          stops,
          productsTotal: Math.round(productsSum * 100) / 100,
          totalDistanceKm: totalDist,
          totalDurationMinutes: estimateTravelTimeMinutes(totalDist, settings.transportMode),
          transportCost,
          totalEffectiveCost: Math.round(effectiveCost * 100) / 100,
          netSavings: Math.max(0, Math.round((baselineCost - productsSum) * 100) / 100),
          missingItemsCount: 0,
        };
      }
    }
  }

  // If no 2-store split justified the extra stop and fuel, the 1-store is the Smart Balance!
  if (bestStrategy.type === 'one_stop') {
    return {
      ...oneStopResult,
      type: 'smart_balance',
      title: 'Traseu Optim Recomandat (Un Singur Magazin)',
      badge: 'Recomandat',
      tagline: `Diferențele de preț din alte magazine nu justifică deplasarea suplimentară. Cumperi cel mai rentabil de la ${bestStrategy.stops[0].store.name}.`,
    };
  }

  return bestStrategy;
}

/**
 * Calculates total round-trip distance for a list of stops starting and ending at userLocation.
 */
function calculateLoopDistance(
  userLocation: { lat: number; lng: number },
  stops: Store[]
): number {
  let total = 0;
  let prev = userLocation;

  for (const st of stops) {
    total += getHaversineDistanceKm(prev.lat, prev.lng, st.lat, st.lng);
    prev = { lat: st.lat, lng: st.lng };
  }

  total += getHaversineDistanceKm(prev.lat, prev.lng, userLocation.lat, userLocation.lng);
  return Math.round(total * 10) / 10;
}

/**
 * Simple greedy TSP ordering from user location.
 */
function orderRouteTsp(
  userLocation: { lat: number; lng: number },
  stores: Store[]
): Store[] {
  const unvisited = [...stores];
  const ordered: Store[] = [];
  let currentPos = userLocation;

  while (unvisited.length > 0) {
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getHaversineDistanceKm(
        currentPos.lat,
        currentPos.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    const nextStore = unvisited.splice(closestIndex, 1)[0];
    ordered.push(nextStore);
    currentPos = { lat: nextStore.lat, lng: nextStore.lng };
  }

  return ordered;
}
