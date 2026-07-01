import { useState } from 'react';
import { 
  Search, ShoppingCart, Heart, Mic, Camera, Store, Download, HelpCircle, 
  User, Menu, ChevronDown, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';
import { CATEGORIES } from '../data';
import FilterSidebar from './FilterSidebar';
import { useCurrency, CURRENCIES, LANGUAGES } from '../lib/CurrencyContext';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onCategorySelect: (catId: string | null) => void;
  selectedCategory: string | null;
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
  selectedRating: number | null;
  onRatingSelect: (rating: number | null) => void;
  onViewChange: (view: 'home' | 'cart' | 'dashboard' | 'admin' | 'wishlist' | 'account' | 'gems') => void;
  activeView: string;
  currentUser: { name: string; role: 'user' | 'vendor' | 'admin' } | null;
  onLogout: () => void;
  onLoginClick: () => void;
  gems?: number;
  onOpenGemsHub?: () => void;
}

export default function Header({
  cartCount,
  wishlistCount,
  searchTerm,
  onSearchChange,
  onCategorySelect,
  selectedCategory,
  selectedBrand,
  onBrandSelect,
  selectedRating,
  onRatingSelect,
  onViewChange,
  activeView,
  currentUser,
  onLogout,
  onLoginClick,
  gems = 0,
  onOpenGemsHub
}: HeaderProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const { 
    activeCurrency, 
    activeLanguage, 
    setCurrencyByCode, 
    setLanguageByCode, 
    t 
  } = useCurrency();
  const [showCurrencyDrop, setShowCurrencyDrop] = useState(false);
  const [showLangDrop, setShowLangDrop] = useState(false);

  const handleMicSearch = () => {
    setMicActive(true);
    // Simulate speech recognition
    const simulatedQueries = ['Samsung A55', 'Nike shoes', 'Loreal shampoo', 'office chair'];
    const randomQuery = simulatedQueries[Math.floor(Math.random() * simulatedQueries.length)];
    setTimeout(() => {
      onSearchChange(randomQuery);
      onCategorySelect(null);
      onViewChange('home');
      setMicActive(false);
    }, 1500);
  };

  const handleCameraSearch = () => {
    setCameraActive(true);
    // Simulate image search
    setTimeout(() => {
      onSearchChange('Samsung');
      onCategorySelect(null);
      onViewChange('home');
      setCameraActive(false);
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm font-sans" id="daraz-header">
      {/* 1. Thin Top Bar */}
      <div className="hidden md:block w-full bg-[#f5f5f5] text-xs text-gray-600 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-9 flex justify-between items-center">
          {/* Left links */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => onViewChange('dashboard')} 
              className="hover:text-[#F85606] font-medium flex items-center gap-1 cursor-pointer"
              id="become-seller-link"
            >
              <Store size={13} />
              {t('becomeSeller')}
            </button>
            <div className="flex items-center gap-1 cursor-help hover:text-[#F85606]">
              <HelpCircle size={13} />
              <span>{t('helpSupport')}</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#F85606]">
              <Download size={13} />
              <span>{t('downloadApp')}</span>
            </div>
          </div>

          {/* Right links with dropdowns */}
          <div className="flex items-center space-x-4">
            <span className="text-[#F85606] font-semibold bg-orange-100 px-2 py-0.5 rounded text-[10px]">
              🔥 {t('hotDeals')}
            </span>
            
            {/* Currency Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCurrencyDrop(!showCurrencyDrop);
                  setShowLangDrop(false);
                }}
                className="flex items-center space-x-1 cursor-pointer hover:text-[#F85606] font-bold text-gray-700 bg-transparent py-1 px-1.5 rounded transition-all focus:outline-none"
                id="currency-dropdown-btn"
              >
                <span>{activeCurrency.label}</span>
                <ChevronDown size={11} />
              </button>
              {showCurrencyDrop && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyDrop(false)} />
                  <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 text-xs overflow-hidden animate-fade-in font-sans">
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrencyByCode(c.code);
                          setShowCurrencyDrop(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#F85606] flex items-center justify-between transition-colors cursor-pointer ${activeCurrency.code === c.code ? 'text-[#F85606] font-extrabold bg-orange-50/40' : 'text-gray-700 font-semibold'}`}
                      >
                        <span>{c.label}</span>
                        {activeCurrency.code === c.code && <span className="text-[10px] bg-[#F85606] text-white px-1.5 py-0.5 rounded-full font-black">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowLangDrop(!showLangDrop);
                  setShowCurrencyDrop(false);
                }}
                className="flex items-center space-x-1.5 cursor-pointer hover:text-[#F85606] font-bold text-gray-700 bg-transparent py-1 px-1.5 rounded transition-all focus:outline-none"
                id="language-dropdown-btn"
              >
                <span className="text-sm shrink-0">{activeLanguage.flag}</span>
                <span>{activeLanguage.name}</span>
                <ChevronDown size={11} />
              </button>
              {showLangDrop && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangDrop(false)} />
                  <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 text-xs overflow-hidden animate-fade-in font-sans">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguageByCode(l.code);
                          setShowLangDrop(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-[#F85606] flex items-center space-x-2 transition-colors cursor-pointer ${activeLanguage.code === l.code ? 'text-[#F85606] font-extrabold bg-orange-50/40' : 'text-gray-700 font-semibold'}`}
                      >
                        <span className="text-sm shrink-0">{l.flag}</span>
                        <span className="flex-1">{l.name}</span>
                        {activeLanguage.code === l.code && <span className="text-[10px] bg-[#F85606] text-white px-1.5 py-0.5 rounded-full font-black">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="w-full bg-white border-b border-gray-100 py-2.5 md:py-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:h-24">
          
          {/* Logo & Contact Row (Adapts for mobile & desktop) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 shrink-0">
            
            {/* Logo and phone container */}
            <div className="flex flex-col items-start text-left">
              {/* Phone number precisely matching image */}
              <a 
                href="tel:+94766778214" 
                className="flex items-center space-x-1.5 text-xs font-semibold text-gray-800 hover:text-[#F85606] transition-colors mb-1.5 ml-1"
                id="header-phone-link"
              >
                <svg className="w-3.5 h-3.5 text-red-500 fill-current shrink-0 animate-pulse" viewBox="0 0 24 24">
                  <path d="M21.38 15.61l-3.8-1.2c-.4-.1-.8 0-1.1.3l-2.1 2.1c-2.8-1.5-5.1-3.8-6.6-6.6l2.1-2.1c.3-.3.4-.7.3-1.1l-1.2-3.8c-.2-.6-.7-1-1.3-1h-3c-.7 0-1.3.6-1.3 1.3 0 11.4 9.3 20.7 20.7 20.7.7 0 1.3-.6 1.3-1.3v-3c0-.6-.4-1.1-1-1.3z" />
                </svg>
                <span className="tracking-wide text-[11px] md:text-xs font-bold text-gray-950 font-mono">+94766778214</span>
              </a>

              {/* Exact TAIGA Logo shape matching screenshot */}
              <button 
                onClick={() => {
                  onCategorySelect(null);
                  onSearchChange('');
                  onViewChange('home');
                }}
                className="flex items-center text-left focus:outline-none cursor-pointer group"
                id="logo-button"
              >
                <svg width="155" height="42" viewBox="0 0 165 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-[1.02] transition-transform">
                  {/* Bag Handle */}
                  <path d="M 16 19 C 16 10, 28 10, 28 19" stroke="#F85606" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                  
                  {/* Bag Body */}
                  <path d="M 11 19 H 33 L 35 34 H 9 Z" fill="#1E293B" />
                  
                  {/* Stylized Orange T inside Bag */}
                  <path d="M 17 23 H 27" stroke="#F85606" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 22 23 C 22 26.5, 20.5 29.5, 17 29.5" stroke="#F85606" strokeWidth="2" strokeLinecap="round" fill="none" />
                  
                  {/* Carriage Line with Left Up-hook & Underline */}
                  <path d="M 4 30 C 4 30, 6 38, 13 38 H 158" stroke="#F85606" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="4" cy="30" r="2.8" fill="#F85606" />
                  
                  {/* Custom "TAIGA" text letters */}
                  {/* T */}
                  <path d="M 44 14 H 58 M 51 14 V 31" stroke="#111111" strokeWidth="4.8" strokeLinecap="square" />
                  
                  {/* A (with orange triangle) */}
                  <path d="M 64 31 L 72 14 L 80 31" stroke="#111111" strokeWidth="4.8" strokeLinecap="square" strokeLinejoin="miter" />
                  <polygon points="69,24 75,24 72,18" fill="#F85606" />
                  
                  {/* I */}
                  <path d="M 88 14 V 31" stroke="#111111" strokeWidth="4.8" strokeLinecap="square" />
                  
                  {/* G */}
                  <path d="M 110 14 H 101 C 96 14, 96 31, 101 31 H 110 V 22 H 104" stroke="#111111" strokeWidth="4.8" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
                  
                  {/* A (with orange triangle) */}
                  <path d="M 118 31 L 126 14 L 134 31" stroke="#111111" strokeWidth="4.8" strokeLinecap="square" strokeLinejoin="miter" />
                  <polygon points="123,24 129,24 126,18" fill="#F85606" />
                </svg>
              </button>
            </div>

            {/* Icons visible on Mobile Header Row */}
            <div className="flex md:hidden items-center space-x-2 shrink-0">
              {/* Gems Wallet Mini Icon */}
              <button 
                onClick={onOpenGemsHub}
                className="flex items-center space-x-0.5 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-2 py-1.5 rounded-full text-[10px] font-black text-indigo-700 shadow-sm"
                title="Gems Wallet"
              >
                <span className="animate-bounce">💎</span>
                <span className="text-gray-900">{gems}</span>
              </button>

              {/* Wishlist Icon */}
              <button 
                onClick={() => onViewChange('wishlist')}
                className="relative text-gray-700 hover:text-[#F85606] p-1.5"
                title="Wishlist"
              >
                <Heart size={20} className={activeView === 'wishlist' ? 'fill-[#F85606] text-[#F85606]' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#F85606] text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button 
                onClick={() => onViewChange('cart')}
                className="relative text-gray-700 hover:text-[#F85606] p-1.5"
                title="Cart"
              >
                <ShoppingCart size={20} className={activeView === 'cart' ? 'text-[#F85606]' : ''} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#F85606] text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>

          {/* Main Search Bar (Center-dominant on Desktop, Full-width on Mobile) */}
          <div className="flex-1 w-full md:max-w-xl lg:max-w-2xl relative">
            <div className="flex items-center w-full bg-[#f5f5f5] rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[#F85606] transition-all">
              
              {/* Category selector in search bar */}
              <div className="relative hidden lg:block shrink-0 border-r border-gray-200">
                <button 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="px-3 py-2 text-xs font-semibold text-gray-700 flex items-center gap-1 hover:bg-gray-100 transition-colors cursor-pointer"
                  id="search-category-dropdown"
                >
                  {selectedCategory && selectedCategory !== 'all' ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'All Categories'}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-[310px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden" id="search-all-categories-filter-popover">
                    <div className="max-h-[420px] overflow-y-auto">
                      <FilterSidebar
                        selectedCategory={selectedCategory === 'all' ? null : selectedCategory}
                        onCategorySelect={(catId) => onCategorySelect(catId || 'all')}
                        selectedBrand={selectedBrand}
                        onBrandSelect={onBrandSelect}
                        selectedRating={selectedRating}
                        onRatingSelect={onRatingSelect}
                      />
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                      <button
                        onClick={() => setShowCategoryDropdown(false)}
                        className="px-4 py-1.5 bg-[#F85606] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                      >
                        Apply & Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Text Input */}
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeView !== 'home') onViewChange('home');
                }}
                className="flex-1 bg-transparent px-2.5 md:px-4 py-2.5 text-xs md:text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
                id="search-input"
              />

              {/* Voice and Camera search icons inside */}
              <div className="flex items-center space-x-1.5 px-2 md:px-3 border-l border-gray-200 shrink-0">
                <button
                  onClick={handleMicSearch}
                  title="Voice Search"
                  className={`p-1 md:p-1.5 rounded-full text-gray-500 hover:text-[#F85606] hover:bg-orange-50 transition-colors relative cursor-pointer ${micActive ? 'text-red-500 bg-red-50 animate-pulse' : ''}`}
                  id="voice-search-btn"
                >
                  <Mic size={15} />
                  {micActive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </button>
                <button
                  onClick={handleCameraSearch}
                  title="Image Search"
                  className={`p-1 md:p-1.5 rounded-full text-gray-500 hover:text-[#F85606] hover:bg-orange-50 transition-colors relative cursor-pointer ${cameraActive ? 'text-orange-500 bg-orange-50 animate-pulse' : ''}`}
                  id="camera-search-btn"
                >
                  <Camera size={15} />
                </button>
              </div>

              {/* Orange search trigger button */}
              <button 
                className="bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white px-4 md:px-5 self-stretch hover:opacity-90 transition-opacity flex items-center justify-center shrink-0 cursor-pointer"
                id="search-button-action"
                onClick={() => {
                  onCategorySelect(selectedCategory);
                  onViewChange('home');
                }}
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Right Navigation Controls (Desktop only, hidden on Mobile Header) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 shrink-0">
            {/* Gems Hub Indicator */}
            <button 
              onClick={onOpenGemsHub}
              className="flex items-center space-x-1 border border-indigo-200 bg-gradient-to-r from-indigo-50/70 to-blue-50/70 hover:from-indigo-100/80 hover:to-blue-100/80 px-2.5 py-1.5 rounded-full text-xs font-black text-indigo-700 transition-all cursor-pointer shadow-sm shrink-0"
              title="Gems Wallet - Earn & Redeem for up to 99% Off!"
              id="gems-header-btn"
            >
              <span className="animate-bounce">💎</span>
              <span className="text-gray-900">{gems}</span>
              <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600">Gems</span>
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => onViewChange('wishlist')}
              className="relative text-gray-700 hover:text-[#F85606] transition-colors p-1 cursor-pointer"
              title="My Wishlist"
              id="wishlist-header-btn"
            >
              <Heart size={22} className={activeView === 'wishlist' ? 'fill-[#F85606] text-[#F85606]' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F85606] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart with count badge */}
            <button 
              onClick={() => onViewChange('cart')}
              className="relative text-gray-700 hover:text-[#F85606] transition-colors p-1 cursor-pointer"
              title="Shopping Cart"
              id="cart-header-btn"
            >
              <ShoppingCart size={22} className={activeView === 'cart' ? 'text-[#F85606]' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F85606] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth section */}
            <div className="flex items-center space-x-3 text-sm">
              {currentUser ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <button 
                    onClick={() => onViewChange('account')}
                    className="flex items-center space-x-1.5 font-semibold text-gray-800 hover:text-[#F85606] cursor-pointer"
                    id="user-profile-btn"
                  >
                    <div className="h-7 w-7 bg-orange-100 rounded-full flex items-center justify-center text-[#F85606] text-xs uppercase font-black">
                      {currentUser.name.slice(0, 2)}
                    </div>
                    <span className="max-w-[70px] lg:max-w-[100px] truncate">{currentUser.name}</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={onLogout}
                    className="text-xs text-gray-500 hover:text-[#F85606] cursor-pointer"
                    id="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="flex items-center space-x-1 font-semibold text-gray-800 hover:text-[#F85606] transition-colors cursor-pointer"
                  id="login-btn"
                >
                  <User size={16} />
                  <span>{t('login')} / {t('signUp')}</span>
                </button>
              )}
            </div>

            {/* Developer/System Buttons for Admin and Vendor shortcuts */}
            <div className="hidden lg:flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <button 
                onClick={() => onViewChange('admin')}
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded transition-colors cursor-pointer ${activeView === 'admin' ? 'bg-[#F85606] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                id="admin-shortcut-btn"
              >
                Admin Panel
              </button>
              <button 
                onClick={() => onViewChange('dashboard')}
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded transition-colors cursor-pointer ${activeView === 'dashboard' ? 'bg-[#FF6600] text-white' : 'bg-orange-50 text-[#FF6600] hover:bg-orange-100'}`}
                id="vendor-shortcut-btn"
              >
                Vendor Dashboard
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
