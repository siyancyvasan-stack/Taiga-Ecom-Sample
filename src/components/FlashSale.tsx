import { useState, useEffect } from 'react';
import { Product } from '../types';
import { Flame } from 'lucide-react';
import { useCurrency } from '../lib/CurrencyContext';

interface FlashSaleProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FlashSale({ products, onProductClick }: FlashSaleProps) {
  const { formatPrice, t } = useCurrency();
  // 1. Live Countdown Timer State (HH:MM:SS)
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset to 4 hours to keep the preview active
          return { hours: 4, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format numbers to have leading zero
  const pad = (num: number) => num.toString().padStart(2, '0');

  // Select 4-5 products with high discounts for the flash sale
  const flashProducts = products.filter(p => p.discount >= 15).slice(0, 5);

  // Simulated claim percentages mapping product ID to percentage
  const claimRates: Record<string, number> = {
    'prod-002': 85, // Nike shoe (85% claimed)
    'prod-004': 72, // Redmi (72% claimed)
    'prod-005': 94, // Loreal (94% claimed - HOT!)
    'prod-007': 40, // Chair (40% claimed)
  };

  return (
    <div className="w-full bg-[#f85606] rounded-xl overflow-hidden shadow-lg p-4 my-6 text-white font-sans animate-fade-in" id="flash-sale-section">
      {/* Flash Sale Header with Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/20 gap-3">
        <div className="flex items-center space-x-2">
          <Flame className="text-yellow-300 animate-bounce shrink-0" size={24} />
          <h2 className="text-xl md:text-2xl font-black tracking-wider uppercase italic">
            {t('flashSale')}
          </h2>
          <span className="bg-yellow-400 text-gray-950 text-[10px] md:text-xs font-black px-2 py-0.5 rounded leading-none uppercase tracking-wide">
            {t('hotDeals')}
          </span>
        </div>

        {/* Live Countdown boxes */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-orange-100 uppercase tracking-widest mr-1">On Air:</span>
          <div className="flex space-x-1 font-mono text-sm font-black text-white">
            <div className="bg-gray-950 px-2 py-1 rounded shadow">{pad(timeLeft.hours)}</div>
            <span className="text-yellow-300 font-bold self-center">:</span>
            <div className="bg-gray-950 px-2 py-1 rounded shadow">{pad(timeLeft.minutes)}</div>
            <span className="text-yellow-300 font-bold self-center">:</span>
            <div className="bg-gray-950 px-2 py-1 rounded shadow">{pad(timeLeft.seconds)}</div>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container for Flash Products */}
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-white/20">
        {flashProducts.map((p) => {
          const claimedPercent = claimRates[p.id] || 60;
          return (
            <div
              key={p.id}
              onClick={() => onProductClick(p)}
              className="flex-shrink-0 w-44 bg-white text-gray-800 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] flex flex-col justify-between"
              id={`flash-product-card-${p.id}`}
            >
              {/* Product Image section with Discount Tag */}
              <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Red Discount badge top-left */}
                <div className="absolute top-1.5 left-1.5 bg-[#F85606] text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                  -{p.discount}% OFF
                </div>

                {claimedPercent >= 90 && (
                  <div className="absolute top-1.5 right-1.5 bg-yellow-400 text-gray-950 text-[8px] font-black px-1 py-0.5 rounded uppercase">
                    Selling Fast
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[32px] leading-tight hover:text-[#F85606] transition-colors">
                    {p.title}
                  </h3>

                  {/* Pricing segment */}
                  <div className="mt-2 flex flex-wrap items-baseline gap-1">
                    <span className="text-sm font-black text-[#F85606]">
                      {formatPrice(p.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatPrice(p.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* % Claimed Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold mb-1">
                    <span>{claimedPercent}% claimed</span>
                    <span className={claimedPercent >= 80 ? 'text-red-600' : 'text-gray-500'}>
                      {p.stock} left
                    </span>
                  </div>
                  
                  {/* Progress bar line */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${claimedPercent >= 80 ? 'bg-gradient-to-r from-red-500 to-[#F85606]' : 'bg-orange-500'}`}
                      style={{ width: `${claimedPercent}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
