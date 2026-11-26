import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_COORDINATES } from '../utils/constants';

// Compute Haversine distance in meters between two lat/lng coordinates
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

export const formatDistance = (meters) => {
  if (meters == null) return '';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

export const useGeolocation = (continuous = true) => {
  const [location, setLocation] = useState({
    lat: DEFAULT_COORDINATES.lat,
    lng: DEFAULT_COORDINATES.lng,
    accuracy: 25,
    heading: 0,
    speed: 0,
    address: DEFAULT_COORDINATES.city,
    timestamp: Date.now()
  });

  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const watchIdRef = useRef(null);
  const lastGeocodeCoordsRef = useRef({ lat: 0, lng: 0 });

  const reverseGeocode = async (lat, lng) => {
    // Only query geocoding if moved more than 40 meters to save bandwidth & rate limits
    const dist = calculateDistanceMeters(
      lastGeocodeCoordsRef.current.lat,
      lastGeocodeCoordsRef.current.lng,
      lat,
      lng
    );
    if (dist < 40 && lastGeocodeCoordsRef.current.address) {
      return lastGeocodeCoordsRef.current.address;
    }

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
        lastGeocodeCoordsRef.current = { lat, lng, address: formatted };
        return formatted;
      }
    } catch {
      // fallback
    }
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  const handlePositionSuccess = useCallback(async (position) => {
    const { latitude, longitude, accuracy, heading, speed } = position.coords;

    const address = await reverseGeocode(latitude, longitude);

    setLocation({
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy || 20),
      heading: heading || 0,
      speed: speed ? Math.round(speed * 3.6) : 0, // km/h
      address,
      timestamp: position.timestamp || Date.now()
    });
    setLoading(false);
    setError(null);
  }, []);

  const handlePositionError = useCallback((err) => {
    let message = 'Unable to acquire GPS signal';
    if (err.code === 1) message = 'Location permission denied by user';
    else if (err.code === 2) message = 'Position unavailable';
    else if (err.code === 3) message = 'Location request timed out';
    
    setError(message);
    setLoading(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this platform');
      return;
    }

    setLoading(true);
    setIsTracking(true);

    // Initial instant fix
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      handlePositionError,
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );

    // Continuous real-time tracking
    if (continuous) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionSuccess,
        handlePositionError,
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 12000
        }
      );
    }
  }, [continuous, handlePositionSuccess, handlePositionError]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, [startTracking, stopTracking]);

  const getDistanceTo = useCallback(
    (targetLat, targetLng) => {
      return calculateDistanceMeters(location.lat, location.lng, targetLat, targetLng);
    },
    [location.lat, location.lng]
  );

  return {
    location,
    isTracking,
    loading,
    error,
    startTracking,
    stopTracking,
    getDistanceTo,
    fetchLocation: startTracking
  };
};
