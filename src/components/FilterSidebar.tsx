import React from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../data';
import { Product } from '../types';

interface FilterSidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (catId: string | null) => void;
  selectedBrand: string | null;
  onBrandSelect: (brandName: string | null) => void;
  selectedRating: number | null;
  onRatingSelect: (rating: number | null) => void;
  
  // New props for rich interactive filtering
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  selectedBrands?: string[];
  onBrandsChange?: (brands: string[]) => void;
  inStockOnly?: boolean;
  onInStockOnlyChange?: (inStock: boolean) => void;
  minDiscount?: number;
  onMinDiscountChange?: (discount: number) => void;
  
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  products?: Product[];
}

export default function FilterSidebar({
  selectedCategory,
  onCategorySelect,
  selectedBrand,
  onBrandSelect,
  selectedRating,
  onRatingSelect,
  priceRange = [0, 250000],
  onPriceRangeChange,
  selectedBrands = [],
  onBrandsChange,
  inStockOnly = false,
  onInStockOnlyChange,
  minDiscount = 0,
  onMinDiscountChange,
  isOpenMobile = false,
  onCloseMobile,
  products = []
}: FilterSidebarProps) {
  
  // Category counts
  const getCategoryCount = (id: string, defCount: number = 0) => {
    if (products && products.length > 0) {
      return products.filter(p => p.category === id).length;
    }
    const counts: Record<string, number> = {
      'mobile-phones-accessories': 58,
      'electronics-gadgets': 130,
      'pet-supplies-accessories': 7,
      'home-kitchen': 1291,
      'beauty-personal-care': 252,
      'clothing-fashion': 483,
      'groceries-daily-essentials': 3,
      'sports-outdoors': 91,
      'perfumes-fragrances': 12,
      'health-wellness': 42,
      'books-media': 11,
      'automotive-motorbike': 26,
      'sunglasses-eyewear': 114
    };
    return counts[id] !== undefined ? counts[id] : defCount;
  };

  // Get dynamic unique brands list from active products list or default list
  const dynamicBrands = React.useMemo(() => {
    const brandsMap: Record<string, number> = {};
    if (products && products.length > 0) {
      products.forEach(p => {
        if (p.brand) {
          brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
        }
      });
    }
    const list = Object.keys(brandsMap).map(name => ({
      name,
      count: brandsMap[name]
    }));
    if (list.length === 0) {
      return [
        { name: 'Apple', count: 12 },
        { name: 'Samsung', count: 8 },
        { name: 'Taiga', count: 4 },
        { name: 'Baseus', count: 6 },
        { name: 'Anker', count: 3 }
      ];
    }
    return list;
  }, [products]);

  const handleCategoryToggle = (id: string) => {
    if (selectedCategory === id) {
      onCategorySelect(null);
    } else {
      onCategorySelect(id);
    }
  };

  const handleBrandToggle = (name: string) => {
    if (onBrandsChange) {
      if (selectedBrands.includes(name)) {
        onBrandsChange(selectedBrands.filter(b => b !== name));
      } else {
        onBrandsChange([...selectedBrands, name]);
      }
    } else {
      // Legacy fallback
      if (selectedBrand === name) {
        onBrandSelect(null);
      } else {
        onBrandSelect(name);
      }
    }
  };

  const handleClearAll = () => {
    onCategorySelect(null);
    onBrandSelect(null);
    onRatingSelect(null);
    if (onBrandsChange) onBrandsChange([]);
    if (onPriceRangeChange) onPriceRangeChange([0, 250000]);
    if (onInStockOnlyChange) onInStockOnlyChange(false);
    if (onMinDiscountChange) onMinDiscountChange(0);
  };

  const handleRatingToggle = (rating: number) => {
    if (selectedRating === rating) {
      onRatingSelect(null);
    } else {
      onRatingSelect(rating);
    }
  };

  const hasAnyFilterActive = 
    !!selectedCategory || 
    !!selectedBrand || 
    selectedBrands.length > 0 || 
    selectedRating !== null || 
    priceRange[0] > 0 || 
    priceRange[1] < 250000 || 
    inStockOnly || 
    minDiscount > 0;

  const sidebarContent = (
    <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 shadow-sm font-sans text-left">
      
      {/* Header section with Reset */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Icons.SlidersHorizontal size={15} className="text-[#F85606]" />
          Filter Options
        </h3>
        {hasAnyFilterActive && (
          <button 
            onClick={handleClearAll}
            className="text-[11px] font-bold text-[#F85606] hover:underline cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="mb-6">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3">
          Categories
        </h4>
        
        {/* Scrollable list styled exactly like screenshot */}
        <div className="max-h-56 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id, cat.itemCount || 0);

            return (
              <label 
                key={cat.id}
                className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-[#F85606] checked:bg-[#F85606] transition-all focus:outline-none"
                    />
                    <Icons.Check 
                      size={12} 
                      className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
                    />
                  </div>
                  <span className={`truncate text-gray-700 transition-colors font-medium group-hover:text-[#F85606] ${isChecked ? 'text-[#F85606] font-extrabold' : ''}`}>
                    {cat.name}
                  </span>
                </div>
                
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${isChecked ? 'bg-orange-100 text-[#F85606]' : 'bg-gray-100 text-gray-500'}`}>
                  {count.toLocaleString()}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Brands Section */}
      <div className="mb-6 pt-5 border-t border-gray-100">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3">
          Brands
        </h4>
        
        <div className="max-h-48 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {dynamicBrands.map((brand) => {
            const isChecked = selectedBrands.includes(brand.name) || selectedBrand === brand.name;
            return (
              <label 
                key={brand.name}
                className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-[#F85606] checked:bg-[#F85606] transition-all focus:outline-none"
                    />
                    <Icons.Check 
                      size={12} 
                      className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
                    />
                  </div>
                  <span className={`truncate text-gray-700 transition-colors font-medium group-hover:text-[#F85606] ${isChecked ? 'text-[#F85606] font-extrabold' : ''}`}>
                    {brand.name}
                  </span>
                </div>
                
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${isChecked ? 'bg-orange-100 text-[#F85606]' : 'bg-gray-100 text-gray-500'}`}>
                  {brand.count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-6 pt-5 border-t border-gray-100">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3">
          Price Range (Rs.)
        </h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={priceRange[0]}
              min={0}
              max={priceRange[1]}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                if (onPriceRangeChange) onPriceRangeChange([val, priceRange[1]]);
              }}
              className="w-1/2 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606] font-semibold"
              placeholder="Min"
            />
            <span className="text-gray-400 text-xs font-bold">-</span>
            <input
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max={1000000}
              onChange={(e) => {
                const val = Math.max(0, parseInt(e.target.value) || 0);
                if (onPriceRangeChange) onPriceRangeChange([priceRange[0], val]);
              }}
              className="w-1/2 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#F85606] font-semibold"
              placeholder="Max"
            />
          </div>
          {/* Range input slider */}
          <input
            type="range"
            min="0"
            max="250000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => {
              const maxVal = parseInt(e.target.value) || 0;
              if (onPriceRangeChange) onPriceRangeChange([priceRange[0], maxVal]);
            }}
            className="w-full accent-[#F85606] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold">
            <span>Rs. 0</span>
            <span>Rs. 250k+</span>
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="mb-6 pt-5 border-t border-gray-100">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3.5">
          Availability
        </h4>
        <label className="flex items-center justify-between group cursor-pointer text-xs select-none">
          <span className="text-gray-700 font-medium group-hover:text-[#F85606] transition-colors">
            In Stock Only
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => {
                if (onInStockOnlyChange) onInStockOnlyChange(e.target.checked);
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F85606]" />
          </div>
        </label>
      </div>

      {/* Discount Percentage Section */}
      <div className="mb-6 pt-5 border-t border-gray-100">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3">
          Discount Percentage
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[10, 20, 30, 50].map((discountVal) => {
            const isChecked = minDiscount === discountVal;
            return (
              <button
                key={discountVal}
                type="button"
                onClick={() => {
                  if (onMinDiscountChange) {
                    onMinDiscountChange(isChecked ? 0 : discountVal);
                  }
                }}
                className={`p-2 text-xs rounded-xl border text-center transition-all cursor-pointer font-bold ${
                  isChecked 
                    ? 'border-[#F85606] bg-orange-50/50 text-[#F85606]' 
                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {discountVal}%+ Off
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Section */}
      <div className="pt-5 border-t border-gray-100">
        <h4 className="font-black text-xs text-gray-500 uppercase tracking-widest mb-3">
          Customer Rating
        </h4>
        
        <div className="space-y-2.5">
          {[5, 4, 3].map((ratingVal) => {
            const isChecked = selectedRating === ratingVal;
            return (
              <label 
                key={ratingVal}
                className="flex items-center justify-between group cursor-pointer text-xs select-none py-0.5"
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleRatingToggle(ratingVal)}
                      className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-[#F85606] checked:bg-[#F85606] transition-all focus:outline-none"
                    />
                    <Icons.Check 
                      size={12} 
                      className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" 
                    />
                  </div>
                  
                  {/* Stars display */}
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Icons.Star 
                        key={starIdx}
                        size={11}
                        className={starIdx < ratingVal ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                    <span className={`text-[11px] ml-1.5 font-medium transition-colors group-hover:text-[#F85606] ${isChecked ? 'text-[#F85606] font-extrabold' : 'text-gray-700'}`}>
                      {ratingVal === 5 ? '5 Stars' : `${ratingVal} Stars & Up`}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );

  if (onCloseMobile) {
    if (!isOpenMobile) return null;
    return (
      <div className="fixed inset-0 z-55 flex lg:hidden" id="mobile-filter-drawer-container">
        {/* Backdrop overlay */}
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />
        
        {/* Drawer Body */}
        <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10 animate-slide-in">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-black text-sm text-gray-900 uppercase tracking-wide">Filters</span>
            <button 
              onClick={onCloseMobile}
              className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
            >
              <Icons.X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {sidebarContent}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
            <button
              onClick={() => {
                handleClearAll();
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              Reset
            </button>
            <button
              onClick={onCloseMobile}
              className="flex-1 py-2.5 bg-[#F85606] hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center shadow-md shadow-orange-500/10"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="hidden lg:block w-72 shrink-0 self-start sticky top-24" id="desktop-filter-sidebar">
      {sidebarContent}
    </div>
  );
}
