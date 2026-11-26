import fs from 'fs';
import path from 'path';

const localesDir = './src/locales';

const translations = {
  en: {
    welcomeHeroTitle: "Spot a problem in your street? Get it fixed with NammaFix.",
    welcomeHeroSubtitle: "Report potholes, broken streetlights, garbage, water leaks, or road water stagnation directly to municipal corporation field engineers.",
    officialPlatformBadge: "Official Grievance & Municipal Resolution Platform",
    liveCivicFeed: "LIVE CIVIC FEED",
    citizenPortalTitle: "Citizen Portal",
    citizenPortalDesc: "For residents to report neighborhood issues, track live status, and upvote fixes without creating duplicates.",
    enterCitizenPortal: "Enter Citizen Portal",
    newUserRegister: "New user? Create a free citizen account →",
    officerPortalTitle: "Officer Desk",
    officerPortalDesc: "Dedicated operations dashboard for Municipal Corporation Engineers, Ward Councillors, and field crews.",
    officerLoginBtn: "Officer Login / Desk Access",
    officerRestrictedNotice: "Government & Municipal Badge ID Required",
    publicAccess: "Public Citizen Access",
    restrictedAccess: "Restricted",
    featureReport30s: "Quick 30s photo report with smart category detect",
    featureGpsMap: "Interactive GPS & address search pin mapper",
    featureConfirmFacing: "\"I'm facing this too\" one-tap duplicate confirmation",
    featureOfficerTriage: "Zonal Triage queue with verified inspection workflow",
    featureOfficerAssign: "Assign work orders directly to ward departments",
    featureOfficerMerge: "Merge duplicates into single master complaint tickets",
    statRegistered: "Complaints Registered",
    statFixed: "Fixed & Verified",
    statConfirmations: "Citizen Confirmations",
    statFixVelocity: "Avg Fix Velocity"
  },
  ta: {
    welcomeHeroTitle: "உங்கள் தெருவில் ஏதேனும் பிரச்சனையா? நம்மபிக்ஸ் மூலம் சரிசெய்க.",
    welcomeHeroSubtitle: "சாலை பள்ளங்கள், தெருவிளக்கு பழுது, குப்பைகள், நீர் கசிவு அல்லது சாலை நீர் தேக்கத்தை நேரடியாக மாநகராட்சி அதிகாரிகளுக்கு புகாரளிக்கவும்.",
    officialPlatformBadge: "அதிகாரப்பூர்வ நகராட்சி குறைதீர்க்கும் தளம்",
    liveCivicFeed: "நேரலை குடிமக்கள் அறிவிப்பு",
    citizenPortalTitle: "குடிமக்கள் தளம்",
    citizenPortalDesc: "பொதுமக்கள் தங்கள் பகுதியில் உள்ள பிரச்சனைகளை புகாரளிக்கவும், நிலவரத்தை கண்காணிக்கவும் மற்றும் உறுதிப்படுத்தவும்.",
    enterCitizenPortal: "குடிமக்கள் தளத்தில் நுழைய",
    newUserRegister: "புதியவரா? இலவச கணக்கை உருவாக்கவும் →",
    officerPortalTitle: "அதிகாரிகள் தளம்",
    officerPortalDesc: "மாநகராட்சி பொறியாளர்கள், வார்டு கவுன்சிலர்கள் மற்றும் களப் பணியாளர்களுக்கான நிர்வாக தளம்.",
    officerLoginBtn: "அதிகாரிகள் உள்நுழைவு",
    officerRestrictedNotice: "அரசு & நகராட்சி அடையாள அட்டை தேவை",
    publicAccess: "பொது குடிமக்கள் அணுகல்",
    restrictedAccess: "கட்டுப்படுத்தப்பட்டது",
    featureReport30s: "ஸ்மார்ட் வகை கண்டறிதலுடன் 30 வினாடிகளில் விரைவு புகைப்படம்",
    featureGpsMap: "இருப்பிட வரைபடம் & முகவரி தேடல் அமைப்பு",
    featureConfirmFacing: "\"நானும் இதை எதிர்கொள்கிறேன்\" ஒரு-தட்டு உறுதிப்படுத்தல்",
    featureOfficerTriage: "மண்டல அளவிலான புகார் சரிபார்ப்பு மற்றும் வரிசைப்படுத்துதல்",
    featureOfficerAssign: "துறைகளுக்கு நேரடியாக பணிகளை ஒதுக்குதல்",
    featureOfficerMerge: "ஒரே புகார்களை முதன்மை டிக்கெட்டாக இணைத்தல்",
    statRegistered: "பதிவு செய்யப்பட்ட புகார்கள்",
    statFixed: "சரிசெய்யப்பட்டவை",
    statConfirmations: "குடிமக்கள் ஆதரவுகள்",
    statFixVelocity: "சராசரி தீர்வு வேகம்"
  },
  te: {
    welcomeHeroTitle: "మీ వీధిలో సమస్య ఉందా? నమ్మఫిక్స్ ద్వారా పరిష్కరించుకోండి.",
    welcomeHeroSubtitle: "గుంతలు, వీధి దీపాలు, చెత్త, నీటి లీకేజీ లేదా రోడ్డుపై నిలిచిన నీటిని మున్సిపల్ ఇంజనీర్లకు నేరుగా నివేదించండి.",
    officialPlatformBadge: "అధికారిక మునిసిపల్ పరిష్కార వేదిక",
    liveCivicFeed: "లైవ్ పౌర సమాచారం",
    citizenPortalTitle: "పౌరుల పోర్టల్",
    citizenPortalDesc: "సమస్యలను నివేదించడానికి, పురోగతిని ట్రాక్ చేయడానికి మరియు పునరావృతాలను నివారించడానికి.",
    enterCitizenPortal: "పౌరుల పోర్టల్‌లోకి వెళ్ళండి",
    newUserRegister: "కొత్త యూజరా? ఖాతాను సృష్టించండి →",
    officerPortalTitle: "అధికారుల డెస్క్",
    officerPortalDesc: "మునిసిపల్ కార్పొరేషన్ ఇంజనీర్లు మరియు వార్డు అధికారుల కోసం ప్రత్యేక డాష్‌బోర్డ్.",
    officerLoginBtn: "అధికారుల లాగిన్",
    officerRestrictedNotice: "ప్రభుత్వ & మునిసిపల్ బ్యాడ్జ్ ID అవసరం",
    publicAccess: "ప్రజా ప్రవేశం",
    restrictedAccess: "పరిమితం",
    featureReport30s: "స్మార్ట్ వర్గీకరణతో 30 సెకన్ల ఫోటో నివేదిక",
    featureGpsMap: "ఇంటరాక్టివ్ GPS & చిరునామా శోధన",
    featureConfirmFacing: "\"నేను కూడా ఎదుర్కొంటున్నాను\" ఒకే ట్యాప్ మద్దతు",
    featureOfficerTriage: "ప్రాంతీయ తనిఖీ మరియు ప్రాధాన్యతా నిర్వహణ",
    featureOfficerAssign: "వార్డు విభాగాలకు పనులను కేటాయించండి",
    featureOfficerMerge: "డూప్లికేట్ సమస్యలను విలీనం చేయండి",
    statRegistered: "నమోదైన ఫిర్యాదులు",
    statFixed: "పరిష్కరించబడినవి",
    statConfirmations: "పౌరుల ధృవీకరణలు",
    statFixVelocity: "సగటు పరిష్కార సమయం"
  },
  hi: {
    welcomeHeroTitle: "क्या आपकी गली में कोई समस्या है? नम्माफिक्स से समाधान पाएं।",
    welcomeHeroSubtitle: "सड़क के गड्ढे, स्ट्रीट लाइट, कचरा, पानी के रिसाव या सड़क पर जमा पानी की शिकायत सीधे नगर निगम इंजीनियरों को करें।",
    officialPlatformBadge: "आधिकारिक नगर निगम शिकायत निवारण मंच",
    liveCivicFeed: "लाइव नागरिक अपडेट",
    citizenPortalTitle: "नागरिक पोर्टल",
    citizenPortalDesc: "स्थानीय समस्याओं की रिपोर्ट करने, स्थिति ट्रैक करने और डुप्लिकेट से बचने के लिए।",
    enterCitizenPortal: "नागरिक पोर्टल में प्रवेश करें",
    newUserRegister: "नए उपयोगकर्ता? निःशुल्क खाता बनाएं →",
    officerPortalTitle: "अधिकारी डेस्क",
    officerPortalDesc: "नगर निगम इंजीनियरों, वार्ड पार्षदों और फील्ड टीमों के लिए समर्पित संचालन डैशबोर्ड।",
    officerLoginBtn: "अधिकारी लॉगिन",
    officerRestrictedNotice: "सरकारी व नगर निगम पहचान पत्र आवश्यक",
    publicAccess: "सार्वजनिक नागरिक पहुंच",
    restrictedAccess: "प्रतिबंधित",
    featureReport30s: "स्मार्ट श्रेणी पहचान के साथ 30 सेकंड में फोटो रिपोर्ट",
    featureGpsMap: "सटीक जीपीएस व पता खोज पिन मैपर",
    featureConfirmFacing: "\"मैं भी इस समस्या का सामना कर रहा हूँ\" एक-टैप समर्थन",
    featureOfficerTriage: "जोनल सत्यापन व कार्य प्राथमिकता प्रणाली",
    featureOfficerAssign: "वार्ड विभागों को सीधे कार्य सौंपें",
    featureOfficerMerge: "समान शिकायतों को एक में मर्ज करें",
    statRegistered: "दर्ज की गई शिकायतें",
    statFixed: "हल और सत्यापित",
    statConfirmations: "नागरिक समर्थन",
    statFixVelocity: "औसत समाधान समय"
  },
  ml: {
    welcomeHeroTitle: "നിങ്ങളുടെ വഴിയിൽ എന്തെങ്കിലും പ്രശ്നമുണ്ടോ? നമ്മഫിക്സിലൂടെ പരിഹരിക്കൂ.",
    welcomeHeroSubtitle: "കുഴികൾ, വഴിവിളക്കുകൾ, മാലിന്യം, കുടിവെള്ള ചോർച്ച എന്നിവ നേരിട്ട് നഗരസഭാ ഉദ്യോഗസ്ഥരെ അറിയിക്കൂ.",
    officialPlatformBadge: "ഔദ്യോഗിക മുനിസിപ്പൽ പരാതി പരിഹാര പ്ലാറ്റ്‌ഫോം",
    liveCivicFeed: "തത്സമയ വിവരങ്ങൾ",
    citizenPortalTitle: "പൗരന്മാരുടെ പോർട്ടൽ",
    citizenPortalDesc: "പ്രശ്നങ്ങൾ റിപ്പോർട്ട് ചെയ്യാനും തത്സമയം നിരീക്ഷിക്കാനും.",
    enterCitizenPortal: "പൗരന്മാരുടെ പോർട്ടലിൽ പ്രവേശിക്കുക",
    newUserRegister: "പുതിയ ആളാണോ? സൗജന്യ അക്കൗണ്ട് ഉണ്ടാക്കൂ →",
    officerPortalTitle: "ഉദ്യോഗസ്ഥരുടെ ഡെസ്ക്",
    officerPortalDesc: "നഗരസഭാ എൻജിനീയർമാർക്കും ഫീൽഡ് വർക്കർമാർക്കുമുള്ള ഡാഷ്‌ബോർഡ്.",
    officerLoginBtn: "ഓഫീസർ ലോഗിൻ",
    officerRestrictedNotice: "ഔദ്യോഗിക ഐഡി കാർഡ് ആവശ്യമാണ്",
    publicAccess: "പൊതു പ്രവേശനം",
    restrictedAccess: "നിയന്ത്രിതം",
    featureReport30s: "30 സെക്കൻഡിൽ ഫോട്ടോ സഹിതം റിപ്പോർട്ട് ചെയ്യാം",
    featureGpsMap: "ജിപിഎസ് & വിലാസ തിരച്ചിൽ സംവിധാനം",
    featureConfirmFacing: "\"എനിക്കും ഈ പ്രശ്നമുണ്ട്\" ഒറ്റ ടാപ്പ് പിന്തുണ",
    featureOfficerTriage: "മേഖലാ അടിസ്ഥാനത്തിലുള്ള പരിശോധന",
    featureOfficerAssign: "ഓരോ വകുപ്പുകളിലേക്കും നേരിട്ട് ചുമതലപ്പെടുത്തുക",
    featureOfficerMerge: "ഒരേ പരാതികൾ സംയോജിപ്പിക്കുക",
    statRegistered: "രജിസ്റ്റർ ചെയ്ത പരാതികൾ",
    statFixed: "പരിഹരിച്ചവ",
    statConfirmations: "പൗരന്മാരുടെ പിന്തുണകൾ",
    statFixVelocity: "ശരാശരി പരിഹാര സമയം"
  },
  kn: {
    welcomeHeroTitle: "ನಿಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಸಮಸ್ಯೆಯಿದೆಯೇ? ನಮ್ಮಫಿಕ್ಸ್ ಮೂಲಕ ಸರಿಪಡಿಸಿ.",
    welcomeHeroSubtitle: "ಗುಂಡಿಗಳು, ಬೀದಿದೀಪಗಳು, ಕಸ, ನೀರಿನ ಸೋರಿಕೆ ಅಥವಾ ನಿಂತ ನೀರನ್ನು ನೇರವಾಗಿ ಪಾಲಿಕೆ ಇಂಜಿನಿಯರ್‌ಗಳಿಗೆ ವರದಿ ಮಾಡಿ.",
    officialPlatformBadge: "ಅಧಿಕೃತ ಮಹಾನಗರ ಪಾಲಿಕೆ ದೂರು ಪರಿಹಾರ ವೇದಿಕೆ",
    liveCivicFeed: "ಲೈವ್ ನಾಗರಿಕ ಮಾಹಿತಿ",
    citizenPortalTitle: "ನಾಗರಿಕ ಪೋರ್ಟಲ್",
    citizenPortalDesc: "ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಲು, ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮತ್ತು ಬೆಂಬಲಿಸಲು.",
    enterCitizenPortal: "ನಾಗರಿಕ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ",
    newUserRegister: "ಹೊಸಬರೇ? ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ →",
    officerPortalTitle: "ಅಧಿಕಾರಿಗಳ ಡೆಸ್ಕ್",
    officerPortalDesc: "ಪಾಲಿಕೆ ಇಂಜಿನಿಯರ್‌ಗಳು ಮತ್ತು ವಾರ್ಡ್ ಅಧಿಕಾರಿಗಳ ಕಾರ್ಯಾಚರಣಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್.",
    officerLoginBtn: "ಅಧಿಕಾರಿ ಲಾಗಿನ್",
    officerRestrictedNotice: "ಸರ್ಕಾರಿ ಮತ್ತು ಪಾಲಿಕೆ ಬ್ಯಾಡ್ಜ್ ಐಡಿ ಕಡ್ಡಾಯ",
    publicAccess: "ಸಾರ್ವಜನಿಕ ಪ್ರವೇಶ",
    restrictedAccess: "ನಿರ್ಬಂಧಿತ",
    featureReport30s: "30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಫೋಟೋ ಸಹಿತ ವರದಿ",
    featureGpsMap: "ಜಿಪಿಎಸ್ ಮತ್ತು ವಿಳಾಸ ಹುಡುಕಾಟ ಮ್ಯಾಪರ್",
    featureConfirmFacing: "\"ನಾನೂ ಈ ಸಮಸ್ಯೆಯನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೇನೆ\" ಏಕ-ಟ್ಯಾಪ್ ಬೆಂಬಲ",
    featureOfficerTriage: "ವಲಯ ಪರಿಶೀಲನೆ ಮತ್ತು ಆದ್ಯತೆಯ ಕಾರ್ಯ",
    featureOfficerAssign: "ವಿಭಾಗಗಳಿಗೆ ನೇರವಾಗಿ ಕಾರ್ಯ ನಿಯೋಜನೆ",
    featureOfficerMerge: "ನಕಲಿ ದೂರುಗಳ ವಿಲೀನ",
    statRegistered: "ದಾಖಲಾದ ದೂರುಗಳು",
    statFixed: "ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು",
    statConfirmations: "ನಾಗರಿಕರ ದೃಢೀಕರಣಗಳು",
    statFixVelocity: "ಸರಾಸರಿ ಪರಿಹಾರ ವೇಗ"
  }
};

// Fallback generator for other languages
const files = fs.readdirSync(localesDir);
files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    const fullPath = path.join(localesDir, file);
    const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!json.welcome) json.welcome = {};

    const langData = translations[lang] || translations.en;
    Object.assign(json.welcome, langData);

    fs.writeFileSync(fullPath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated welcome keys in ${file}`);
  }
});
