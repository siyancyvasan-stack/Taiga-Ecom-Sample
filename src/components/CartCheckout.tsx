import React, { useState, useEffect } from 'react';
import { CartItem, Voucher, ShippingAddress, Order } from '../types';
import { 
  Trash2, Plus, Minus, Ticket, CreditCard, ShoppingBag, Truck, Check 
} from 'lucide-react';
import { useCurrency } from '../lib/CurrencyContext';

interface CartCheckoutProps {
  cartItems: CartItem[];
  onUpdateQty: (cartId: string, diff: number) => void;
  onRemoveItem: (cartId: string) => void;
  collectedVouchers: Voucher[];
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
  onBackToShopping: () => void;
  currentUser?: { name: string; role: 'user' | 'vendor' | 'admin'; emailOrPhone?: string } | null;
}

export default function CartCheckout({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  collectedVouchers,
  onPlaceOrder,
  onClearCart,
  onBackToShopping,
  currentUser
}: CartCheckoutProps) {
  const { formatPrice, t } = useCurrency();
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [couponError, setCouponError] = useState('');

  // Shipping details state
  const [address, setAddress] = useState<ShippingAddress>({
    name: currentUser?.name || 'Suresh Perera',
    phone: currentUser?.emailOrPhone || '0771234567',
    address: 'No. 45, Galle Road, Bambalapitiya',
    city: 'Colombo 03'
  });

  // Sync address if current user details change
  useEffect(() => {
    if (currentUser) {
      setAddress(prev => ({
        ...prev,
        name: currentUser.name,
        phone: currentUser.emailOrPhone || prev.phone
      }));
    }
  }, [currentUser]);

  // Payment choice
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Post checkout trigger success
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Compute Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Shipping calculation (Rs. 350 flat rate, free over Rs. 3,000)
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 3000 ? 0 : 350;

  // Discount calculation
  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  
  // Grand total
  const grandTotal = Math.max(0, subtotal + shippingFee - voucherDiscount);

  // Apply code manually
  const handleApplyCode = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Check if voucher exists and is collected
    const foundVoucher = collectedVouchers.find(v => v.code === code);
    if (!foundVoucher) {
      setCouponError('Invalid voucher code. Collect vouchers first on the home page!');
      return;
    }

    if (subtotal < foundVoucher.minSpend) {
      setCouponError(`Min. spend of ${formatPrice(foundVoucher.minSpend)} required for this coupon.`);
      return;
    }

    setAppliedVoucher(foundVoucher);
    setCouponCode('');
  };

  // Select collected coupon directly
  const handleApplyCollectedVoucher = (v: Voucher) => {
    setCouponError('');
    if (subtotal < v.minSpend) {
      setCouponError(`Min. spend of ${formatPrice(v.minSpend)} required for ${formatPrice(v.discountAmount)} off.`);
      return;
    }
    setAppliedVoucher(v);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!address.name || !address.phone || !address.address || !address.city) {
      alert('Please fill in all shipping details!');
      return;
    }

    const orderObj: Order = {
      id: `ORDER-${Math.floor(Math.random() * 900000) + 100000}`,
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        color: item.selectedColor,
        size: item.selectedSize
      })),
      totalAmount: grandTotal,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      shippingAddress: address,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (LKR)' : 'Credit/Debit Card'
    };

    onPlaceOrder(orderObj);
    setOrderSuccess(orderObj);
    onClearCart();
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white border border-green-200 rounded-xl shadow-lg p-6 my-10 text-center font-sans">
        <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={36} className="animate-bounce" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Order Placed Successfully!</h2>
        <p className="text-xs text-gray-500 mt-1">Thank you for shopping on Market Treats Hub. Your order code is:</p>
        <span className="inline-block mt-2 bg-gray-100 border px-3 py-1 font-mono font-bold rounded text-[#F85606] text-sm">
          {orderSuccess.id}
        </span>

        {/* Dispatch message */}
        <div className="bg-orange-50/50 rounded-lg p-3 text-left border border-orange-100 my-4 text-xs">
          <span className="font-bold text-gray-800 block">🚚 Colombo Express Dispatch Active</span>
          <span className="text-gray-500 block mt-0.5">Deliverable to: <b>{orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</b></span>
          <span className="text-gray-500 block">Total paid: <b>{formatPrice(orderSuccess.totalAmount)}</b> via {orderSuccess.paymentMethod}</span>
        </div>

        <button
          onClick={() => {
            setOrderSuccess(null);
            onBackToShopping();
          }}
          className="w-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white font-bold py-2.5 rounded-lg hover:opacity-95 transition-all shadow cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans" id="cart-checkout-page">
      <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-6 uppercase tracking-wider flex items-center gap-1.5">
        <ShoppingBag className="text-[#F85606]" />
        Your Shopping Cart & Checkout
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm max-w-lg mx-auto">
          <span className="text-5xl block mb-4">🛒</span>
          <h3 className="text-lg font-bold text-gray-800">Your shopping cart is empty!</h3>
          <p className="text-xs text-gray-400 mt-1">Explore our hot flash sales and claim your vouchers today.</p>
          <button
            onClick={onBackToShopping}
            className="mt-5 bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:opacity-95 transition-all shadow cursor-pointer"
          >
            Go to Deals page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Columns (8 cols): Cart items list + Shipping Details Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cart Items List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="border-b border-gray-100 pb-3 mb-4 flex justify-between items-center">
                <span className="font-extrabold text-sm text-gray-800">Selected Items ({cartItems.length})</span>
                <span className="text-[10px] text-gray-400">Prices are synchronized in LKR Rs.</span>
              </div>

              <div className="space-y-4 divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-16 bg-gray-50 border rounded-lg overflow-hidden shrink-0">
                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-gray-900 line-clamp-2 max-w-md">{item.product.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="bg-orange-50 border border-orange-100 text-[#F85606] text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Color: {item.selectedColor}
                          </span>
                          <span className="bg-gray-100 border text-gray-600 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            Size: {item.selectedSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-19 sm:pl-0">
                      {/* Price info */}
                      <div className="text-right">
                        <span className="font-black text-sm text-[#F85606] block">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 block">{formatPrice(item.product.price)} each</span>
                        )}
                      </div>

                      {/* Qty increment */}
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 border border-gray-200 shrink-0">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="p-1 rounded hover:bg-white text-gray-600 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="p-1 rounded hover:bg-white text-gray-600 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Trash */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery / Shipping details Form */}
            <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
              <h3 className="font-extrabold text-gray-900 text-sm md:text-base flex items-center gap-1">
                <Truck className="text-[#F85606]" size={18} />
                Shipping & Delivery Address (Sri Lanka Delivery)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-bold block">Recipient Name</label>
                  <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    required
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 font-bold block">Contact Mobile Number</label>
                  <input
                    type="text"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-bold block">Street Address / Block Number</label>
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  required
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 font-bold block">City / Province</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                />
              </div>

              {/* Payment selection segment */}
              <div className="border-t border-gray-100 pt-4 mt-2">
                <label className="text-xs text-gray-500 font-bold block mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#F85606] bg-orange-50/20' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Cash on Delivery</span>
                      <span className="text-[10px] text-gray-400">Pay {formatPrice(grandTotal)} on arrival</span>
                    </div>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#F85606] text-white border-transparent' : 'border-gray-300'}`}>
                      {paymentMethod === 'cod' && <Check size={10} />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#F85606] bg-orange-50/20' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">Credit / Debit Card</span>
                      <span className="text-[10px] text-gray-400">Secure online checkouts</span>
                    </div>
                    <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'bg-[#F85606] text-white border-transparent' : 'border-gray-300'}`}>
                      {paymentMethod === 'card' && <Check size={10} />}
                    </div>
                  </button>
                </div>

                {/* Card input display fields when card payment is selected */}
                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-3 animate-fade-in">
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold block">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#F85606] bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold block">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#F85606] bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold block">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#F85606] bg-white"
                      />
                    </div>
                    <div className="col-span-1 flex items-end">
                      <div className="text-[10px] text-gray-400 flex items-center gap-1 pb-2">
                        <CreditCard size={12} /> Secure
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Place Order CTA trigger button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white font-extrabold text-base py-3.5 rounded-xl transition-all shadow-md cursor-pointer hover:opacity-95"
                id="place-order-submit-btn"
              >
                Place Order ({formatPrice(grandTotal)})
              </button>
            </form>

          </div>

          {/* Right Column (4 cols): Voucher application panel + Order Summary box */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Voucher apply box */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-extrabold text-gray-900 text-xs md:text-sm flex items-center gap-1 mb-3">
                <Ticket className="text-[#F85606]" size={16} />
                Apply Coupons / Vouchers
              </h3>

              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606]"
                  id="promo-code-input"
                />
                <button
                  type="button"
                  onClick={handleApplyCode}
                  className="bg-gray-800 text-white hover:bg-black text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  id="promo-apply-btn"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[10px] text-red-500 font-bold mt-1.5">{couponError}</p>
              )}

              {appliedVoucher && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-green-700 block">Voucher Applied: {appliedVoucher.code}</span>
                    <span className="text-[10px] text-green-600 block">{formatPrice(appliedVoucher.discountAmount)} Off saving active!</span>
                  </div>
                  <button
                    onClick={() => setAppliedVoucher(null)}
                    className="text-gray-400 hover:text-red-500 text-[10px] font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* List of Collected but unused vouchers for easy tap and apply! */}
              {collectedVouchers.length > 0 && (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <span className="text-[10px] font-bold text-gray-500 block mb-2 uppercase tracking-wider">Your Collected Vouchers (Tap to apply)</span>
                  <div className="space-y-1.5">
                    {collectedVouchers.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleApplyCollectedVoucher(v)}
                        disabled={appliedVoucher?.id === v.id}
                        className={`w-full text-left p-2 rounded-lg border text-xs flex justify-between items-center cursor-pointer transition-colors ${appliedVoucher?.id === v.id ? 'bg-green-50/50 border-green-200 text-green-700 font-bold' : 'border-gray-100 bg-gray-50/50 hover:bg-orange-50/50 hover:border-orange-200'}`}
                      >
                        <div>
                          <span className="font-bold block text-gray-800">{formatPrice(v.discountAmount)} OFF</span>
                          <span className="text-[9px] text-gray-400 block">Min spend {formatPrice(v.minSpend)}</span>
                        </div>
                        <span className="text-[9px] text-[#F85606] font-extrabold uppercase bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">
                          {v.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Summary box */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-xs">
              <h3 className="font-extrabold text-gray-900 text-sm mb-3 uppercase tracking-wider">Order Summary</h3>
              
              <div className="space-y-2 pb-3 border-b border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-bold text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className="font-bold text-gray-800">
                    {shippingFee === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Voucher Discount</span>
                    <span>-{formatPrice(voucherDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-3">
                <span className="text-sm font-black text-gray-900">Total Price</span>
                <span className="text-xl font-black text-[#F85606]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 text-right mt-1">Inclusive of Western Province courier duties</p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
