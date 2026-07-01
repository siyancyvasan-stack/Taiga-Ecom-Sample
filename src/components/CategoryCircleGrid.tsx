import { CATEGORY_ICONS_GRID } from '../data';
import * as Icons from 'lucide-react';

interface CategoryCircleGridProps {
  onCategorySelect: (id: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryCircleGrid({ onCategorySelect, selectedCategory }: CategoryCircleGridProps) {
  return (
    <div className="w-full my-6 font-sans" id="category-circle-grid">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-gray-900 font-extrabold text-sm md:text-base uppercase tracking-wider">
          Explore Popular Departments
        </h3>
        <span className="text-[10px] md:text-xs font-semibold text-[#F85606] hover:underline cursor-pointer">
          See All Departments &rsaquo;
        </span>
      </div>

      {/* Horizontally scrollable container on mobile, wrapped in a beautiful flexible layout on desktop */}
      <div className="flex overflow-x-auto pb-2.5 scrollbar-none md:flex md:flex-wrap md:justify-center gap-4 lg:gap-6">
        {CATEGORY_ICONS_GRID.map((item, index) => {
          // Dynamic Lucide component retrieval
          const IconComponent = (Icons as any)[item.icon] || Icons.ShoppingBag;
          const isSelected = selectedCategory === item.categoryId;

          return (
            <button
              key={index}
              onClick={() => onCategorySelect(item.categoryId)}
              className="flex flex-col items-center justify-center shrink-0 w-[84px] p-1 cursor-pointer focus:outline-none group transition-all"
              id={`cat-circle-${item.categoryId}`}
            >
              {/* Circle Wrapper */}
              <div 
                className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm relative ${isSelected ? 'bg-gradient-to-br from-[#F85606] to-[#FF6600] text-white scale-110 shadow-md ring-2 ring-orange-100' : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#F85606] group-hover:scale-105'}`}
              >
                <IconComponent size={22} />
                
                {/* Micro badge count overlay */}
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[8px] font-black px-1 py-0.5 rounded-full scale-90 leading-none shadow-sm">
                  {item.count >= 1000 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                </span>
              </div>

              {/* Title label */}
              <span className={`text-[11px] text-center font-extrabold mt-2.5 truncate w-full leading-tight ${isSelected ? 'text-[#F85606]' : 'text-gray-700 group-hover:text-[#F85606]'}`}>
                {item.name}
              </span>
              
              {/* Sub-label count */}
              <span className="text-[9px] text-gray-400 font-semibold mt-0.5 whitespace-nowrap">
                {item.count.toLocaleString()} items
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
