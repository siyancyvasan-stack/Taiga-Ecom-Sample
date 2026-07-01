import React from 'react';
import { Product } from '../types';
import { Heart, Star } from 'lucide-react';
import { useCurrency } from '../lib/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isWishlisted: boolean;
  onWishlistToggle: (e: React.MouseEvent, p: Product) => void;
  key?: React.Key;
}

export default function ProductCard({ product, onClick, isWishlisted, onWishlistToggle }: ProductCardProps) {
  const { formatPrice } = useCurrency();

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group h-full font-sans"
      id={`product-card-${product.id}`}
    >
      
      {/* 1. Square Image Container */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Red discount badge top-left */}
        <div className="absolute top-2 left-2 bg-[#F85606] text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
          -{product.discount}%
        </div>

        {/* Wishlist heart icon top-right */}
        <button
          onClick={(e) => onWishlistToggle(e, product)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-[#F85606] p-1.5 rounded-full shadow transition-colors z-10 cursor-pointer"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          id={`wishlist-btn-${product.id}`}
        >
          <Heart size={14} className={isWishlisted ? 'fill-[#F85606]' : ''} />
        </button>
      </div>

      {/* 2. Card Metadata */}
      <div className="p-2.5 flex flex-col justify-between flex-grow">
        <div>
          {/* Title - max 2 lines truncated */}
          <h4 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight line-clamp-2 min-h-[32px] group-hover:text-[#F85606] transition-colors">
            {product.title}
          </h4>

          {/* Price segment */}
          <div className="mt-2 flex flex-wrap items-baseline gap-1">
            <span className="text-sm md:text-base font-black text-[#F85606]">
              {formatPrice(product.price)}
            </span>
            <span className="text-[10px] md:text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
        </div>

        {/* Ratings, counts, and sold counts below */}
        <div className="mt-2 border-t border-gray-50 pt-2 flex flex-col gap-1">
          {/* Yellow star rating + count */}
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              <Star size={12} className="fill-yellow-400" />
            </div>
            <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>

          {/* Sold count below */}
          <div className="text-[10px] text-gray-500 font-medium">
            {product.soldCount} sold
          </div>
        </div>

      </div>

    </div>
  );
}
