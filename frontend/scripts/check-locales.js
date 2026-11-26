import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../src/locales');
const enPath = path.join(localesDir, 'en.json');

if (!fs.existsSync(enPath)) {
  console.error('❌ Base en.json not found at:', enPath);
  process.exit(1);
}

const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

function getFlatKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      keys = keys.concat(getFlatKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = new Set(getFlatKeys(enData));
const localeFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json') && f !== 'en.json');

console.log(`🔍 Checking locales against en.json (${enKeys.size} keys)...`);

let hasError = false;

for (const file of localeFiles) {
  const filePath = path.join(localesDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const keys = new Set(getFlatKeys(data));
    
    const missing = [...enKeys].filter(k => !keys.has(k));
    const extra = [...keys].filter(k => !enKeys.has(k));

    if (missing.length > 0) {
      console.error(`❌ [${file}] Missing ${missing.length} keys:`);
      missing.forEach(k => console.error(`   - ${k}`));
      hasError = true;
    } else {
      console.log(`✅ [${file}] All keys present! (${keys.size}/${enKeys.size})`);
    }

    if (extra.length > 0) {
      console.warn(`⚠️ [${file}] Has ${extra.length} extra keys not in en.json`);
    }
  } catch (err) {
    console.error(`❌ Error parsing ${file}:`, err.message);
    hasError = true;
  }
}

if (hasError) {
  console.error('\n❌ Locale check failed! Some keys are missing.');
  process.exit(1);
} else {
  console.log('\n✨ All locales are 100% complete and synchronized!');
  process.exit(0);
}
