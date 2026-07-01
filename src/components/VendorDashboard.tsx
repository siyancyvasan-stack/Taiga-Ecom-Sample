import React, { useState } from 'react';
import { Product, Vendor, Review } from '../types';
import { 
  Plus, BarChart3, Package, MessageSquare, Star, ArrowUpRight, CheckCircle, 
  Trash2, HelpCircle 
} from 'lucide-react';
import { CATEGORIES } from '../data';

interface VendorDashboardProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function VendorDashboard({
  products,
  onAddProduct,
  onDeleteProduct
}: VendorDashboardProps) {
  // Current vendor details
  const currentVendor: Vendor = {
    id: 'v-samsung-sl',
    name: 'Samsung Authorized Retailer',
    ratingPercent: 96,
    responseTime: 'Within 2 hours'
  };

  // Vendor statistics
  const stats = {
    totalSales: 114900 * 3 + 7900 * 4, // LKR Rs. 376,300
    totalOrders: 7,
    productCount: products.filter(p => p.vendor.id === currentVendor.id).length,
    positiveRating: 96
  };

  // State controls
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'catalog'>('stats');

  // Add Product Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'electronics',
    subCategory: 'Smartphones',
    brand: 'Samsung',
    stock: '50',
    colors: 'Awesome Navy, Awesome White, Awesome Black',
    sizes: '128GB, 256GB',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
    spec1Key: 'Display',
    spec1Value: '120Hz Super AMOLED',
    spec2Key: 'RAM',
    spec2Value: '8GB'
  });

  const [formSuccess, setFormSuccess] = useState(false);

  // Filter vendor's own products
  const vendorProducts = products.filter(p => p.vendor.id === currentVendor.id || p.vendor.name === currentVendor.name);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) return;

    const priceNum = parseFloat(formData.price) || 1000;
    const origPriceNum = parseFloat(formData.originalPrice) || (priceNum * 1.2);
    const discountPercent = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);

    const newProd: Product = {
      id: `prod-user-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discountPercent > 0 ? discountPercent : 0,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0,
      images: [formData.image],
      category: formData.category,
      subCategory: formData.subCategory,
      brand: formData.brand,
      stock: parseInt(formData.stock) || 10,
      specifications: {
        [formData.spec1Key]: formData.spec1Value,
        [formData.spec2Key]: formData.spec2Value,
      },
      colors: formData.colors.split(',').map(s => s.trim()),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      vendor: currentVendor,
      reviews: [],
      qna: []
    };

    onAddProduct(newProd);
    setFormSuccess(true);
    
    // Clear product fields
    setFormData({
      title: '',
      description: '',
      price: '',
      originalPrice: '',
      category: 'electronics',
      subCategory: 'Smartphones',
      brand: 'Samsung',
      stock: '50',
      colors: 'Awesome Navy, Awesome White, Awesome Black',
      sizes: '128GB, 256GB',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
      spec1Key: 'Display',
      spec1Value: '120Hz Super AMOLED',
      spec2Key: 'RAM',
      spec2Value: '8GB'
    });

    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('catalog');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans bg-slate-50 rounded-xl" id="vendor-dashboard">
      
      {/* Dashboard Top Header */}
      <div className="bg-white border rounded-xl p-5 mb-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold bg-[#F85606] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
            Verified Partner Workspace
          </span>
          <h2 className="text-xl font-black text-gray-900 mt-1">{currentVendor.name}</h2>
          <p className="text-xs text-gray-500">Manage listings, analyze sales performance, and track delivery log fulfillment.</p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-bold text-gray-600 gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${activeTab === 'stats' ? 'bg-[#F85606] text-white shadow' : 'hover:bg-gray-200'}`}
          >
            <BarChart3 size={14} />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${activeTab === 'catalog' ? 'bg-[#F85606] text-white shadow' : 'hover:bg-gray-200'}`}
          >
            <Package size={14} />
            Catalog ({vendorProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${activeTab === 'add' ? 'bg-[#F85606] text-white shadow' : 'hover:bg-gray-200'}`}
          >
            <Plus size={14} />
            List Product
          </button>
        </div>
      </div>

      {/* Main Container switch */}

      {/* TAB 1: Analytics / stats */}
      {activeTab === 'stats' && (
        <div className="space-y-6" id="stats-tab">
          {/* Top metric row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Net Revenue</span>
                <span className="text-xl font-black text-gray-900 block mt-1">Rs. {stats.totalSales.toLocaleString()}</span>
                <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
                  <ArrowUpRight size={12} /> +12% this week
                </span>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-[#F85606] shrink-0">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Fulfillment Orders</span>
                <span className="text-xl font-black text-gray-900 block mt-1">{stats.totalOrders} Orders</span>
                <span className="text-[10px] text-orange-500 font-bold block mt-1">● 2 Pending Dispatch</span>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                <Package size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Active Catalog Listings</span>
                <span className="text-xl font-black text-gray-900 block mt-1">{stats.productCount} Products</span>
                <span className="text-[10px] text-gray-400 block mt-1">Across {CATEGORIES.length} departments</span>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                <Package size={20} />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Seller Rating Score</span>
                <span className="text-xl font-black text-green-600 block mt-1">{stats.positiveRating}% Positive</span>
                <span className="text-[10px] text-gray-400 block mt-1">Based on global checkout responses</span>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                <Star size={20} className="fill-green-600" />
              </div>
            </div>
          </div>

          {/* Graphical layout / Sales log */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales logs (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base mb-4 uppercase tracking-wider">Recent Settlement Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-500">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase">
                    <tr>
                      <th className="p-3">Order Code</th>
                      <th className="p-3">Item Details</th>
                      <th className="p-3">Total paid</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-gray-900">#ORD-94522</td>
                      <td className="p-3 text-gray-800">Samsung Galaxy A55 5G (Awesome Navy)</td>
                      <td className="p-3 font-bold text-gray-900">Rs. 114,900</td>
                      <td className="p-3">2026-06-29</td>
                      <td className="p-3 text-right">
                        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold">Paid Out</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">#ORD-10492</td>
                      <td className="p-3 text-gray-800">Baseus 20000mAh Power Bank (Matte Black)</td>
                      <td className="p-3 font-bold text-gray-900">Rs. 7,900</td>
                      <td className="p-3">2026-06-28</td>
                      <td className="p-3 text-right">
                        <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded font-bold">Paid Out</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-gray-900">#ORD-40511</td>
                      <td className="p-3 text-gray-800">Samsung Galaxy A55 5G (Awesome Iceblue)</td>
                      <td className="p-3 font-bold text-gray-900">Rs. 114,900</td>
                      <td className="p-3">2026-06-27</td>
                      <td className="p-3 text-right">
                        <span className="text-amber-600 bg-amber-100 px-2 py-0.5 rounded font-bold">Processing</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Support log metrics (1 col) */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base uppercase tracking-wider">Fulfillment Checklist</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="mt-0.5 cursor-pointer accent-[#F85606]" />
                  <div>
                    <span className="font-bold text-gray-800 block">Link Bank Account</span>
                    <span className="text-[10px] text-gray-400">Verifications complete for commercial payouts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <input type="checkbox" defaultChecked className="mt-0.5 cursor-pointer accent-[#F85606]" />
                  <div>
                    <span className="font-bold text-gray-800 block">Setup Western Courier API</span>
                    <span className="text-[10px] text-gray-400">Synchronized with local delivery agencies.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <input type="checkbox" className="mt-0.5 cursor-pointer accent-[#F85606]" />
                  <div>
                    <span className="font-bold text-gray-800 block">Launch Mega Sale campaign listings</span>
                    <span className="text-[10px] text-[#F85606] font-bold">Submit 2 items to the live flash sale pool.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: List Product */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 max-w-3xl mx-auto" id="add-product-form">
          <h3 className="font-extrabold text-gray-900 text-base md:text-lg mb-4 uppercase tracking-wider">List New Commercial Product</h3>
          
          {formSuccess && (
            <div className="bg-green-100 border border-green-200 text-green-700 text-xs font-bold p-3 rounded-lg mb-4 flex items-center gap-1.5 animate-bounce">
              <CheckCircle size={16} />
              Product Listing approved and catalog synchronization initiated! Redirecting...
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs text-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500">Product Title (Display name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Samsung Galaxy S24 Ultra - 512GB"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500">Department Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500">Product Description (Include highlights, warranty etc)</label>
              <textarea
                required
                rows={4}
                placeholder="Write detailed specifications..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500">Listing Price (Rs. LKR)</label>
                <input
                  type="number"
                  required
                  placeholder="LKR Rs."
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500">Original / Strike price</label>
                <input
                  type="number"
                  placeholder="LKR Rs."
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-500">Initial Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-500">Color Swatches (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Awesome Navy, Awesome Iceblue"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-500">Sizes / Config (Comma separated)</label>
                <input
                  type="text"
                  placeholder="128GB, 256GB, 512GB"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-500">Product Image URL (Unsplash/Web)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
              />
            </div>

            {/* Sub-Specifications */}
            <div className="border border-dashed border-gray-200 rounded-lg p-3">
              <label className="font-bold text-gray-500 block mb-2">Technical Specifications Matrix</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Specification Key (e.g. Memory)"
                  value={formData.spec1Key}
                  onChange={(e) => setFormData({ ...formData, spec1Key: e.target.value })}
                  className="border border-gray-200 rounded p-2 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. 12GB DDR5)"
                  value={formData.spec1Value}
                  onChange={(e) => setFormData({ ...formData, spec1Value: e.target.value })}
                  className="border border-gray-200 rounded p-2 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white font-black text-base py-3 rounded-lg transition-all shadow cursor-pointer hover:opacity-95"
              id="vendor-add-product-submit"
            >
              List Product Now
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Catalog manager */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5" id="catalog-tab">
          <h3 className="font-extrabold text-gray-900 text-base md:text-lg mb-4 uppercase tracking-wider">Your Registered Catalog Listings</h3>
          
          {vendorProducts.length === 0 ? (
            <p className="text-gray-500 text-xs">No active listings under your vendor ID. Create one above!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vendorProducts.map((p) => (
                <div key={p.id} className="border border-gray-100 rounded-lg p-3 relative flex flex-col justify-between hover:shadow transition-shadow">
                  <div>
                    <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded mb-2 bg-gray-50" referrerPolicy="no-referrer" />
                    <h4 className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">{p.title}</h4>
                    <span className="text-[#F85606] font-black text-xs block mt-1">Rs. {p.price.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Stock: {p.stock} | Sold: {p.soldCount}</span>
                  </div>

                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="mt-3 w-full border border-red-200 hover:bg-red-50 text-red-500 font-bold text-[11px] py-1.5 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
                    id={`delete-prod-${p.id}`}
                  >
                    <Trash2 size={12} />
                    Delete Listing
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
