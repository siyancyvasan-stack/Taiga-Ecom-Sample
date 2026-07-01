import { Home, Grid, ShoppingCart, Bell, User } from 'lucide-react';

interface MobileNavBarProps {
  activeView: string;
  onViewChange: (view: 'home' | 'cart' | 'dashboard' | 'admin' | 'wishlist' | 'account') => void;
  cartCount: number;
}

export default function MobileNavBar({ activeView, onViewChange, cartCount }: MobileNavBarProps) {
  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] font-sans"
      id="mobile-bottom-nav"
    >
      {/* 1. Home button */}
      <button
        onClick={() => onViewChange('home')}
        className={`flex flex-col items-center justify-center w-12 cursor-pointer ${activeView === 'home' ? 'text-[#F85606]' : 'text-gray-400 hover:text-gray-600'}`}
        id="mobile-nav-home"
      >
        <Home size={20} className={activeView === 'home' ? 'stroke-[2.5px]' : ''} />
        <span className="text-[9px] font-bold mt-1">Home</span>
      </button>

      {/* 2. Categories department explorer shortcut */}
      <button
        onClick={() => onViewChange('home')}
        className={`flex flex-col items-center justify-center w-12 cursor-pointer ${activeView === 'categories' ? 'text-[#F85606]' : 'text-gray-400 hover:text-gray-600'}`}
        id="mobile-nav-categories"
      >
        <Grid size={20} />
        <span className="text-[9px] font-bold mt-1">Categories</span>
      </button>

      {/* 3. Cart with badge */}
      <button
        onClick={() => onViewChange('cart')}
        className={`flex flex-col items-center justify-center w-12 relative cursor-pointer ${activeView === 'cart' ? 'text-[#F85606]' : 'text-gray-400 hover:text-gray-600'}`}
        id="mobile-nav-cart"
      >
        <ShoppingCart size={20} className={activeView === 'cart' ? 'stroke-[2.5px]' : ''} />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-2 bg-[#F85606] text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white animate-bounce">
            {cartCount}
          </span>
        )}
        <span className="text-[9px] font-bold mt-1">Cart</span>
      </button>

      {/* 4. Notifications */}
      <button
        onClick={() => onViewChange('account')}
        className={`flex flex-col items-center justify-center w-12 cursor-pointer ${activeView === 'notifications' ? 'text-[#F85606]' : 'text-gray-400 hover:text-gray-600'}`}
        id="mobile-nav-notifications"
      >
        <div className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0.5 h-1.5 w-1.5 rounded-full bg-[#F85606] inline-block" />
        </div>
        <span className="text-[9px] font-bold mt-1">Inbox</span>
      </button>

      {/* 5. Account */}
      <button
        onClick={() => onViewChange('account')}
        className={`flex flex-col items-center justify-center w-12 cursor-pointer ${activeView === 'account' ? 'text-[#F85606]' : 'text-gray-400 hover:text-gray-600'}`}
        id="mobile-nav-account"
      >
        <User size={20} className={activeView === 'account' ? 'stroke-[2.5px]' : ''} />
        <span className="text-[9px] font-bold mt-1">Account</span>
      </button>
    </div>
  );
}
