import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Map, List, Filter, SlidersHorizontal, MapPin, Radio, Compass, RefreshCw } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { IssueCard } from '../../components/issues/IssueCard';
import { IssueMap } from '../../components/map/IssueMap';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { issueService } from '../../services/issueService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { CATEGORIES } from '../../utils/constants';

export const Nearby = () => {
  const { t } = useTranslation();
  const { location: userCoords, getDistanceTo, fetchLocation } = useGeolocation(true);

  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [issues, setIssues] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [radiusKm, setRadiusKm] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [center, setCenter] = useState([13.0418, 80.2337]);

  // Keep map center synced with user position if available
  useEffect(() => {
    if (userCoords?.lat && userCoords?.lng) {
      setCenter([userCoords.lat, userCoords.lng]);
    }
  }, [userCoords?.lat, userCoords?.lng]);

  const fetchNearby = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getNearbyIssues(
        center[0],
        center[1],
        radiusKm,
        selectedCategory,
        selectedStatus
      );
      setIssues(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load nearby issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, [selectedCategory, selectedStatus, radiusKm, center[0], center[1]]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150 bg-white">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8E2D9] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#A88462] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-[#1A120E] leading-tight">
              {t('nearby.title') || 'Neighborhood Mesh'}
            </h2>
          </div>
          <p className="text-xs text-[#6B4A2E] mt-0.5 font-mono">
            Active GPS Fix: {userCoords?.lat ? `${userCoords.lat.toFixed(4)}°N, ${userCoords.lng.toFixed(4)}°E (±${userCoords.accuracy}m)` : 'Chennai Metro'}
          </p>
        </div>

        {/* View Switcher & Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[40px] cursor-pointer ${
              showFilters || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'bg-[#FBF9F6] border-[#A88462] text-[#1A120E]'
                : 'bg-white border-[#E8E2D9] text-[#1A120E] hover:bg-[#FBF9F6]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#A88462]" />
            <span>Filters</span>
          </button>

          <div className="flex bg-[#FBF9F6] p-1 rounded-xl border border-[#E8E2D9]">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white text-[#1A120E] shadow-xs font-bold border border-[#E8E2D9]'
                  : 'text-[#6B4A2E] hover:text-[#1A120E]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[34px] cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#1A120E] shadow-xs font-bold border border-[#E8E2D9]'
                  : 'text-[#6B4A2E] hover:text-[#1A120E]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({issues.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-4 animate-in slide-in-from-top-2 duration-150 text-[#1A120E]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D9] pb-2">
            <span className="text-xs font-mono font-bold text-[#6B4A2E] uppercase tracking-wider">
              Filter By Classification
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setRadiusKm(10);
              }}
              className="text-xs font-semibold text-[#A88462] hover:text-[#8F6D4C] cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          {/* Category Filter Pills */}
          <div>
            <label className="text-xs font-mono text-[#6B4A2E] block mb-2 font-bold">Category</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#A88462] text-white border-[#A88462] font-semibold shadow-2xs'
                    : 'bg-white text-[#1A120E] border-[#E8E2D9] hover:border-[#D5C4AE]'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#A88462] text-white border-[#A88462] font-semibold shadow-2xs'
                      : 'bg-white text-[#1A120E] border-[#E8E2D9] hover:border-[#D5C4AE]'
                  }`}
                >
                  {t(`categories.${cat.id}`) || cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status & Radius */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-mono text-[#6B4A2E] block mb-2 font-bold">Status</label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'open', 'resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedStatus === st
                        ? 'bg-[#A88462] text-white border-[#A88462] font-semibold shadow-2xs'
                        : 'bg-white text-[#1A120E] border-[#E8E2D9] hover:border-[#D5C4AE]'
                    }`}
                  >
                    {st === 'all' ? 'All' : st === 'open' ? 'Active / In Progress' : 'Resolved'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs font-semibold">
                <span className="font-mono text-[#6B4A2E]">Radius</span>
                <span className="font-bold text-[#1A120E]">{radiusKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-[#A88462] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Viewport: MapLibre or List */}
      {viewMode === 'map' ? (
        <div className="space-y-3">
          <IssueMap
            issues={issues}
            center={center}
            zoom={13}
            height="580px"
            userLocation={userCoords}
            onLocateUser={fetchLocation}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 rounded-2xl bg-[#FBF9F6] border border-[#E8E2D9] animate-pulse" />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <EmptyState
              title="No incidents found in this filter range"
              description="Try expanding your radius or selecting 'All' categories."
              actionLabel="Reset Filters"
              onAction={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setRadiusKm(15);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {issues.map((issue) => {
                const lat = issue.latitude || issue.location?.coordinates?.[1];
                const lng = issue.longitude || issue.location?.coordinates?.[0];
                const dist = lat && lng ? getDistanceTo(lat, lng) : null;

                return (
                  <IssueCard
                    key={issue._id || issue.id}
                    issue={issue}
                    showDistance={true}
                    distanceMeters={dist}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
