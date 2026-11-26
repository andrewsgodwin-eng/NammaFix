import fs from 'fs';
import path from 'path';

const localesDir = './src/locales';
const translations = {
  en: "Stagnant Water on Road",
  ta: "சாலையில் தேங்கிய நீர்",
  te: "రోడ్డుపై నిలిచిన నీరు",
  hi: "सड़क पर जमा पानी",
  ml: "റോഡിൽ കെട്ടിക്കിടക്കുന്ന വെള്ളം",
  kn: "ರಸ್ತೆಯಲ್ಲಿ ನಿಂತ ನೀರು",
  bn: "রাস্তায় জমে থাকা জল",
  mr: "रस्त्यावर साचलेले पाणी",
  gu: "રસ્તા પર ભરાયેલું પાણી",
  pa: "ਸੜਕ ਤੇ ਖੜ੍ਹਾ ਪਾਣੀ",
  or: "ରାସ୍ତାରେ ଜମିଥିବା ପାଣି",
  ur: "سڑک پر کھڑا پانی"
};

const files = fs.readdirSync(localesDir);
files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const fullPath = path.join(localesDir, file);
    const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!json.categories) json.categories = {};
    json.categories.water_stagnation = translations[lang] || translations.en;
    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated ${file}`);
  }
});
