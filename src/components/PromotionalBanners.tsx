import { PROMO_BANNERS_2COL, PROMO_BANNERS_3COL } from '../data';

interface PromotionalBannersProps {
  onCategorySelect: (catId: string | null) => void;
}

export default function PromotionalBanners({ onCategorySelect }: PromotionalBannersProps) {
  return (
    <div className="w-full my-6 font-sans space-y-6" id="promotional-banners">
      
      {/* 1. Two-Column Promos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROMO_BANNERS_2COL.map((b, idx) => (
          <div 
            key={idx}
            onClick={() => onCategorySelect(b.categoryId)}
            className="relative h-44 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
          >
            <img 
              src={b.image} 
              alt={b.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient visual layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent p-5 flex flex-col justify-center text-white">
              <span className="text-[9px] font-bold bg-[#F85606] px-1.5 py-0.5 rounded w-max mb-1 uppercase tracking-wider">
                Mega Campaign
              </span>
              <h4 className="text-lg md:text-xl font-black uppercase tracking-tight">{b.title}</h4>
              <p className="text-yellow-300 text-xs font-semibold mt-1">{b.subtitle}</p>
              <span className="mt-3 text-[10px] font-bold bg-white text-gray-900 px-3 py-1 rounded-full w-max group-hover:bg-[#F85606] group-hover:text-white transition-colors uppercase">
                Collect Offer
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Three-Column Promos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROMO_BANNERS_3COL.map((b, idx) => (
          <div 
            key={idx}
            onClick={() => onCategorySelect(b.categoryId)}
            className="relative h-36 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
          >
            <img 
              src={b.image} 
              alt={b.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/50 hover:bg-black/45 transition-colors p-4 flex flex-col justify-between text-white">
              <span className="text-[8px] font-bold bg-yellow-400 text-gray-950 px-1.5 py-0.5 rounded w-max uppercase">
                {b.tag}
              </span>
              <div>
                <h5 className="text-sm md:text-base font-black tracking-wide uppercase">{b.title}</h5>
                <span className="text-[10px] font-medium text-orange-200 group-hover:text-white transition-colors flex items-center gap-0.5 mt-0.5">
                  Shop Now &rsaquo;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
