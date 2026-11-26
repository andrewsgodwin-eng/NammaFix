export const CATEGORIES = [
  { id: 'street_light', icon: 'Lightbulb', color: 'amber' },
  { id: 'garbage', icon: 'Trash2', color: 'emerald' },
  { id: 'pothole', icon: 'Construction', color: 'red' },
  { id: 'water', icon: 'Droplet', color: 'blue' },
  { id: 'drainage', icon: 'Waves', color: 'teal' },
  { id: 'water_stagnation', icon: 'CloudRain', color: 'cyan' },
  { id: 'electricity', icon: 'Zap', color: 'yellow' },
  { id: 'traffic', icon: 'TrafficCone', color: 'indigo' },
  { id: 'other', icon: 'HelpCircle', color: 'slate' }
];

export const STATUS_LIST = [
  'reported',
  'verified',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
  'reopened'
];

export const STATUS_CONFIG = {
  reported: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
    badge: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    colorHex: '#CA8A04'
  },
  verified: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-800 border-blue-300',
    colorHex: '#2563EB'
  },
  assigned: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    dot: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    colorHex: '#4F46E5'
  },
  in_progress: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-800 border-orange-300',
    colorHex: '#EA580C'
  },
  resolved: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    colorHex: '#16A34A'
  },
  rejected: {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
    colorHex: '#DC2626'
  },
  reopened: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-800 border-purple-300',
    colorHex: '#9333EA'
  }
};

export const DEFAULT_COORDINATES = {
  lat: 13.0418,
  lng: 80.2337,
  city: 'Chennai, Tamil Nadu'
};
