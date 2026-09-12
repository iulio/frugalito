import type { TransportMode } from '../types';

/**
 * Calculates the great-circle distance between two points in kilometers (Haversine formula).
 */
export function getHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDist = R * c;
  
  // Apply a road detour factor (~1.3 in urban street networks)
  return Math.round(straightDist * 1.3 * 100) / 100;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimates travel duration in minutes based on distance and transport mode.
 */
export function estimateTravelTimeMinutes(
  distanceKm: number,
  mode: TransportMode
): number {
  if (mode === 'car') {
    // Average urban speed: 28 km/h + 3 min traffic/parking
    const driveTime = (distanceKm / 28) * 60;
    return Math.max(2, Math.round(driveTime + 2));
  } else {
    // Walking / cycling average speed: ~5 km/h
    const walkTime = (distanceKm / 5) * 60;
    return Math.max(1, Math.round(walkTime));
  }
}

/**
 * Formats distance nicely (e.g. 750 m or 3.2 km).
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Formats price in Romanian Lei.
 */
export function formatMoney(amount: number): string {
  return `${amount.toFixed(2)} lei`;
}
