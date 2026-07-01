import { BRANDS } from '../data';

interface TopBrandsProps {
  onBrandSelect: (brandName: string | null) => void;
  selectedBrand: string | null;
}

export default function TopBrands({ onBrandSelect, selectedBrand }: TopBrandsProps) {
  return (
    <div className="w-full my-6 font-sans" id="top-brands">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-gray-900 font-extrabold text-sm md:text-base uppercase tracking-wider">
          Top Brand Partnerships
        </h3>
        <span className="text-[10px] md:text-xs font-semibold text-[#F85606] hover:underline cursor-pointer">
          Official Store Channel &rsaquo;
        </span>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {BRANDS.map((b) => {
          const isSelected = selectedBrand === b.name;
          return (
            <button
              key={b.id}
              onClick={() => onBrandSelect(isSelected ? null : b.name)}
              className={`p-2 bg-white rounded-lg border hover:border-[#F85606] hover:shadow-md transition-all flex flex-col items-center justify-center cursor-pointer group ${isSelected ? 'border-[#F85606] ring-2 ring-orange-100' : 'border-gray-100'}`}
              id={`brand-${b.id}`}
            >
              {/* Logo space */}
              <div className="h-10 w-full overflow-hidden flex items-center justify-center rounded">
                <img
                  src={b.logo}
                  alt={b.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Brand Name */}
              <span className={`text-[10px] font-black mt-1.5 text-center truncate w-full ${isSelected ? 'text-[#F85606]' : 'text-gray-500 group-hover:text-[#F85606]'}`}>
                {b.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
