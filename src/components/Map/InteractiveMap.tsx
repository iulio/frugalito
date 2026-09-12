import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Store, StrategyResult } from '../../types';
import { STORE_CHAINS } from '../../data/storesData';
import { formatDistance, formatMoney } from '../../services/geoUtils';

interface InteractiveMapProps {
  userLocation: { lat: number; lng: number; label: string };
  stores: Store[];
  selectedStrategy: StrategyResult | null;
  searchRadiusKm: number;
  onSelectUserLocation: (lat: number, lng: number) => void;
  onSelectStore?: (store: Store) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  userLocation,
  stores,
  selectedStrategy,
  searchRadiusKm,
  onSelectUserLocation,
  onSelectStore,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Standard OpenStreetMap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      onSelectUserLocation(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view when userLocation changes significantly
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 13);
  }, [userLocation.lat, userLocation.lng]);

  // Update markers, radius circle, and route polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !routeLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();

    // 1. Draw Radius Circle
    L.circle([userLocation.lat, userLocation.lng], {
      radius: searchRadiusKm * 1000,
      color: '#3b82f6',
      weight: 1.5,
      dashArray: '5, 5',
      fillColor: '#3b82f6',
      fillOpacity: 0.05,
    }).addTo(markersLayerRef.current);

    // 2. User Location Marker (Pulsing radar)
    const userIcon = L.divIcon({
      className: '',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="user-marker-pulse"></div>
          <div class="absolute -bottom-6 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
            Tu ești aici
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(markersLayerRef.current);

    userMarker.bindPopup(`
      <div class="p-2 text-center text-slate-800">
        <p class="font-bold text-sm">📍 Locația Ta Curentă</p>
        <p class="text-xs text-slate-500 mt-0.5">${userLocation.label}</p>
        <p class="text-[11px] text-blue-600 mt-1 font-medium">Fă click oriunde pe hartă pentru a repoziționa</p>
      </div>
    `);

    // 3. Store Markers
    stores.forEach((store) => {
      const chainConfig = STORE_CHAINS[store.chain];
      const isSelectedInRoute = selectedStrategy?.stops.some(
        (stop) => stop.store.id === store.id
      );
      const stopIndex = selectedStrategy?.stops.findIndex(
        (stop) => stop.store.id === store.id
      );

      const storeIcon = L.divIcon({
        className: '',
        html: `
          <div class="store-pin relative flex items-center justify-center w-9 h-9 rounded-full text-white shadow-lg border-2 border-white transition-transform ${
            isSelectedInRoute
              ? 'ring-4 ring-emerald-400 scale-110'
              : 'opacity-90 hover:opacity-100'
          }" style="background-color: ${chainConfig.color};">
            <span class="text-xs font-black tracking-tighter">${chainConfig.shortName.slice(0, 3)}</span>
            ${
              isSelectedInRoute && stopIndex !== undefined && stopIndex >= 0
                ? `<div class="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white font-bold text-[11px] rounded-full flex items-center justify-center shadow border-2 border-white">
                    ${stopIndex + 1}
                   </div>`
                : ''
            }
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const storeMarker = L.marker([store.lat, store.lng], {
        icon: storeIcon,
      }).addTo(markersLayerRef.current!);

      const stopDetail = selectedStrategy?.stops.find(
        (s) => s.store.id === store.id
      );

      storeMarker.bindPopup(`
        <div class="p-2 text-slate-800 min-w-[200px]">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="w-3 h-3 rounded-full" style="background-color: ${chainConfig.color}"></span>
            <span class="font-bold text-sm text-slate-900">${store.name}</span>
          </div>
          <p class="text-xs text-slate-500">${store.address}</p>
          <p class="text-xs text-slate-600 mt-1 font-medium">Orar: ${store.openHours}</p>
          ${
            stopDetail
              ? `<div class="mt-2 pt-2 border-t border-slate-200">
                  <div class="flex justify-between items-center text-xs font-semibold">
                    <span class="text-emerald-700">De cumpărat aici:</span>
                    <span class="text-emerald-800 font-bold">${formatMoney(stopDetail.subtotal)}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">${stopDetail.items.length} produse recomandate</p>
                </div>`
              : `<p class="text-[11px] text-slate-400 mt-1 italic">Niciun produs alocat din acest magazin în strategia curentă</p>`
          }
        </div>
      `);

      storeMarker.on('click', () => {
        if (onSelectStore) onSelectStore(store);
      });
    });

    // 4. Draw Route if selectedStrategy has stops
    if (selectedStrategy && selectedStrategy.stops.length > 0) {
      const latlngs: L.LatLngExpression[] = [
        [userLocation.lat, userLocation.lng],
      ];

      selectedStrategy.stops.forEach((stop) => {
        latlngs.push([stop.store.lat, stop.store.lng]);
      });

      // Close the loop back to user location
      latlngs.push([userLocation.lat, userLocation.lng]);

      // Draw background glow
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.4,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayerRef.current);

      // Draw main dashed route line
      L.polyline(latlngs, {
        color: '#059669',
        weight: 3,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayerRef.current);
    }
  }, [userLocation, stores, selectedStrategy, searchRadiusKm]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Interactive Map Overlay Badges */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md border border-slate-200/70 text-xs font-medium text-slate-700 flex items-center gap-1.5 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
          <span>Click pe hartă pentru a schimba locația</span>
        </div>
        <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-md border border-slate-200/70 text-xs font-medium text-slate-600 flex items-center gap-1 pointer-events-auto">
          <span>Rază căutare:</span>
          <span className="font-bold text-blue-600">{formatDistance(searchRadiusKm)}</span>
        </div>
      </div>
    </div>
  );
};
