import React, { useState, useEffect } from 'react';
import { Product, CartItem, Voucher, Order } from './types';
import { 
  INITIAL_PRODUCTS, VOUCHERS, CATEGORIES 
} from './data';

// Component imports
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import VoucherStrip from './components/VoucherStrip';
import CategoryCircleGrid from './components/CategoryCircleGrid';
import SpinGame from './components/SpinGame';
import FlashSale from './components/FlashSale';
import TopBrands from './components/TopBrands';
import PromotionalBanners from './components/PromotionalBanners';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import CartCheckout from './components/CartCheckout';
import VendorDashboard from './components/VendorDashboard';
import AdminPanel from './components/AdminPanel';
import AiAssistant from './components/AiAssistant';
import MobileNavBar from './components/MobileNavBar';
import Footer from './components/Footer';
import FilterSidebar from './components/FilterSidebar';
import GemsPage from './components/GemsPage';
import LoginModal from './components/LoginModal';

// Icons for Account view
import { User, ShieldAlert, CheckCircle, Package, Clock, ShieldCheck, HelpCircle, SlidersHorizontal, Filter } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function App() {
  // --- 1. Core Reactive State Management with LocalStorage Persistance ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('daraz_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('daraz_vouchers');
    return saved ? JSON.parse(saved) : VOUCHERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('daraz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('daraz_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [bannedVendors, setBannedVendors] = useState<string[]>(() => {
    const saved = localStorage.getItem('daraz_banned_vendors');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('daraz_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Gems Program & Daily Spin States ---
  const [gems, setGems] = useState<number>(() => {
    const saved = localStorage.getItem('taiga_gems');
    return saved ? parseInt(saved, 10) : 150;
  });

  const [isGemsHubOpen, setIsGemsHubOpen] = useState(false);

  // Navigation states
  const [activeView, setActiveView] = useState<'home' | 'cart' | 'dashboard' | 'admin' | 'wishlist' | 'account' | 'detail' | 'gems'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // New filter states for category browse flow
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity');

  // --- Browser back button & swipe-back gesture sync ---
  const lastHistoryState = React.useRef({
    activeView: 'home' as 'home' | 'cart' | 'dashboard' | 'admin' | 'wishlist' | 'account' | 'detail' | 'gems',
    selectedCategory: null as string | null,
    selectedBrand: null as string | null,
    selectedProductId: null as string | null,
    searchTerm: '' as string,
  });

  // Track state changes and push native browser history state
  useEffect(() => {
    const currentState = {
      activeView,
      selectedCategory,
      selectedBrand,
      selectedProductId: selectedProduct ? selectedProduct.id : null,
      searchTerm,
    };

    if (
      lastHistoryState.current.activeView === currentState.activeView &&
      lastHistoryState.current.selectedCategory === currentState.selectedCategory &&
      lastHistoryState.current.selectedBrand === currentState.selectedBrand &&
      lastHistoryState.current.selectedProductId === currentState.selectedProductId &&
      lastHistoryState.current.searchTerm === currentState.searchTerm
    ) {
      return;
    }

    lastHistoryState.current = currentState;
    window.history.pushState(currentState, '');
  }, [activeView, selectedCategory, selectedBrand, selectedProduct, searchTerm]);

  // Sync state when native browser back/forward popstate triggers
  useEffect(() => {
    const initialState = {
      activeView: 'home',
      selectedCategory: null,
      selectedBrand: null,
      selectedProductId: null,
      searchTerm: '',
    };
    if (!window.history.state) {
      window.history.replaceState(initialState, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        lastHistoryState.current = {
          activeView: state.activeView || 'home',
          selectedCategory: state.selectedCategory || null,
          selectedBrand: state.selectedBrand || null,
          selectedProductId: state.selectedProductId || null,
          searchTerm: state.searchTerm || '',
        };

        setActiveView(state.activeView || 'home');
        setSelectedCategory(state.selectedCategory || null);
        setSelectedBrand(state.selectedBrand || null);
        setSearchTerm(state.searchTerm || '');
        if (state.selectedProductId) {
          const prod = products.find(p => p.id === state.selectedProductId);
          setSelectedProduct(prod || null);
        } else {
          setSelectedProduct(null);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [products]);

  // Logged in User state with persistent database sync
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'user' | 'vendor' | 'admin'; emailOrPhone?: string } | null>(() => {
    const saved = localStorage.getItem('daraz_current_user');
    if (saved) return JSON.parse(saved);
    const defaultUser = { name: 'Suresh Perera', role: 'user' as const, emailOrPhone: 'suresh@taiga.lk' };
    localStorage.setItem('daraz_current_user', JSON.stringify(defaultUser));
    return defaultUser;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync state with localstorage on change
  useEffect(() => {
    localStorage.setItem('daraz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('daraz_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('daraz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('daraz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('daraz_banned_vendors', JSON.stringify(bannedVendors));
  }, [bannedVendors]);

  useEffect(() => {
    localStorage.setItem('daraz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('taiga_gems', gems.toString());
  }, [gems]);

  // --- 2. Shopping Handlers ---
  
  // Toggle Wishlist item
  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Avoid opening detailed view on click
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  // Collect Voucher
  const handleCollectVoucher = (voucherId: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === voucherId ? { ...v, isCollected: true } : v))
    );
  };

  const handleAddCustomVoucher = (newVoucher: Voucher) => {
    setVouchers((prev) => {
      if (prev.some((v) => v.code === newVoucher.code)) return prev;
      return [newVoucher, ...prev];
    });
  };

  const handleAddGems = (amount: number) => {
    setGems((g) => Math.max(0, g + amount));
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, color: string, size: string, qty: number) => {
    const cartItemId = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prev, { id: cartItemId, product, selectedColor: color, selectedSize: size, quantity: qty }];
      }
    });
    alert(`Added ${qty}x ${product.title} (${color}, ${size}) to your cart!`);
  };

  // Buy Now (Adds to cart and redirects immediately to Cart view)
  const handleBuyNow = (product: Product, color: string, size: string, qty: number) => {
    const cartItemId = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prev, { id: cartItemId, product, selectedColor: color, selectedSize: size, quantity: qty }];
      }
    });
    setActiveView('cart');
  };

  // Update Cart Quantity
  const handleUpdateCartQty = (cartId: string, diff: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + diff;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
    );
  };

  // Remove item from Cart
  const handleRemoveCartItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  // Order Placement
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // --- 3. Vendor Product Operations ---
  const handleAddProductVendor = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProductVendor = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  // --- 4. Admin Panel Operations ---
  const handleToggleListingActive = (prodId: string) => {
    // Delete/Archive listing
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    alert('Listing has been archived and removed from the active marketplace.');
  };

  const handleBanVendor = (vendorId: string) => {
    setBannedVendors((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      } else {
        return [...prev, vendorId];
      }
    });
  };

  // --- 5. Navigation & Filter Mappers ---
  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);
    setSelectedBrand(null); // Reset brand when changing category
    setSelectedBrands([]); // Reset multiple brand checklist
    setPriceRange([0, 250000]); // Reset price range
    setInStockOnly(false); // Reset availability
    setMinDiscount(0); // Reset discount
    if (catId && catId !== 'all') {
      setIsMobileFilterOpen(true); // Auto-show mobile filter drawer
    }
  };

  const handleBrandSelect = (brandName: string | null) => {
    setSelectedBrand(brandName);
    setSelectedCategory(null); // Reset category when selecting brand
    setSelectedBrands(brandName ? [brandName] : []);
    setPriceRange([0, 250000]); // Reset price range
    setInStockOnly(false); // Reset availability
    setMinDiscount(0); // Reset discount
    if (brandName) {
      setIsMobileFilterOpen(true); // Auto-show mobile filter drawer
    }
  };

  const handleResetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedBrands([]);
    setSelectedRating(null);
    setPriceRange([0, 250000]);
    setInStockOnly(false);
    setMinDiscount(0);
    setSearchTerm('');
    setSortBy('popularity');
  };

  // Filter Catalog based on Banned vendors, category, multiple brands, price range, stock, and discount
  const filteredProducts = products.filter((p) => {
    // Exclude banned vendors
    if (bannedVendors.includes(p.vendor.id)) return false;

    // Search filter
    if (searchTerm) {
      const text = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(text);
      const matchBrand = p.brand.toLowerCase().includes(text);
      const matchCat = p.category.toLowerCase().includes(text);
      if (!matchTitle && !matchBrand && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all' && p.category !== selectedCategory) return false;

    // Brand filters (multiple brand selection takes precedence)
    if (selectedBrands.length > 0) {
      if (!selectedBrands.includes(p.brand)) return false;
    } else if (selectedBrand) {
      if (p.brand !== selectedBrand) return false;
    }

    // Rating filter (selected rating is the minimum rating)
    if (selectedRating && p.rating < selectedRating) return false;

    // Price range filter
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

    // Availability toggle (In stock only)
    if (inStockOnly && p.stock <= 0) return false;

    // Discount percentage filter
    if (minDiscount > 0 && p.discount < minDiscount) return false;

    return true;
  });

  // Sort filtered products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'top-rated':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'popularity':
      default:
        return b.soldCount - a.soldCount; // Higher sales count first for popularity
    }
  });

  const hasAnyFilterActive = 
    !!selectedCategory || 
    !!selectedBrand || 
    selectedBrands.length > 0 || 
    selectedRating !== null || 
    priceRange[0] > 0 || 
    priceRange[1] < 250000 || 
    inStockOnly || 
    minDiscount > 0 ||
    !!searchTerm;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-between font-sans">
      
      {/* Redesigned Daraz.lk Header */}
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        selectedBrand={selectedBrand}
        onBrandSelect={setSelectedBrand}
        selectedRating={selectedRating}
        onRatingSelect={setSelectedRating}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedProduct(null);
        }}
        activeView={activeView}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          localStorage.removeItem('daraz_current_user');
          setIsLoginModalOpen(true);
        }}
        onLoginClick={() => setIsLoginModalOpen(true)}
        gems={gems}
        onOpenGemsHub={() => setActiveView('gems')}
      />

      {/* Main Container Core Routing */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-4 md:py-6 w-full pb-20 md:pb-6">
        
        {/* VIEW 1: PRODUCT DETAILS SCREEN */}
        {activeView === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenChat={(vendorId, vendorName) => {
              alert(`Chat thread opened with ${vendorName}. Type queries using our Smart AI Helper floating in the corner!`);
            }}
            onBackToHome={() => {
              setSelectedProduct(null);
              setActiveView('home');
            }}
          />
        )}

        {/* VIEW 2: CART & CHECKOUT PAGE */}
        {activeView === 'cart' && (
          <CartCheckout
            cartItems={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            collectedVouchers={vouchers.filter((v) => v.isCollected)}
            onPlaceOrder={handlePlaceOrder}
            onClearCart={handleClearCart}
            onBackToShopping={() => setActiveView('home')}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 3: VENDOR DASHBOARD PANEL */}
        {activeView === 'dashboard' && (
          <VendorDashboard
            products={products}
            onAddProduct={handleAddProductVendor}
            onDeleteProduct={handleDeleteProductVendor}
          />
        )}

        {/* VIEW 4: ADMIN CONTROLS PANEL */}
        {activeView === 'admin' && (
          <AdminPanel
            products={products}
            onToggleListing={handleToggleListingActive}
            onBanVendor={handleBanVendor}
            bannedVendors={bannedVendors}
          />
        )}

        {/* VIEW 5: USER WISHLIST SCREEN */}
        {activeView === 'wishlist' && (
          <div className="bg-white rounded-xl border p-6 shadow-sm" id="wishlist-page">
            <h2 className="text-xl font-black text-gray-900 mb-4 uppercase">My Saved Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <p className="text-xs text-gray-500">Your wishlist is empty. Explore and tap heart icons on cards to save deals!</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products
                  .filter((p) => wishlist.includes(p.id))
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={() => {
                        setSelectedProduct(p);
                        setActiveView('detail');
                      }}
                      isWishlisted={true}
                      onWishlistToggle={handleWishlistToggle}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: ACCOUNT & NOTIFICATIONS SCREEN */}
        {activeView === 'account' && (
          <div className="max-w-2xl mx-auto bg-white border rounded-xl p-6 shadow-sm font-sans" id="account-page">
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-4 mb-4">
              <div className="h-16 w-16 bg-orange-100 text-[#F85606] font-black text-xl rounded-full flex items-center justify-center uppercase">
                {currentUser ? currentUser.name.slice(0, 2) : '??'}
              </div>
              <div className="flex-1">
                <h3 className="font-extrabold text-lg text-gray-900">
                  {currentUser ? currentUser.name : 'Guest User'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-semibold">
                  {currentUser ? (
                    currentUser.role === 'admin' 
                      ? '🔒 System Administrator | Taiga Office' 
                      : currentUser.role === 'vendor' 
                        ? '🏪 Official Store Vendor | Taiga Mall' 
                        : '🛒 Regular Buyer | Sri Lanka Hub'
                  ) : (
                    'Not logged in. Log in to track purchases.'
                  )}
                </p>
                {!currentUser && (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="mt-2 text-[10px] font-black text-white bg-[#FF4500] hover:bg-[#E03D00] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Log In / Sign Up
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Notifications log */}
            <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider mb-3">Taiga Sri Lanka Message Inbox</h4>
            <div className="space-y-3">
              <div className="bg-orange-50/40 border border-orange-100 p-3 rounded-lg text-xs flex items-start gap-2.5">
                <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={14} />
                <div>
                  <span className="font-bold text-gray-800 block">Voucher Collected: Rs. 1000 off</span>
                  <span className="text-gray-500">Voucher coupon code <b>DARAZ1000</b> is ready for use on checkouts exceeding Rs. 5,000!</span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-xs flex items-start gap-2.5">
                <Package className="text-blue-500 mt-0.5 shrink-0" size={14} />
                <div>
                  <span className="font-bold text-gray-800 block">Fulfillment Dispatch Succeeded</span>
                  <span className="text-gray-500">Logistics dispatch has registered your commercial delivery package tracking.</span>
                </div>
              </div>

              {orders.length > 0 ? (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider mb-3">Your Order History</h4>
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="border border-gray-100 rounded-lg p-3 text-xs bg-gray-50/50">
                        <div className="flex justify-between font-bold text-gray-800">
                          <span>ID: {order.id}</span>
                          <span className="text-[#F85606]">Rs. {order.totalAmount.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Date: {order.date} | Method: {order.paymentMethod}</p>
                        <p className="text-[10px] text-gray-500 mt-1">Status: <span className="text-amber-600 font-bold">{order.status}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-4">No order history registered yet.</p>
              )}
            </div>
          </div>
        )}

        {/* VIEW 6.5: DEDICATED GEMS PROGRAM & REDEEM HUB */}
        {activeView === 'gems' && (
          <GemsPage
            gems={gems}
            onAddGems={handleAddGems}
            products={products}
            onProductClick={(product) => {
              setSelectedProduct(product);
              setActiveView('detail');
            }}
            onBackToHome={() => {
              setActiveView('home');
            }}
          />
        )}

        {/* VIEW 7: PRIMARY LANDING HOMEPAGE */}
        {activeView === 'home' && (
          <div className="space-y-6" id="homepage-core">
            
            {/* Conditional Display: Standard Homepage widgets vs. Dedicated Product Listing Page */}
            {!(selectedCategory || selectedBrand || searchTerm) ? (
              // --- 7A. Standard Rich Landing Homepage ---
              <>
                {/* 1. Dashboard Layout (Bento Grid matching screenshot on desktop) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="homepage-main-showcase">
                  {/* Left Side: Category Panel (exactly as screenshot!) */}
                  <div className="hidden lg:flex lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-4 flex-col justify-between h-[420px] shadow-sm font-sans text-xs">
                    <div className="space-y-1">
                      {CATEGORIES.slice(0, 11).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className="w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-gray-700 hover:text-[#F85606] hover:bg-orange-50/50 font-semibold transition-colors text-left group cursor-pointer"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-gray-400 group-hover:text-[#F85606] transition-colors">&rsaquo;</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className="text-center font-bold text-[#F85606] hover:underline pt-2 border-t border-gray-50/80 cursor-pointer text-xs"
                    >
                      View all
                    </button>
                  </div>

                  {/* Center: Hero Carousel & Promo Banners underneath */}
                  <div className="col-span-1 lg:col-span-6 flex flex-col justify-between gap-4 h-[420px]">
                    <HeroCarousel />
                    {/* Two small horizontal banners side by side exactly like screenshot! */}
                    <div className="grid grid-cols-2 gap-4 h-[120px] shrink-0">
                      <div 
                        onClick={() => handleCategorySelect('electronics-gadgets')}
                        className="relative h-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-gradient-to-br from-orange-500 to-amber-500 text-white p-4 flex flex-col justify-center text-left"
                      >
                        <h4 className="font-extrabold text-xs uppercase tracking-wider">Shop With Confidence</h4>
                        <p className="text-[9px] text-orange-100 mt-1 uppercase">ANYTIME, ANYWHERE</p>
                        <span className="text-[9px] mt-2 font-bold bg-white text-orange-600 px-2.5 py-1 rounded-full w-max group-hover:scale-105 transition-transform">
                          Explore
                        </span>
                      </div>
                      <div 
                        onClick={() => handleCategorySelect('clothing-fashion')}
                        className="relative h-full rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-4 flex flex-col justify-center text-left"
                      >
                        <h4 className="font-extrabold text-xs uppercase tracking-wider">Seasonal Selections</h4>
                        <p className="text-[9px] text-teal-100 mt-1 uppercase">NEW ARRIVALS LIVE</p>
                        <span className="text-[9px] mt-2 font-bold bg-white text-teal-700 px-2.5 py-1 rounded-full w-max group-hover:scale-105 transition-transform">
                          Browse
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Tall promo banner exactly like screenshot! */}
                  <div 
                    onClick={() => handleCategorySelect('beauty-personal-care')}
                    className="hidden lg:flex lg:col-span-3 relative h-[420px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer group bg-gradient-to-b from-[#F85606] to-[#FF6600] text-white p-6 flex-col justify-between text-left"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white text-[#F85606] px-2.5 py-1 rounded-full">
                        New Arrivals
                      </span>
                      <h3 className="text-2xl font-black uppercase tracking-tight mt-5 leading-tight">
                        Just<br />Dropped
                      </h3>
                      <p className="text-xs text-orange-100 mt-2 font-semibold">Check Them Out!</p>
                    </div>
                    
                    {/* Decorative images representation or neat visual container */}
                    <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-xs text-[10px]">
                      <p className="font-bold">Your Favorite Products, All in One Place.</p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/15">
                        <span className="text-[9px] uppercase font-bold tracking-wider">Explore Collection</span>
                        <span className="text-base font-black">&rsaquo;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Horizontal Voucher/Coupon strip with interactive Collect buttons */}
                <VoucherStrip 
                  vouchers={vouchers} 
                  onCollect={handleCollectVoucher} 
                />

                {/* 3. Circular category icon grid */}
                <CategoryCircleGrid 
                  onCategorySelect={handleCategorySelect} 
                  selectedCategory={selectedCategory}
                />

                {/* 3.5. Interactive Gems & Lucky Wheel Promo Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans" id="gems-promos-container">
                  {/* Earn Gems Card matching second screenshot */}
                  <button 
                    onClick={() => setActiveView('gems')}
                    className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 hover:from-amber-100 hover:to-orange-100 border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer transition-all duration-300 group hover:scale-[1.01] text-left w-full"
                    id="earn-gems-home-tile"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="relative h-16 w-16 bg-[#0091FF] rounded-2xl flex items-center justify-center text-center overflow-hidden shrink-0 shadow-md">
                        <div className="absolute inset-1 bg-gradient-to-tr from-[#FF00AA] to-[#FF4CC4] rounded-xl flex flex-col items-center justify-center p-1 text-white leading-none">
                          <span className="text-[7px] font-black uppercase tracking-tighter opacity-90 block mb-0.5">UP TO</span>
                          <span className="text-sm font-black tracking-tighter block leading-none">99%</span>
                          <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5 block">OFF</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm md:text-base font-black text-gray-900 leading-tight uppercase tracking-wide">Earn Gems</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed max-w-[200px] md:max-w-xs">Complete simple daily quests & check-in to accumulate rare gems.</p>
                        <span className="text-xs font-black text-[#FF00AA] flex items-center gap-1 mt-1.5 group-hover:translate-x-0.5 transition-transform">
                          Click to Collect <span className="font-sans font-bold">&rsaquo;</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 h-9 w-9 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm shrink-0 font-bold text-sm">💎</div>
                  </button>

                  {/* Lucky Spin Card matching first screenshot */}
                  <button 
                    onClick={() => setIsGemsHubOpen(true)}
                    className="bg-gradient-to-br from-red-50/70 to-pink-50/40 hover:from-red-100 hover:to-pink-100 border border-red-100 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer transition-all duration-300 group hover:scale-[1.01] text-left w-full"
                    id="lucky-spin-home-tile"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white border-2 border-red-500 animate-pulse">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin-slow">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2v20M2 12h20M5.8 5.8l12.4 12.4M5.8 18.2l12.4-12.4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm md:text-base font-black text-gray-900 leading-tight uppercase tracking-wide">Daily Spin & Win</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed max-w-[200px] md:max-w-xs">Test your luck with our fortune wheel to claim active rewards.</p>
                        <span className="text-xs font-black text-red-600 flex items-center gap-1 mt-1.5 group-hover:translate-x-0.5 transition-transform">
                          Spin now <span className="font-sans font-bold">&rsaquo;</span>
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-50 text-red-600 h-9 w-9 rounded-full flex items-center justify-center border border-red-100 shadow-sm shrink-0 font-bold text-sm">🎡</div>
                  </button>
                </div>

                {/* 4. High-energy Flash Sale section with redclaim progress lines */}
                <FlashSale 
                  products={products} 
                  onProductClick={(p) => {
                    setSelectedProduct(p);
                    setActiveView('detail');
                  }}
                />

                {/* 5. Top Brands logo partnership tiles */}
                <TopBrands 
                  onBrandSelect={handleBrandSelect} 
                  selectedBrand={selectedBrand}
                />

                {/* 6. Promotional Banners grid columns (2-col and 3-col layouts) */}
                <PromotionalBanners onCategorySelect={handleCategorySelect} />

                {/* 7. "Just For You" Infinite-scroll grid heading & list */}
                <div className="pt-6" id="recommendation-grid-section">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
                    <span className="text-base md:text-lg font-black tracking-wide uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-[#F85606] to-[#FF6600]">
                      JUST FOR YOU
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sortedProducts.slice(0, 12).map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onClick={() => {
                          setSelectedProduct(p);
                          setActiveView('detail');
                        }}
                        isWishlisted={wishlist.includes(p.id)}
                        onWishlistToggle={handleWishlistToggle}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // --- 7B. DEDICATED CATEGORY & FILTERED PRODUCT LISTING PAGE (STUCK-PROOF NAV) ---
              <div className="space-y-6 animate-fade-in font-sans" id="dedicated-listing-page">
                {/* 1. Breadcrumbs and Back Button Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
                  <div className="flex items-center space-x-3.5 flex-wrap">
                    {/* Stuck-proof Back Button */}
                    <button
                      onClick={() => {
                        if (window.history.state && window.history.state.activeView) {
                          window.history.back();
                        } else {
                          handleResetAllFilters();
                        }
                      }}
                      className="flex items-center gap-2 px-3.5 py-2 bg-gray-50 hover:bg-orange-50 hover:text-[#F85606] text-gray-700 font-extrabold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer shadow-xs"
                      id="listing-back-button"
                    >
                      <Icons.ArrowLeft size={14} className="text-[#F85606]" />
                      <span>Back</span>
                    </button>

                    {/* Breadcrumbs Trail */}
                    <div className="flex items-center space-x-2 text-xs text-gray-500 flex-wrap py-1">
                      <button 
                        onClick={handleResetAllFilters}
                        className="hover:text-[#F85606] font-semibold transition-colors"
                      >
                        Home
                      </button>
                      <Icons.ChevronRight size={11} className="text-gray-300" />
                      <button 
                        onClick={() => handleCategorySelect('all')}
                        className={`hover:text-[#F85606] font-semibold transition-colors ${selectedCategory === 'all' ? 'text-[#F85606] font-extrabold' : ''}`}
                      >
                        All Offerings
                      </button>
                      {selectedCategory && selectedCategory !== 'all' && (
                        <>
                          <Icons.ChevronRight size={11} className="text-gray-300" />
                          <span className="text-gray-800 font-extrabold">
                            {CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}
                          </span>
                        </>
                      )}
                      {selectedBrand && (
                        <>
                          <Icons.ChevronRight size={11} className="text-gray-300" />
                          <span className="text-gray-800 font-extrabold">{selectedBrand}</span>
                        </>
                      )}
                      {searchTerm && (
                        <>
                          <Icons.ChevronRight size={11} className="text-gray-300" />
                          <span className="text-gray-400 font-medium">Search:</span>
                          <span className="text-gray-800 font-extrabold truncate max-w-[150px]">"{searchTerm}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Header Actions: Sort Dropdown & Mobile Filter Button */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-700 font-semibold shadow-xs">
                      <span className="text-gray-400 font-medium">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-gray-800 font-extrabold focus:outline-none cursor-pointer"
                        id="listing-sort-dropdown"
                      >
                        <option value="popularity">Popularity</option>
                        <option value="price-asc">Price Low to High</option>
                        <option value="price-desc">Price High to Low</option>
                        <option value="newest">Newest</option>
                        <option value="top-rated">Top Rated</option>
                      </select>
                    </div>

                    {/* Mobile filter button trigger */}
                    <button
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-[11px] bg-orange-50 border border-orange-200 text-[#F85606] font-extrabold rounded-lg hover:bg-orange-100 transition-all cursor-pointer shadow-xs"
                      id="mobile-filter-drawer-trigger"
                    >
                      <Icons.SlidersHorizontal size={13} />
                      <span>Filter</span>
                      {hasAnyFilterActive && (
                        <span className="bg-[#F85606] text-white rounded-full h-4.5 w-4.5 flex items-center justify-center text-[8px] font-black leading-none">
                          !
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Listing Meta Summary */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
                  <div>
                    <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">
                      {selectedCategory && selectedCategory !== 'all'
                        ? CATEGORIES.find(c => c.id === selectedCategory)?.name
                        : selectedBrand 
                          ? `${selectedBrand} Collection`
                          : searchTerm 
                            ? `Search results for "${searchTerm}"`
                            : "All marketplace listings"
                      }
                    </h2>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">
                      We found <span className="text-[#F85606] font-extrabold">{sortedProducts.length} items</span> matching your criteria
                    </p>
                  </div>

                  {hasAnyFilterActive && (
                    <button
                      onClick={handleResetAllFilters}
                      className="text-xs text-[#F85606] font-bold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Icons.RefreshCw size={12} />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* 3. Main Workspace Flex layout */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Desktop Filter Sidebar */}
                  <FilterSidebar 
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    selectedBrand={selectedBrand}
                    onBrandSelect={handleBrandSelect}
                    selectedRating={selectedRating}
                    onRatingSelect={setSelectedRating}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    selectedBrands={selectedBrands}
                    onBrandsChange={setSelectedBrands}
                    inStockOnly={inStockOnly}
                    onInStockOnlyChange={setInStockOnly}
                    minDiscount={minDiscount}
                    onMinDiscountChange={setMinDiscount}
                    products={products}
                  />

                  {/* Mobile Drawer Filter */}
                  <FilterSidebar 
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    selectedBrand={selectedBrand}
                    onBrandSelect={handleBrandSelect}
                    selectedRating={selectedRating}
                    onRatingSelect={setSelectedRating}
                    isOpenMobile={isMobileFilterOpen}
                    onCloseMobile={() => setIsMobileFilterOpen(false)}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    selectedBrands={selectedBrands}
                    onBrandsChange={setSelectedBrands}
                    inStockOnly={inStockOnly}
                    onInStockOnlyChange={setInStockOnly}
                    minDiscount={minDiscount}
                    onMinDiscountChange={setMinDiscount}
                    products={products}
                  />

                  {/* Products Feed Grid */}
                  <div className="flex-1 w-full">
                    {sortedProducts.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-500 text-xs shadow-sm" id="empty-listings-alert">
                        <Icons.Filter className="mx-auto text-gray-300 mb-3" size={32} />
                        <p className="font-extrabold text-sm text-gray-700">No active deals found</p>
                        <p className="text-[11px] text-gray-400 mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
                          Try shifting your price range, clearing ratings, or disabling stock filters to find other amazing options.
                        </p>
                        <button
                          onClick={handleResetAllFilters}
                          className="px-5 py-2.5 bg-[#F85606] text-white text-xs font-black rounded-xl hover:opacity-95 transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                        >
                          Reset Filters & View All
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4" id="listings-product-grid">
                        {sortedProducts.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            onClick={() => {
                              setSelectedProduct(p);
                              setActiveView('detail');
                            }}
                            isWishlisted={wishlist.includes(p.id)}
                            onWishlistToggle={handleWishlistToggle}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Sparkly AI assistant helper widget */}
      <AiAssistant 
        currentProduct={selectedProduct} 
        onAddToCart={(p, col, sz, qty) => handleAddToCart(p, col, sz, qty)}
      />

      {/* Mobile-Only Bottom App Navigation bar (5 icons) */}
      <MobileNavBar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedProduct(null);
        }}
        cartCount={cartCount}
      />

      {/* Beautiful High-density Desktop Footer */}
      <Footer />

      {/* Interactive lucky spin wheel game & Gems collection hub */}
      <SpinGame 
        isOpen={isGemsHubOpen}
        onClose={() => setIsGemsHubOpen(false)}
        onCollectVoucher={handleCollectVoucher}
        onAddCustomVoucher={handleAddCustomVoucher}
        vouchers={vouchers}
        gems={gems}
        onAddGems={handleAddGems}
      />

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      )}

    </div>
  );
}
