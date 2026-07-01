import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  rate: number; // Multiplier from LKR
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'LKR', symbol: 'Rs.', label: 'LKR (Rs.)', rate: 1 },
  { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1 / 300 },
  { code: 'AED', symbol: 'Dh.', label: 'AED (Dh.)', rate: 1 / 81.74 },
  { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 1 / 3.61 },
  { code: 'CNY', symbol: '¥', label: 'CNY (¥)', rate: 1 / 41.38 },
];

export interface LanguageConfig {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
];

// Simple, high-quality translation dictionaries
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    becomeSeller: 'Become a Seller',
    helpSupport: 'Help & Support',
    downloadApp: 'Download App',
    flashSale: 'FLASH SALE',
    justForYou: 'JUST FOR YOU',
    login: 'Login',
    signUp: 'Sign Up',
    searchPlaceholder: 'Search in Taiga...',
    cart: 'Cart',
    wishlist: 'Wishlist',
    officialStore: 'Official Store',
    hotDeals: 'HOT DEALS',
    sellingFast: 'Selling Fast',
    backToHome: 'Back to Home',
    regularBuyer: 'Regular Buyer',
    systemAdmin: 'System Administrator',
    storeVendor: 'Official Store Vendor',
    gemsWallet: 'Gems Wallet',
    earnGems: 'Earn Gems',
    luckySpin: 'Daily Spin & Win',
  },
  si: {
    becomeSeller: 'විකුණුම්කරුවෙකු වන්න',
    helpSupport: 'උදවු සහ සහාය',
    downloadApp: 'යෙදුම බාගන්න',
    flashSale: 'ක්‍ෂණික අලෙවිය',
    justForYou: 'ඔබ සඳහාම පමණි',
    login: 'ලොග් වන්න',
    signUp: 'ලියාපදිංචි වන්න',
    searchPlaceholder: 'Taiga හි සොයන්න...',
    cart: 'කරත්තය',
    wishlist: 'ප්‍රාර්ථනා ලැයිස්තුව',
    officialStore: 'නිල වෙළඳසැල',
    hotDeals: 'උණුසුම් දීමනා',
    sellingFast: 'වේගයෙන් අලෙවි වේ',
    backToHome: 'මුල් පිටුවට',
    regularBuyer: 'සාමාන්‍ය ගැනුම්කරු',
    systemAdmin: 'පද්ධති පරිපාලක',
    storeVendor: 'නිල වෙළඳසැල් විකුණුම්කරු',
    gemsWallet: 'මැණික් පසුම්බිය',
    earnGems: 'මැණික් උපයන්න',
    luckySpin: 'වාසනාවන්ත කරකැවීම',
  },
  ar: {
    becomeSeller: 'كن بائعاً',
    helpSupport: 'المساعدة والدعم',
    downloadApp: 'تحميل التطبيق',
    flashSale: 'عروض فلاش مجنونة',
    justForYou: 'مخصص لك خصيصاً',
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    searchPlaceholder: 'البحث في تايجا...',
    cart: 'سلة المشتريات',
    wishlist: 'قائمة الأمنيات',
    officialStore: 'المتجر الرسمي',
    hotDeals: 'عروض ساخنة',
    sellingFast: 'تباع بسرعة',
    backToHome: 'العودة للرئيسية',
    regularBuyer: 'مشترٍ عادي',
    systemAdmin: 'مدير النظام',
    storeVendor: 'بائع متجر رسمي',
    gemsWallet: 'محفظة الجواهر',
    earnGems: 'اكسب جواهر',
    luckySpin: 'عجلة الحظ اليومية',
  },
  hi: {
    becomeSeller: 'विक्रेता बनें',
    helpSupport: 'सहायता और समर्थन',
    downloadApp: 'ऐप डाउनलोड करें',
    flashSale: 'फ़्लैश सेल',
    justForYou: 'खास आपके लिए',
    login: 'लॉग इन करें',
    signUp: 'साइन अप करें',
    searchPlaceholder: 'Taiga में खोजें...',
    cart: 'कार्ट',
    wishlist: 'इच्छा-सूची',
    officialStore: 'आधिकारिक स्टोर',
    hotDeals: 'शानदार डील्स',
    sellingFast: 'जल्दी बिक रहा है',
    backToHome: 'होमपेज पर वापस',
    regularBuyer: 'नियमित खरीदार',
    systemAdmin: 'सिस्टम प्रशासक',
    storeVendor: 'आधिकारिक स्टोर विक्रेता',
    gemsWallet: 'रत्न वॉलेट',
    earnGems: 'रत्न कमाएं',
    luckySpin: 'दैनिक स्पिन और जीतें',
  },
  zh: {
    becomeSeller: '成为商家',
    helpSupport: '帮助与支持',
    downloadApp: '下载应用程序',
    flashSale: '限时闪购',
    justForYou: '为您推荐',
    login: '登录',
    signUp: '注册',
    searchPlaceholder: '在 Taiga 中搜索...',
    cart: '购物车',
    wishlist: '心愿单',
    officialStore: '官方旗舰店',
    hotDeals: '火爆热卖',
    sellingFast: '抢购中',
    backToHome: '返回首页',
    regularBuyer: '普通买家',
    systemAdmin: '系统管理员',
    storeVendor: '官方网店商家',
    gemsWallet: '宝石钱包',
    earnGems: '赚取宝石',
    luckySpin: '每日幸运转盘',
  }
};

interface CurrencyContextType {
  activeCurrency: CurrencyConfig;
  activeLanguage: LanguageConfig;
  setCurrencyByCode: (code: string) => void;
  setLanguageByCode: (code: string) => void;
  formatPrice: (priceInLkr: number) => string;
  convertPrice: (priceInLkr: number) => number;
  t: (key: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyConfig>(CURRENCIES[0]);
  const [activeLanguage, setActiveLanguage] = useState<LanguageConfig>(LANGUAGES[0]);

  // Load from LocalStorage if exists
  useEffect(() => {
    const savedCurrencyCode = localStorage.getItem('taiga_currency_code');
    if (savedCurrencyCode) {
      const found = CURRENCIES.find(c => c.code === savedCurrencyCode);
      if (found) setActiveCurrency(found);
    }
    const savedLangCode = localStorage.getItem('taiga_language_code');
    if (savedLangCode) {
      const found = LANGUAGES.find(l => l.code === savedLangCode);
      if (found) setActiveLanguage(found);
    }
  }, []);

  const setCurrencyByCode = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setActiveCurrency(found);
      localStorage.setItem('taiga_currency_code', code);
    }
  };

  const setLanguageByCode = (code: string) => {
    const found = LANGUAGES.find(l => l.code === code);
    if (found) {
      setActiveLanguage(found);
      localStorage.setItem('taiga_language_code', code);
    }
  };

  // Utility to convert LKR price to active currency
  const convertPrice = (priceInLkr: number): number => {
    return priceInLkr * activeCurrency.rate;
  };

  // Convert and beautifully format price
  const formatPrice = (priceInLkr: number): string => {
    const converted = convertPrice(priceInLkr);
    if (activeCurrency.code === 'LKR') {
      return `${activeCurrency.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    if (activeCurrency.code === 'USD') {
      return `${activeCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    // Default format for others
    return `${activeCurrency.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`;
  };

  // Translation function
  const t = (key: string): string => {
    const dict = TRANSLATIONS[activeLanguage.code] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <CurrencyContext.Provider value={{
      activeCurrency,
      activeLanguage,
      setCurrencyByCode,
      setLanguageByCode,
      formatPrice,
      convertPrice,
      t
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
