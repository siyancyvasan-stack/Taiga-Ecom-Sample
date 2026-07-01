import { HelpCircle, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 font-sans mt-12 pb-20 md:pb-8" id="daraz-footer">
      {/* 1. Trust badge strips */}
      <div className="bg-gray-50 border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-800 block uppercase tracking-wider">100% Authentic Products</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Sourced from verified local manufacturers.</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-800 block uppercase tracking-wider">Colombo Express Delivery</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Prompt island-wide dispatch services.</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-800 block uppercase tracking-wider">7-Day Local Returns</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Hassle-free moneyback assurances.</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <span className="text-xs font-black text-gray-800 block uppercase tracking-wider">TRCSL Registered Devices</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Approved items with official coverage.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Text layout section */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-500">
        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-1.5">
            <li className="hover:text-[#F85606] cursor-pointer">Help Center & Support</li>
            <li className="hover:text-[#F85606] cursor-pointer">How to Buy on Taiga</li>
            <li className="hover:text-[#F85606] cursor-pointer">Track Your Package</li>
            <li className="hover:text-[#F85606] cursor-pointer">Corporate Bulk Ordering</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider">Become a Seller</h4>
          <ul className="space-y-1.5">
            <li className="hover:text-[#F85606] cursor-pointer">Register Your Local Store</li>
            <li className="hover:text-[#F85606] cursor-pointer">Fulfillment by Taiga</li>
            <li className="hover:text-[#F85606] cursor-pointer">Advertising & Promotion Services</li>
            <li className="hover:text-[#F85606] cursor-pointer">Policies & Seller Manuals</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider">Taiga Sri Lanka</h4>
          <ul className="space-y-1.5">
            <li className="hover:text-[#F85606] cursor-pointer">About Taiga Group</li>
            <li className="hover:text-[#F85606] cursor-pointer">Careers at Taiga</li>
            <li className="hover:text-[#F85606] cursor-pointer">Terms & User Agreement</li>
            <li className="hover:text-[#F85606] cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-extrabold text-gray-800 text-xs uppercase tracking-wider">Payment Partners</h4>
          <p className="text-[10px] leading-relaxed">
            We support Visa, Mastercard, AMEX, Cash on Delivery (COD), and secure localized bank transfers in Sri Lankan Rupee.
          </p>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
            © 2026 Taiga Sri Lanka. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
