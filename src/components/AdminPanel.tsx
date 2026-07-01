import { useState } from 'react';
import { Product, Vendor } from '../types';
import { Shield, Users, ShoppingCart, Ban, ToggleLeft, ToggleRight, Sparkles, Check, Trash } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onToggleListing: (id: string) => void;
  onBanVendor: (vendorId: string) => void;
  bannedVendors: string[];
}

export default function AdminPanel({
  products,
  onToggleListing,
  onBanVendor,
  bannedVendors
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'listings' | 'reports'>('users');

  // Simulated vendors list
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'v-samsung-sl', name: 'Samsung Authorized Retailer', ratingPercent: 96, responseTime: 'Within 2 hours' },
    { id: 'v-sportshub-sl', name: 'SportsHub Sri Lanka', ratingPercent: 92, responseTime: 'Within 4 hours' },
    { id: 'v-apple-store-sl', name: 'Apple Genius Lanka', ratingPercent: 98, responseTime: 'Within 1 hour' },
    { id: 'v-xiaomi-lanka', name: 'Xiaomi Sri Lanka Store', ratingPercent: 94, responseTime: 'Within 2 hours' },
    { id: 'v-unilever-lanka', name: 'Beauty & Co. Sri Lanka', ratingPercent: 91, responseTime: 'Within 3 hours' },
    { id: 'v-furniture-hq', name: 'Lanka Furniture Hub', ratingPercent: 88, responseTime: 'Within 5 hours' },
  ]);

  // Handle local Ban list simulation
  const handleBanToggle = (vendorId: string) => {
    onBanVendor(vendorId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans bg-slate-50 rounded-xl border border-gray-100 shadow-sm" id="admin-panel">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-bold bg-yellow-400 text-gray-950 px-2 py-0.5 rounded uppercase tracking-wider">
            Enterprise Operations Center
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-1.5 flex items-center gap-1.5">
            <Shield className="text-yellow-400" />
            Daraz.lk Admin Control Deck
          </h2>
          <p className="text-xs text-gray-300">Moderate product listings, verify sellers, and oversee checkout volumes.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-800 rounded-lg p-1 text-xs font-bold text-gray-400 gap-1 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeTab === 'users' ? 'bg-yellow-400 text-gray-950 font-black' : 'hover:text-white'}`}
          >
            Sellers ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${activeTab === 'listings' ? 'bg-yellow-400 text-gray-950 font-black' : 'hover:text-white'}`}
          >
            Listings ({products.length})
          </button>
        </div>
      </div>

      {/* Segment switcher */}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 overflow-x-auto" id="admin-users-tab">
          <h3 className="font-extrabold text-gray-900 text-sm md:text-base mb-4 uppercase tracking-wider">Vendor Verifications Hub</h3>
          <table className="w-full text-left text-xs text-gray-500">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
              <tr>
                <th className="p-3">Vendor ID</th>
                <th className="p-3">Store Name</th>
                <th className="p-3">Response Performance</th>
                <th className="p-3">Positive Ratings</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {vendors.map((v) => {
                const isBanned = bannedVendors.includes(v.id);
                return (
                  <tr key={v.id} className={isBanned ? 'bg-red-50/30' : 'bg-white'}>
                    <td className="p-3 font-mono font-bold text-gray-800">{v.id}</td>
                    <td className="p-3 font-bold text-gray-900">{v.name}</td>
                    <td className="p-3">{v.responseTime}</td>
                    <td className="p-3 text-green-600 font-bold">{v.ratingPercent}%</td>
                    <td className="p-3">
                      {isBanned ? (
                        <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded font-bold">Suspended</span>
                      ) : (
                        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold">Approved</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleBanToggle(v.id)}
                        className={`text-[10px] font-black px-2.5 py-1 rounded transition-colors cursor-pointer ${isBanned ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-100 hover:bg-red-200 text-red-600'}`}
                      >
                        {isBanned ? 'Reinstate' : 'Ban Seller'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 overflow-x-auto" id="admin-listings-tab">
          <h3 className="font-extrabold text-gray-900 text-sm md:text-base mb-4 uppercase tracking-wider">Catalog Listings Moderation</h3>
          <table className="w-full text-left text-xs text-gray-500">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {products.map((p) => {
                const isBannedVendor = bannedVendors.includes(p.vendor.id);
                return (
                  <tr key={p.id} className={isBannedVendor ? 'bg-red-50/30 opacity-60' : 'bg-white'}>
                    <td className="p-3 font-bold text-gray-900 max-w-xs truncate">{p.title}</td>
                    <td className="p-3 capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="p-3 text-gray-500">{p.vendor.name}</td>
                    <td className="p-3 font-bold text-[#F85606]">Rs. {p.price.toLocaleString()}</td>
                    <td className="p-3">{p.stock} units</td>
                    <td className="p-3 text-right">
                      {isBannedVendor ? (
                        <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded font-bold text-[10px]">BANNED SELLER</span>
                      ) : (
                        <button
                          onClick={() => onToggleListing(p.id)}
                          className="text-[#F85606] hover:underline font-bold text-[10px] uppercase"
                        >
                          De-activate / Archive
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
