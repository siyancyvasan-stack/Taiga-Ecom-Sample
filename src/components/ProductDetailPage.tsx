import React, { useState } from 'react';
import { Product, Review, QnA } from '../types';
import { 
  Star, Truck, ShieldCheck, ShoppingBag, MessageSquare, Plus, Minus, 
  Sparkles, Check, ChevronRight, Share2, HelpCircle
} from 'lucide-react';
import { useCurrency } from '../lib/CurrencyContext';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (p: Product, color: string, size: string, qty: number) => void;
  onBuyNow: (p: Product, color: string, size: string, qty: number) => void;
  onOpenChat: (vendorId: string, vendorName: string) => void;
  onBackToHome: () => void;
}

export default function ProductDetailPage({
  product,
  onAddToCart,
  onBuyNow,
  onOpenChat,
  onBackToHome
}: ProductDetailPageProps) {
  const { formatPrice, activeCurrency, t } = useCurrency();
  // Gallery state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: '0% 0%', transform: 'scale(1)' });

  // Custom configuration selections
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Default');
  const [quantity, setQuantity] = useState(1);

  // Seller follow status
  const [isSellerFollowed, setIsSellerFollowed] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'qna'>('desc');

  // Local state for reviews and Q&A to show real-time additions
  const [localReviews, setLocalReviews] = useState<Review[]>(product.reviews);
  const [localQna, setLocalQna] = useState<QnA[]>(product.qna);
  const [newQuestion, setNewQuestion] = useState('');
  const [isAiReviewGenerating, setIsAiReviewGenerating] = useState(false);

  // Image zoom handler on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  // AI Review Generator handler
  const handleGenerateAiReview = async () => {
    setIsAiReviewGenerating(true);
    try {
      const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
      const response = await fetch('/api/generate-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productTitle: product.title, rating: randomRating })
      });
      const data = await response.json();
      
      const newReview: Review = {
        id: `ai-rev-${Date.now()}`,
        userName: `Verified Buyer (AI-Assist)`,
        rating: randomRating,
        comment: data.comment || "Excellent purchase! The shipping to Sri Lanka was extremely quick and the item was perfectly packed.",
        date: new Date().toISOString().split('T')[0],
        verifiedPurchase: true
      };

      setLocalReviews([newReview, ...localReviews]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiReviewGenerating(false);
    }
  };

  // Q&A Question submission
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQ: QnA = {
      id: `qna-${Date.now()}`,
      question: newQuestion,
      askedBy: 'Guest Shopper',
      date: new Date().toISOString().split('T')[0],
      answer: 'Hi there! Thanks for your query. The vendor will reply within 2 hours. Feel free to initiate a live chat too!'
    };

    setLocalQna([newQ, ...localQna]);
    setNewQuestion('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans bg-gray-50/50 rounded-xl" id="product-detail-container">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-5">
        <button onClick={onBackToHome} className="hover:text-[#F85606] cursor-pointer">Daraz Home</button>
        <ChevronRight size={12} />
        <span className="capitalize text-gray-600">{product.category.replace('-', ' ')}</span>
        <ChevronRight size={12} />
        <span className="text-gray-900 font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      {/* Grid Layout (Left: Gallery, Right: Buy Info) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
        
        {/* Gallery Column (5 cols) */}
        <div className="col-span-1 md:col-span-5 flex flex-col md:flex-row gap-3">
          {/* Vertical Thumbnail Strip */}
          <div className="flex md:flex-col order-2 md:order-1 gap-2 overflow-x-auto md:overflow-y-auto max-h-[400px]">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`h-14 w-14 rounded-lg overflow-hidden border-2 shrink-0 bg-gray-50 transition-colors ${activeImageIdx === idx ? 'border-[#F85606]' : 'border-gray-100 hover:border-orange-200'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          {/* Main Display Image with hover-to-zoom (100% square aspect ratio) */}
          <div className="flex-1 order-1 md:order-2">
            <div 
              className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              id="main-image-zoom-box"
            >
              <img
                src={product.images[activeImageIdx]}
                alt="Main Product"
                style={zoomStyle}
                className="w-full h-full object-cover transition-transform duration-75"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                🔍 Hover to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Purchase Info Column (7 cols) */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Ratings, Sold count */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-800 ml-1">{product.rating}</span>
                <span className="text-gray-400">({localReviews.length} Ratings)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-bold">{product.soldCount} Items Sold</span>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 font-bold flex items-center gap-0.5">
                <ShieldCheck size={14} /> {t('officialStore')}
              </span>
            </div>
 
            {/* Price Segment */}
            <div className="bg-orange-50/50 p-4 rounded-xl my-4 border border-orange-100">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl md:text-3xl font-black text-[#F85606]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-[#F85606] text-white text-xs font-black px-2 py-0.5 rounded">
                  -{product.discount}% OFF
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Inclusive of VAT and localized processing fees in {activeCurrency.code}.</p>
            </div>

            {/* Color Swatches */}
            <div className="my-4">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">
                Color Options: <span className="text-gray-900 normal-case">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${selectedColor === col ? 'border-[#F85606] bg-orange-50 text-[#F85606] ring-1 ring-orange-200' : 'border-gray-200 bg-white hover:border-orange-300 text-gray-700'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Swatches */}
            <div className="my-4">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">
                Size / Specs: <span className="text-gray-900 normal-case">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${selectedSize === sz ? 'border-[#F85606] bg-orange-50 text-[#F85606] ring-1 ring-orange-200' : 'border-gray-200 bg-white hover:border-orange-300 text-gray-700'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="my-4 flex items-center space-x-3">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded hover:bg-white text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded hover:bg-white text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-400">({product.stock} items left)</span>
            </div>
          </div>

          {/* Shipping Estimates */}
          <div className="border border-gray-100 rounded-xl p-3 my-4 bg-gray-50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-gray-700">
              <Truck className="text-[#F85606]" size={16} />
              <div>
                <span className="font-bold block">Delivery to Western Province</span>
                <span className="text-[10px] text-gray-500">Arrives in 2 - 3 business days | Rs. 350 Standard Fee</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">
              FREE for orders over Rs. 3,000
            </span>
          </div>

          {/* Two Side-by-Side CTA Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => onAddToCart(product, selectedColor, selectedSize, quantity)}
              className="w-full border-2 border-[#F85606] text-[#F85606] hover:bg-orange-50 text-sm md:text-base font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              id="add-to-cart-detail-btn"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onBuyNow(product, selectedColor, selectedSize, quantity)}
              className="w-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white hover:opacity-95 text-sm md:text-base font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              id="buy-now-detail-btn"
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>

      {/* Seller info card */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 my-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-[#F85606] text-sm font-black uppercase">
            {product.vendor.name.slice(0, 2)}
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-gray-900">{product.vendor.name}</h4>
            <span className="text-[10px] text-gray-400">Response Rate: {product.vendor.responseTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-around flex-grow max-w-md w-full text-center border-y md:border-y-0 md:border-x border-gray-100 py-3 md:py-0">
          <div>
            <span className="text-sm md:text-lg font-black text-green-600">{product.vendor.ratingPercent}%</span>
            <span className="text-[10px] text-gray-400 block">Positive Seller Ratings</span>
          </div>
          <div>
            <span className="text-sm md:text-lg font-black text-blue-600">100%</span>
            <span className="text-[10px] text-gray-400 block">Ship on Time Rate</span>
          </div>
        </div>

        {/* Action Buttons (Chat & Follow) */}
        <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto">
          <button
            onClick={() => onOpenChat(product.vendor.id, product.vendor.name)}
            className="flex-1 md:flex-none border border-gray-300 hover:border-[#F85606] text-gray-700 hover:text-[#F85606] text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
            id="chat-seller-btn"
          >
            <MessageSquare size={14} />
            Chat Now
          </button>
          <button
            onClick={() => setIsSellerFollowed(!isSellerFollowed)}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2.5 rounded-lg transition-all cursor-pointer ${isSellerFollowed ? 'bg-gray-100 border border-gray-200 text-gray-500' : 'bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white shadow-sm hover:scale-105'}`}
            id="follow-seller-btn"
          >
            {isSellerFollowed ? 'Following' : '+ Follow Seller'}
          </button>
        </div>
      </div>

      {/* Tabbed Section (Description, Specifications, Reviews, Q&A) */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm my-6">
        
        {/* Navigation Tab Bar */}
        <div className="flex border-b border-gray-100 bg-gray-50 text-xs md:text-sm font-bold text-gray-500">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 border-b-2 hover:text-[#F85606] cursor-pointer ${activeTab === 'desc' ? 'border-[#F85606] text-[#F85606] bg-white' : 'border-transparent'}`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 border-b-2 hover:text-[#F85606] cursor-pointer ${activeTab === 'specs' ? 'border-[#F85606] text-[#F85606] bg-white' : 'border-transparent'}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 border-b-2 hover:text-[#F85606] cursor-pointer flex items-center gap-1 ${activeTab === 'reviews' ? 'border-[#F85606] text-[#F85606] bg-white' : 'border-transparent'}`}
          >
            Reviews ({localReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('qna')}
            className={`px-6 py-4 border-b-2 hover:text-[#F85606] cursor-pointer flex items-center gap-1 ${activeTab === 'qna' ? 'border-[#F85606] text-[#F85606] bg-white' : 'border-transparent'}`}
          >
            Q&A ({localQna.length})
          </button>
        </div>

        {/* Active Tab Panel */}
        <div className="p-4 md:p-6 text-sm text-gray-700 leading-relaxed min-h-[250px]">
          
          {/* Tab 1: Description */}
          {activeTab === 'desc' && (
            <div className="space-y-4" id="desc-tab-panel">
              <h3 className="font-extrabold text-gray-900 text-base mb-2">Detailed Product Overview</h3>
              <p>{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-orange-50/20 p-4 rounded-lg border border-orange-100">
                  <h4 className="font-bold text-[#F85606] mb-2 flex items-center gap-1">✨ Special Deals & Warranty</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>100% Genuine and authentic global supply pipeline.</li>
                    <li>Sourced directly from certified brand partners in Colombo.</li>
                    <li>Eligible for quick local returns within 7 business days.</li>
                  </ul>
                </div>
                <div className="bg-green-50/20 p-4 rounded-lg border border-green-100">
                  <h4 className="font-bold text-green-700 mb-2 flex items-center gap-1">🚚 Smart Logistics & Courier</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li>Secure localized cash-on-delivery tracking is active.</li>
                    <li>Tamper-proof package cushioning included.</li>
                    <li>Express delivery available to Colombo & Outer suburbs.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specs' && (
            <div id="specs-tab-panel">
              <h3 className="font-extrabold text-gray-900 text-base mb-4">Technical Specifications</h3>
              <div className="border border-gray-100 rounded-lg overflow-hidden max-w-2xl bg-white">
                {Object.entries(product.specifications).map(([key, value], idx) => (
                  <div key={key} className={`grid grid-cols-3 p-3 border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                    <span className="font-extrabold text-xs text-gray-500 uppercase col-span-1">{key}</span>
                    <span className="text-xs text-gray-800 font-semibold col-span-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6" id="reviews-tab-panel">
              
              {/* Review Header with AI Review Generator block */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-orange-50/40 p-4 rounded-xl border border-orange-100/60 gap-4 mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm md:text-base flex items-center gap-1.5">
                    Customer Experience Reviews
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Read real customer feedback or try our smart AI review simulator.</p>
                </div>
                <button
                  onClick={handleGenerateAiReview}
                  disabled={isAiReviewGenerating}
                  className="bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white hover:opacity-95 disabled:opacity-50 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  id="ai-generate-review-btn"
                >
                  <Sparkles size={14} className={isAiReviewGenerating ? 'animate-spin' : ''} />
                  {isAiReviewGenerating ? 'Writing review...' : 'Generate AI Review with Gemini'}
                </button>
              </div>

              {/* Review Items list */}
              {localReviews.length === 0 ? (
                <p className="text-gray-500 text-xs">No reviews listed yet. Be the first to add or generate!</p>
              ) : (
                <div className="space-y-4 divide-y divide-gray-100">
                  {localReviews.map((rev) => (
                    <div key={rev.id} className="pt-4 first:pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-gray-800">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-green-600 bg-green-100 px-1.5 py-0.2 rounded font-black uppercase">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400">{rev.date}</span>
                      </div>

                      {/* Stars */}
                      <div className="flex text-yellow-400 my-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} 
                          />
                        ))}
                      </div>

                      {/* Review Comment Text */}
                      <p className="text-xs text-gray-600 mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Q&A */}
          {activeTab === 'qna' && (
            <div className="space-y-6" id="qna-tab-panel">
              <h3 className="font-extrabold text-gray-900 text-base mb-2">Customer Questions & Answers</h3>

              {/* Ask Question Form */}
              <form onSubmit={handleAskQuestion} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about size, warranty, or delivery..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                  id="new-question-input"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:opacity-95 transition-all shadow shrink-0 cursor-pointer"
                  id="ask-q-submit-btn"
                >
                  Ask Question
                </button>
              </form>

              {/* Q&A List */}
              {localQna.length === 0 ? (
                <p className="text-gray-500 text-xs mt-3">No questions asked yet. Ask yours above!</p>
              ) : (
                <div className="space-y-5 divide-y divide-gray-100 mt-4">
                  {localQna.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0">
                      <div className="flex items-start space-x-2">
                        <span className="bg-orange-100 text-[#F85606] text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0">Q</span>
                        <div>
                          <p className="text-xs font-bold text-gray-800">{item.question}</p>
                          <span className="text-[9px] text-gray-400">Asked by {item.askedBy} on {item.date}</span>
                        </div>
                      </div>

                      {item.answer && (
                        <div className="flex items-start space-x-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="bg-green-100 text-green-700 text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shrink-0">A</span>
                          <div>
                            <p className="text-xs text-gray-600 font-medium">{item.answer}</p>
                            <span className="text-[9px] text-gray-400">Answered by Store Specialist</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
