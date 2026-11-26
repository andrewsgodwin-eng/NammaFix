import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Crosshair, Layers, Navigation, Compass, AlertCircle, RefreshCw } from 'lucide-react';
import { STATUS_CONFIG, DEFAULT_COORDINATES } from '../../utils/constants';
import { formatDistance } from '../../hooks/useGeolocation';

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'Np5vEGIEYhxnnSS00NKc';
const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`;

export const IssueMap = ({
  issues = [],
  center = [DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng],
  zoom = 13,
  height = '520px',
  userLocation = null,
  onMarkerClick,
  onLocateUser
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre with MapTiler Streets style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialLng = center[1] || DEFAULT_COORDINATES.lng;
    const initialLat = center[0] || DEFAULT_COORDINATES.lat;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAPTILER_STYLE_URL,
      center: [initialLng, initialLat],
      zoom: zoom,
      pitch: 28, // Subtle 3D perspective
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      mapRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapRef.current && center && center[0] && center[1]) {
      mapRef.current.easeTo({
        center: [center[1], center[0]],
        zoom: zoom,
        duration: 1200
      });
    }
  }, [center[0], center[1], zoom]);

  // Render Real-time User Location Marker
  useEffect(() => {
    if (!mapRef.current || !userLocation?.lat || !userLocation?.lng) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'relative flex items-center justify-center';
    el.style.width = '42px';
    el.style.height = '42px';
    el.innerHTML = `
      <div class="absolute inset-0 rounded-full bg-[#A88462]/25 animate-beacon-ripple"></div>
      <div class="w-4 h-4 rounded-full bg-[#1A120E] border-2 border-white shadow-[0_0_12px_rgba(168,132,98,0.7)] relative z-10 flex items-center justify-center">
        <div class="w-1.5 h-1.5 rounded-full bg-[#A88462]"></div>
      </div>
    `;

    const userMarker = new maplibregl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    userMarkerRef.current = userMarker;
  }, [userLocation?.lat, userLocation?.lng, mapLoaded]);

  // Render Issue Markers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    issues.forEach((issue) => {
      const lat = issue.latitude || issue.location?.coordinates?.[1];
      const lng = issue.longitude || issue.location?.coordinates?.[0];
      if (!lat || !lng) return;

      const status = issue.status || 'reported';
      const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.reported;
      const color = statusCfg.colorHex || '#A88462';

      // Create Custom Pin Element
      const el = document.createElement('div');
      el.className = 'cursor-pointer transition-transform hover:scale-125';
      el.style.width = '32px';
      el.style.height = '32px';
      el.innerHTML = `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 4px 14px rgba(26,18,14,0.35);
        ">
          <div style="
            width: 9px;
            height: 9px;
            background-color: #FFFFFF;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedIssue(issue);
        if (onMarkerClick) onMarkerClick(issue);
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [issues, mapLoaded]);

  const handleFlyToUser = () => {
    if (userLocation?.lat && userLocation?.lng && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 16,
        pitch: 35,
        speed: 1.2
      });
    }
    if (onLocateUser) onLocateUser();
  };

  return (
    <div 
      style={{ height }} 
      className="w-full relative rounded-2xl overflow-hidden border border-[#E8E2D9] shadow-sm bg-white"
    >
      {/* MapLibre DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleFlyToUser}
          title="Track My Real-time Location"
          className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-[#1A120E] border border-[#E8E2D9] shadow-md backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
        >
          <Crosshair className="w-4 h-4 text-[#A88462] animate-pulse" />
          <span className="hidden sm:inline">GPS Pulse</span>
        </button>
      </div>

      {/* Live Active Legend Bar on Clean White Card */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 bg-white/95 backdrop-blur-md border border-[#E8E2D9] px-4 py-2 rounded-xl shadow-lg flex items-center gap-4 text-xs font-medium text-[#1A120E]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1A120E] ring-2 ring-[#A88462]/40" />
          <span className="text-[#1A120E] font-bold">You</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span className="text-[#6B4A2E]">Reported</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
          <span className="text-[#6B4A2E]">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
          <span className="text-[#6B4A2E]">Resolved</span>
        </div>
      </div>

      {/* Selected Issue Preview Card Drawer */}
      {selectedIssue && (
        <div className="absolute top-4 right-4 max-w-sm w-full z-20 bg-white border border-[#E8E2D9] rounded-2xl p-4 shadow-xl text-[#1A120E] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#FBF9F6] text-[#6B4A2E] border border-[#E8E2D9]">
                {selectedIssue.category || 'Civic'}
              </span>
              <h4 className="text-sm font-bold text-[#1A120E] mt-1.5 line-clamp-1">
                {selectedIssue.title || selectedIssue.description}
              </h4>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-[#6B4A2E] hover:text-[#1A120E] text-lg leading-none p-1 cursor-pointer"
            >
              ×
            </button>
          </div>

          <p className="text-xs text-[#6B4A2E] mt-1 line-clamp-2">
            {selectedIssue.description || 'No description provided.'}
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
            <span className="text-[#6B4A2E] font-mono text-[11px]">
              ID: {selectedIssue.complaintId || selectedIssue.displayId || selectedIssue._id?.slice(-6) || 'INC-01'}
            </span>
            <Link
              to={`/issue/${selectedIssue._id || selectedIssue.id}`}
              className="px-3 py-1 rounded-lg bg-[#A88462] hover:bg-[#8F6D4C] text-white font-semibold text-xs transition-colors"
            >
              Inspect Flow →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
