import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Search, Camera, Star, MapPin, 
  Sparkles, CheckCircle2, Lock, Gift, Flame, ShoppingBag
} from 'lucide-react';
import { Product } from '../types';

interface GemsPageProps {
  gems: number;
  onAddGems: (amount: number) => void;
  products: Product[];
  onProductClick: (product: Product) => void;
  onBackToHome: () => void;
}

interface GemsProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  gemDiscountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: string;
  image: string;
  location?: string;
  isMall?: boolean;
}

const GEMS_DEALS: GemsProduct[] = [
  {
    id: 'gems-p1',
    title: 'Janet Stay Fresh Perfumed Deodorant - Pink Petals 24H Care',
    price: 664,
    originalPrice: 700,
    gemDiscountPercent: 5,
    rating: 5.0,
    reviewCount: 133,
    soldCount: '611 Sold',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=300&fit=crop&q=80',
    isMall: true
  },
  {
    id: 'gems-p2',
    title: 'Wild Strawberry Lip Balm Janet 3.5 G - Deep Moisturizing',
    price: 214,
    originalPrice: 330,
    gemDiscountPercent: 35,
    rating: 4.8,
    reviewCount: 667,
    soldCount: '2.8K Sold',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&fit=crop&q=80',
    location: 'Western',
    isMall: true
  },
  {
    id: 'gems-p3',
    title: 'Janet Spearmint No Marks Treatment Face Cream - Clarifying Formula',
    price: 480,
    originalPrice: 600,
    gemDiscountPercent: 20,
    rating: 4.7,
    reviewCount: 242,
    soldCount: '1.2K Sold',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=300&fit=crop&q=80',
    location: 'Western',
    isMall: true
  },
  {
    id: 'gems-p4',
    title: 'Pimplesout Spearmint No Marks Gel Treatment 15g - Active Acne Defense',
    price: 350,
    originalPrice: 500,
    gemDiscountPercent: 30,
    rating: 4.9,
    reviewCount: 94,
    soldCount: '418 Sold',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&fit=crop&q=80',
    location: 'Western',
    isMall: true
  },
  {
    id: 'gems-p5',
    title: 'Sunsilk Hair Fall Solution Shampoo with Ginseng - Strength & Shine',
    price: 850,
    originalPrice: 1000,
    gemDiscountPercent: 15,
    rating: 4.8,
    reviewCount: 1201,
    soldCount: '4.5K Sold',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&fit=crop&q=80',
    location: 'Western',
    isMall: true
  },
  {
    id: 'gems-p6',
    title: 'Seylon Golden Blend Tea Leaves Premium Pack 400G - Fresh Ceylon Tea',
    price: 590,
    originalPrice: 750,
    gemDiscountPercent: 21,
    rating: 4.9,
    reviewCount: 812,
    soldCount: '3.1K Sold',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&fit=crop&q=80',
    location: 'Central',
    isMall: true
  }
];

