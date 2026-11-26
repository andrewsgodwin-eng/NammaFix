import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTranslation } from 'react-i18next';
import { Crosshair, MapPin, Search, Loader2 } from 'lucide-react';
import { DEFAULT_COORDINATES } from '../../utils/constants';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'Np5vEGIEYhxnnSS00NKc';
const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

export const LocationPicker = ({
  location,
  onLocationChange,
  onDetectGps,
  address,
  onAddressChange
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Reverse geocode when pin moves
  const fetchAddress = async (lat, lng) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || data.address?.suburb || '';
        const neighbourhood = data.address?.neighbourhood || data.address?.city_district || '';
        const city = data.address?.city || data.address?.town || data.address?.state_district || 'Chennai';
        const formatted = [road, neighbourhood, city].filter(Boolean).join(', ') || data.display_name;
        if (onAddressChange) onAddressChange(formatted);
      }
    } catch {
      // ignore
    } finally {
      setGeocoding(false);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLat = location?.lat || DEFAULT_COORDINATES.lat;
    const initialLng = location?.lng || DEFAULT_COORDINATES.lng;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAPTILER_STYLE_URL,
      center: [initialLng, initialLat],
      zoom: 15,
      pitch: 15
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    // Create Draggable Pin Element
    const pinEl = document.createElement('div');
    pinEl.className = 'cursor-grab active:cursor-grabbing transition-transform hover:scale-110';
    pinEl.innerHTML = `
      <div style="
        background-color: #EA580C;
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #FFFFFF;
        box-shadow: 0 8px 18px rgba(234,88,12,0.4);
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `;

    const marker = new maplibregl.Marker({
      element: pinEl,
      draggable: true,
      anchor: 'bottom'
    })
      .setLngLat([initialLng, initialLat])
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      onLocationChange({ lat: lngLat.lat, lng: lngLat.lng });
      fetchAddress(lngLat.lat, lngLat.lng);
    });

    // Click map to reposition marker
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      marker.setLngLat([lng, lat]);
      onLocationChange({ lat, lng });
      fetchAddress(lat, lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  // Update marker position when location changes externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && location?.lat && location?.lng) {
      markerRef.current.setLngLat([location.lng, location.lat]);
      mapRef.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 16,
        essential: true
      });
    }
  }, [location?.lat, location?.lng]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ', Chennai'
        )}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          onLocationChange({ lat, lng });
          if (onAddressChange) onAddressChange(data[0].display_name);
        }
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search & GPS Action Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <form onSubmit={handleSearch} className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#6B4A2E] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chennai street, landmark, metro station..."
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white border border-[#E8E2D9] text-sm text-[#1A120E] placeholder-[#8A7B6E] focus:outline-none focus:border-[#A88462] shadow-2xs"
          />
          <button
            type="submit"
            disabled={searching}
            className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#FBF9F6] hover:bg-[#F2ECE4] text-xs font-semibold text-[#1A120E] border border-[#E8E2D9] cursor-pointer"
          >
            {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </form>

        <button
          type="button"
          onClick={onDetectGps}
          className="px-4 py-2.5 rounded-xl bg-[#A88462] hover:bg-[#8F6D4C] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Crosshair className="w-4 h-4" />
          <span>Detect GPS Pin</span>
        </button>
      </div>

      {/* MapLibre Pin-Drop Canvas */}
      <div className="w-full h-72 rounded-2xl overflow-hidden border border-[#E8E2D9] relative shadow-sm bg-white">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[11px] font-mono text-[#1A120E] shadow-sm">
          <span>Lat: {location?.lat?.toFixed(5)}</span> | <span>Lng: {location?.lng?.toFixed(5)}</span>
        </div>
      </div>

      {/* Geocoded Address Preview */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FBF9F6] border border-[#E8E2D9] text-xs">
        <MapPin className="w-4 h-4 text-[#A88462] shrink-0" />
        <span className="text-[#1A120E] font-medium truncate">
          {geocoding ? 'Resolving street address...' : address || 'Tap on map or drag pin to refine location'}
        </span>
      </div>
    </div>
  );
};
