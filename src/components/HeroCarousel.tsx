import { useState, useEffect } from 'react';
import { MOCK_CAROUSEL_IMAGES } from '../data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_CAROUSEL_IMAGES.length) % MOCK_CAROUSEL_IMAGES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_CAROUSEL_IMAGES.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 group aspect-[3/1] md:aspect-[2.8/1] lg:aspect-[3/1]" id="hero-carousel">
      {/* Slides */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {MOCK_CAROUSEL_IMAGES.map((img, i) => (
          <div key={i} className="min-w-full h-full relative shrink-0">
            <img 
              src={img.url} 
              alt={img.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* High-saturation deal visual overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-8">
              <span className="text-[10px] md:text-xs font-bold bg-[#F85606] text-white px-2 py-0.5 rounded w-max mb-1 md:mb-2 animate-pulse uppercase tracking-wider">
                Limited Time Deals
              </span>
              <h2 className="text-white text-base md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
                {img.title}
              </h2>
              <p className="text-yellow-400 text-xs md:text-base font-medium mt-1 drop-shadow">
                {img.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Navigation Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#F85606] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        id="prev-carousel-btn"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#F85606] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        id="next-carousel-btn"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-3 left-1/2 -translate-y-1/2 flex space-x-2">
        {MOCK_CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${currentIndex === i ? 'bg-[#F85606] w-6' : 'bg-white/60 w-2.5'}`}
            id={`indicator-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
