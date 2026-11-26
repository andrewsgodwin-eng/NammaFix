export const LANGUAGES = [
  { code: 'en', native: 'English', dir: 'ltr' },
  { code: 'ta', native: 'தமிழ்', dir: 'ltr' },
  { code: 'te', native: 'తెలుగు', dir: 'ltr' },
  { code: 'hi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'ml', native: 'മലയാളം', dir: 'ltr' },
  { code: 'kn', native: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'bn', native: 'বাংলা', dir: 'ltr' },
  { code: 'mr', native: 'मराठी', dir: 'ltr' },
  { code: 'gu', native: 'ગુજરાતી', dir: 'ltr' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', dir: 'ltr' },
  { code: 'or', native: 'ଓଡ଼ିଆ', dir: 'ltr' },
  { code: 'ur', native: 'اردو', dir: 'rtl' },
];

export const getLanguageDirection = (code) => {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.dir : 'ltr';
};