export default function GemsPage({
  gems,
  onAddGems,
  products,
  onProductClick,
  onBackToHome,
}: GemsPageProps) {
  const [searchQuery, setSearchQuery] = useState('power bank');
  const [activeTab, setActiveTab] = useState<'deals' | 'viewed' | 'wanted'>('deals');
  const [checkedIn, setCheckedIn] = useState(() => {
    return localStorage.getItem('taiga_gems_checked_in_today') === 'true';
  });
  const [streakCount, setStreakCount] = useState(() => {
    const saved = localStorage.getItem('taiga_gems_streak_count');
    return saved ? parseInt(saved, 10) : 5; // Start with 5 days streak if empty for realistic simulation
  });
  const [showCelebrate, setShowCelebrate] = useState(false);

  const handleCheckIn = () => {
    if (checkedIn) return;
    onAddGems(700);
    setCheckedIn(true);
    setStreakCount(prev => prev + 1);
    localStorage.setItem('taiga_gems_checked_in_today', 'true');
    localStorage.setItem('taiga_gems_streak_count', (streakCount + 1).toString());
    setShowCelebrate(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-[#FDF9F5] min-h-screen pb-20 shadow-xl border border-orange-100 rounded-3xl overflow-hidden font-sans relative" id="gems-dedicated-page">
      
      {/* 1. Header (Precisely matching the second screenshot) */}
      <div className="bg-[#FFF8F3] px-4 py-3 flex items-center justify-between border-b border-orange-50 sticky top-0 z-40" id="gems-header-nav">
        <div className="flex items-center space-x-2.5">
          {/* Back button */}
          <button 
            onClick={onBackToHome}
            className="p-1 hover:bg-orange-50 rounded-full transition-colors cursor-pointer"
            id="gems-back-arrow"
          >
            <ArrowLeft size={22} className="text-gray-800" />
          </button>
          
          {/* Dynamic title showing real-time gems state */}
          <div className="flex items-center space-x-1 font-sans text-sm md:text-base">
            <span className="font-extrabold text-gray-900 text-base">Gems</span>
            <span className="text-purple-600 font-bold text-lg">💎</span>
            <span className="font-black text-gray-900 tracking-tight text-lg">{gems}</span>
            <span className="text-gray-400 font-bold text-sm ml-0.5">&rsaquo;</span>
          </div>
        </div>

        {/* Search Bar matching screenshot */}
        <div className="flex items-center bg-white border border-pink-500 rounded-lg overflow-hidden h-9 w-[190px] sm:w-[240px] shadow-sm">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent px-2 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
            placeholder="Search power bank..."
          />
          <button className="bg-pink-600 text-white h-full px-2.5 flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer">
            <Search size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Celebration animation overlays */}
      {showCelebrate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border-2 border-pink-500 rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl animate-scale-up">
            <div className="text-5xl mb-3 animate-bounce">💎</div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Check-In Complete!</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Fantastic work! You have successfully collected <span className="text-pink-600 font-black">+700 Gems</span> into your digital wallet. Use gems to claim up to <span className="text-pink-600 font-bold">99% OFF coupons</span> at checkout!
            </p>
            <button 
              onClick={() => setShowCelebrate(false)}
              className="mt-5 w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-pink-500/20 cursor-pointer"
            >
              Start Redeeming
            </button>
          </div>
        </div>
      )}

      {/* 2. Streak section matching second screenshot */}
      <div className="p-4 bg-white m-3 rounded-2xl border border-orange-100 shadow-sm" id="gems-streak-container">
        <div className="flex items-start space-x-3.5">
          {/* Calendar block left */}
          <div className="h-14 w-12 bg-amber-50 border border-amber-200 rounded-xl flex flex-col items-center justify-between overflow-hidden shadow-xs shrink-0">
            <div className="bg-amber-400 w-full py-0.5 text-center text-[7px] font-black text-amber-950 uppercase tracking-wider">
              Calendar
            </div>
            <div className="flex-1 flex flex-col items-center justify-center leading-none py-1">
              <span className="text-xs font-black text-amber-900 leading-none">**</span>
              <span className="text-[7px] font-bold text-amber-600 uppercase mt-0.5">Day</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wide leading-tight">Streak</h3>
            <p className="text-xs text-gray-500 font-bold mt-0.5">
              {checkedIn ? 'Successfully collected for today!' : 'Daily check-in: Get 700 gems today'}
            </p>
          </div>
        </div>

        {/* Horizontal Calendar row */}
        <div className="flex space-x-2 overflow-x-auto py-3.5 scrollbar-thin mt-1.5">
          {/* Today Card */}
          <div className="flex flex-col items-center shrink-0 w-20">
            <div className={`w-full rounded-xl border flex flex-col items-center justify-between p-1.5 h-20 transition-all ${checkedIn ? 'bg-pink-50 border-pink-300' : 'bg-white border-pink-400 shadow-sm'}`}>
              <span className="text-[9px] font-black text-pink-600 uppercase tracking-wider">Today</span>
              <div className="text-xl">💎</div>
              <div className="bg-pink-600 text-white text-[10px] font-black py-0.5 px-2 rounded-md w-full text-center">
                700
              </div>
            </div>

            {/* Collect button */}
            <button
              onClick={handleCheckIn}
              disabled={checkedIn}
              className={`mt-2 w-full text-[10px] font-black py-1.5 px-1 rounded-full transition-all shadow-sm flex items-center justify-center gap-0.5 uppercase cursor-pointer ${
                checkedIn 
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white hover:scale-[1.02]'
              }`}
              id="collect-streak-gems-btn"
            >
              <span>{checkedIn ? 'Claimed' : 'Collect 700'}</span>
              {!checkedIn && <span className="text-[9px]">💎</span>}
            </button>
          </div>

          {/* Locked Future Day 1 */}
          <div className="flex flex-col items-center shrink-0 w-20 opacity-75">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-between p-1.5 h-20 relative">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase">2 Jul</span>
              <div className="text-xl filter grayscale">💎</div>
              <div className="bg-gray-200 text-gray-500 text-[9px] font-extrabold py-0.5 px-2 rounded-md w-full text-center flex items-center justify-center gap-0.5">
                <Lock size={8} /> 850
              </div>
            </div>
            <button disabled className="mt-2 w-full text-[9px] font-extrabold py-1.5 px-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center">
              Locked
            </button>
          </div>

          {/* Locked Future Day 2 */}
          <div className="flex flex-col items-center shrink-0 w-20 opacity-75">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-between p-1.5 h-20 relative">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase">3 Jul</span>
              <div className="text-xl filter grayscale">💎</div>
              <div className="bg-gray-200 text-gray-500 text-[9px] font-extrabold py-0.5 px-2 rounded-md w-full text-center flex items-center justify-center gap-0.5">
                <Lock size={8} /> 900
              </div>
            </div>
            <button disabled className="mt-2 w-full text-[9px] font-extrabold py-1.5 px-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center">
              Locked
            </button>
          </div>

          {/* Locked Future Day 3 */}
          <div className="flex flex-col items-center shrink-0 w-20 opacity-75">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-between p-1.5 h-20 relative">
              <span className="text-[9px] font-extrabold text-gray-400 uppercase">4 Jul</span>
              <div className="text-xl filter grayscale">💎</div>
              <div className="bg-gray-200 text-gray-500 text-[9px] font-extrabold py-0.5 px-2 rounded-md w-full text-center flex items-center justify-center gap-0.5">
                <Lock size={8} /> 900
              </div>
            </div>
            <button disabled className="mt-2 w-full text-[9px] font-extrabold py-1.5 px-1 rounded-full bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-center">
              Locked
            </button>
          </div>
        </div>
      </div>

      {/* 3. Promo Banner section matching screenshot */}
      <div className="px-3">
        <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 rounded-2xl overflow-hidden p-4 shadow-md text-white flex items-center justify-between h-[110px]" id="gems-offer-banner">
          {/* Sparkly graphics representation */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
          
          <div className="z-10 max-w-[65%] text-left">
            <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-400 text-gray-950 px-2 py-0.5 rounded-full inline-block mb-1 shadow-sm">
              Flash Deal Boost
            </span>
            <h4 className="text-sm md:text-base font-black leading-tight uppercase tracking-wide">
              Collect & Grab
            </h4>
            <p className="text-lg md:text-xl font-black text-yellow-300 leading-none mt-0.5 uppercase tracking-tighter">
              Up To 20% Off
            </p>
            <p className="text-[9px] font-extrabold text-pink-100 uppercase tracking-wider mt-1">
              With Accumulated Gems
            </p>
          </div>

          {/* Happy girl mockup illustration/vector representation */}
          <div className="relative h-full w-[35%] flex items-end justify-center">
            <div className="absolute -bottom-1 right-2 h-[105px] w-[95px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&fit=crop&q=80" 
                alt="Shopper Banner" 
                className="h-full w-full object-cover object-top rounded-t-full border-2 border-white/20 shadow-lg brightness-105"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Overlay floaty gems icons */}
            <div className="absolute top-2 right-2 text-base animate-bounce">💎</div>
            <div className="absolute top-7 right-14 text-xs animate-pulse">💎</div>
            <div className="absolute bottom-4 right-1 text-xs">✨</div>
          </div>
        </div>
      </div>

      {/* 4. Scrollable Tabs Bar matching screenshot */}
      <div className="mt-4 px-3 border-b border-orange-100/50 bg-white" id="gems-tab-bar">
        <div className="flex space-x-6 text-xs md:text-sm font-bold text-gray-500">
          <button 
            onClick={() => setActiveTab('deals')}
            className={`pb-2.5 relative cursor-pointer font-extrabold transition-colors uppercase tracking-tight ${activeTab === 'deals' ? 'text-gray-950 border-b-2 border-gray-950' : 'hover:text-gray-900'}`}
          >
            Deals with Gems
          </button>
          <button 
            onClick={() => setActiveTab('viewed')}
            className={`pb-2.5 relative cursor-pointer font-extrabold transition-colors uppercase tracking-tight ${activeTab === 'viewed' ? 'text-gray-950 border-b-2 border-gray-950' : 'hover:text-gray-900'}`}
          >
            <span className="flex items-center gap-1">
              🕒 Viewed
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('wanted')}
            className={`pb-2.5 relative cursor-pointer font-extrabold transition-colors uppercase tracking-tight ${activeTab === 'wanted' ? 'text-gray-950 border-b-2 border-gray-950' : 'hover:text-gray-900'}`}
          >
            Most Wanted
          </button>
        </div>
      </div>

      {/* 5. Product Grid "Today's deal for you" */}
      <div className="p-3" id="gems-grid-section">
        
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-wider">
            Today's deal for you
          </h3>
          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            6 deals active
          </span>
        </div>

        {activeTab === 'deals' ? (
          <div className="grid grid-cols-2 gap-3" id="gems-deals-product-grid">
            {GEMS_DEALS.map((prod) => (
              <div 
                key={prod.id}
                onClick={() => {
                  // Create a matching Product object to redirect to details page
                  const fullProduct: Product = {
                    id: prod.id,
                    title: prod.title,
                    description: `${prod.title} - specially discounted with Gems. Highly rated personal care product. Formulated with authentic materials to deliver immediate premium benefits and reliable results. Packaged securely with fast island-wide shipping.`,
                    price: prod.price,
                    originalPrice: prod.originalPrice,
                    discount: prod.gemDiscountPercent,
                    rating: prod.rating,
                    reviewCount: prod.reviewCount,
                    soldCount: parseInt(prod.soldCount) || 250,
                    images: [prod.image],
                    category: 'beauty-personal-care',
                    subCategory: 'Personal Care',
                    brand: 'Janet',
                    stock: 45,
                    specifications: {
                      'Brand': 'Janet Ceylon',
                      'Origin': 'Sri Lanka',
                      'Discount Scheme': 'Taiga Gems Program Exclusive'
                    },
                    colors: ['Default'],
                    sizes: ['Standard'],
                    vendor: {
                      id: 'v-janet-ceylon',
                      name: 'Janet Ceylon Official Mall',
                      ratingPercent: 99,
                      responseTime: 'Within 1 hour',
                      isFollowed: false
                    },
                    reviews: [
                      {
                        id: 'r-gems-1',
                        userName: 'Heshani R.',
                        rating: 5,
                        comment: 'Authentic Janet product. Love the fragrance, absolutely long lasting and perfect!',
                        date: '2026-06-25',
                        verifiedPurchase: true
                      }
                    ],
                    qna: []
                  };
                  onProductClick(fullProduct);
                }}
                className="bg-white rounded-2xl border border-orange-50 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer flex flex-col group text-left relative font-sans"
              >
                {/* Image container */}
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Photo/search camera icon button matching second screenshot on top right */}
                  <div className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-md p-1 backdrop-blur-xs transition-all shadow-sm">
                    <Camera size={13} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Info block */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Triple Badges row: GEMS, 7.7, Mall */}
                    <div className="flex flex-wrap gap-1 mb-1.5 items-center">
                      <span className="bg-[#FF007A]/10 text-[#FF007A] text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                        GEMS
                      </span>
                      <span className="bg-indigo-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                        7.7
                      </span>
                      <span className="bg-[#D91B5C] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none flex items-center justify-center h-[14px]">
                        Mall
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-pink-600 transition-colors">
                      {prod.title}
                    </h4>

                    {/* Rating & Sold */}
                    <div className="flex items-center space-x-1 mt-1 text-[10px] text-gray-500 font-medium">
                      <span className="text-amber-500 font-extrabold flex items-center">
                        ★ {prod.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-300">({prod.reviewCount})</span>
                      <span className="text-gray-300">|</span>
                      <span>{prod.soldCount}</span>
                    </div>

                    {/* Location Tag if available */}
                    {prod.location && (
                      <div className="flex items-center text-gray-400 mt-1 space-x-0.5 text-[9px] font-semibold">
                        <MapPin size={9} className="text-gray-400" />
                        <span>{prod.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing row with Coin discount representation */}
                  <div className="mt-2.5 pt-2 border-t border-orange-50/50 flex flex-col">
                    <span className="text-xs font-black text-gray-950">
                      Rs.{prod.price.toLocaleString()} <span className="text-[9px] text-gray-400 font-bold">With coins</span>
                    </span>
                    
                    {/* Pink/orange dynamic discount tag */}
                    <div className="flex items-center space-x-1 mt-1 bg-pink-50 text-pink-600 text-[9px] font-black px-1.5 py-0.5 rounded-md w-max">
                      <span>💎</span>
                      <span>{prod.gemDiscountPercent}% OFF</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-12 text-center" id="gems-empty-tab-view">
            <ShoppingBag className="mx-auto text-gray-300 mb-2" size={24} />
            <p className="text-xs font-bold text-gray-600">No items available in this tab</p>
            <p className="text-[10px] text-gray-400 mt-1">Check back soon for personalized Viewed and Most Wanted deals!</p>
          </div>
        )}
      </div>

    </div>
  );
}
