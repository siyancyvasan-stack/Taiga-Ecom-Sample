import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, HelpCircle, Gift, RefreshCw, CheckCircle, Flame, X, Coins, MessageSquare, Heart, Eye, ArrowRight, Star, Clock } from 'lucide-react';
import { Voucher } from '../types';
import { useCurrency } from '../lib/CurrencyContext';

interface SpinGameProps {
  onCollectVoucher: (voucherId: string) => void;
  onAddCustomVoucher: (voucher: Voucher) => void;
  vouchers: Voucher[];
  gems: number;
  onAddGems: (amount: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

interface PrizeSlice {
  label: string;
  color: string;
  type: 'discount' | 'shipping' | 'gems' | 'try_again';
  value?: number; // percentage, Rs. off, or gems amount
  code?: string;
}

// Exactly matching the slices from the user's uploaded "Daily Spin & Win" screenshot
const PRIZES: PrizeSlice[] = [
  { label: '5% OFF', color: '#FF003C', type: 'discount', value: 5, code: 'SPIN5OFF' },
  { label: 'Free Ship', color: '#FF7300', type: 'shipping', value: 350, code: 'SPINFREE' },
  { label: '10% OFF', color: '#FF003C', type: 'discount', value: 10, code: 'SPIN10OFF' },
  { label: 'Try again', color: '#FF7300', type: 'try_again' },
  { label: '15% OFF', color: '#FF003C', type: 'discount', value: 15, code: 'SPIN15OFF' },
  { label: '20 Coins', color: '#FF7300', type: 'gems', value: 20 },
];

export default function SpinGame({
  onCollectVoucher,
  onAddCustomVoucher,
  vouchers,
  gems,
  onAddGems,
  onClose,
  isOpen,
}: SpinGameProps) {
  const { formatPrice, t } = useCurrency();
  // Navigation tabs inside the Hub
  const [activeTab, setActiveTab] = useState<'spin' | 'quests' | 'shop'>('spin');

  // Wheel state
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeResult, setPrizeResult] = useState<PrizeSlice | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Daily Check-in state
  const [checkedInToday, setCheckedInToday] = useState(() => {
    return localStorage.getItem('taiga_checked_in_today') === 'true';
  });
  const [streakDays, setStreakDays] = useState(() => {
    const saved = localStorage.getItem('taiga_checkin_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Quests progress
  const [questProgress, setQuestProgress] = useState<{ [key: string]: 'idle' | 'running' | 'completed' }>({
    browse: 'idle',
    wishlist: 'idle',
    share: 'idle',
  });
  const [browseTimer, setBrowseTimer] = useState(10); // 10 seconds browser task

  useEffect(() => {
    let timerId: any;
    if (questProgress.browse === 'running' && browseTimer > 0) {
      timerId = setInterval(() => {
        setBrowseTimer((t) => t - 1);
      }, 1000);
    } else if (questProgress.browse === 'running' && browseTimer === 0) {
      setQuestProgress((prev) => ({ ...prev, browse: 'completed' }));
      onAddGems(15);
      alert('Machan, awesome! You completed the Browse Flash Sale Quest and earned +15 Gems! 💎');
    }
    return () => clearInterval(timerId);
  }, [questProgress.browse, browseTimer]);

  if (!isOpen) return null;

  // Handle Wheel Spin Action
  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setPrizeResult(null);

    // Pick a random index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const selectedPrize = PRIZES[prizeIndex];

    // SVG segments layout for 6 slices (60 degrees each)
    // To land on index, the center of the slice is: (index * 60) + 30 degrees.
    // The pointer arrow is at top vertical (90 degrees depending on offset).
    // Standard rotate angle to put target index at top pointer:
    const baseSpins = 6 + Math.floor(Math.random() * 4); // 6 to 9 spins
    const targetAngle = baseSpins * 360 + (360 - (prizeIndex * 60) - 30);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setPrizeResult(selectedPrize);
      setShowResultModal(true);

      // Process rewards
      if (selectedPrize.type === 'gems' && selectedPrize.value) {
        onAddGems(selectedPrize.value);
      } else if ((selectedPrize.type === 'discount' || selectedPrize.type === 'shipping') && selectedPrize.code) {
        // Create a custom voucher
        const newVoucher: Voucher = {
          id: `spin-${Date.now()}`,
          code: selectedPrize.code,
          discountAmount: selectedPrize.type === 'shipping' ? 350 : (selectedPrize.value || 10) * 100, // e.g. 15% becomes 1500 LKR or direct reduction
          minSpend: selectedPrize.type === 'shipping' ? 500 : 2000,
          isCollected: true,
          expiryDate: 'Exp. 7 Days',
        };
        onAddCustomVoucher(newVoucher);
      }
    }, 3200);
  };

  // Handle Daily Checkin
  const handleDailyCheckin = () => {
    if (checkedInToday) return;
    const rewards = [10, 15, 20, 25, 30, 40, 50];
    const index = streakDays % 7;
    const rewardGems = rewards[index];

    onAddGems(rewardGems);
    setCheckedInToday(true);
    setStreakDays((s) => s + 1);
    localStorage.setItem('taiga_checked_in_today', 'true');
    localStorage.setItem('taiga_checkin_streak', (streakDays + 1).toString());

    alert(`Daily check-in successful! Streak Day ${streakDays + 1}: Received +${rewardGems} Gems! 💎`);
  };

  // Start browse task
  const handleStartBrowseQuest = () => {
    setQuestProgress((prev) => ({ ...prev, browse: 'running' }));
    setBrowseTimer(10);
    onClose(); // close modal so user can browse
    alert('Explore Flash Sales or any product for 10 seconds! Keep this app active to earn gems.');
  };

  // Redemptions
  const SHOP_ITEMS = [
    { id: 'r1', title: 'Rs. 200 Cash Voucher', cost: 50, code: 'GEMS200', amount: 200 },
    { id: 'r2', title: 'Rs. 500 Cash Voucher', cost: 100, code: 'GEMS500', amount: 500 },
    { id: 'r3', title: 'Rs. 1,500 Big Savings', cost: 250, code: 'GEMS1500', amount: 1500 },
    { id: 'r4', title: 'Rs. 3,500 Mega Coupon', cost: 500, code: 'GEMS3500', amount: 3500 },
    { id: 'r5', title: '99% OFF Special Order (Up to Rs. 10,000)', cost: 1000, code: 'GEMS99OFF', amount: 10000 },
  ];

  const handleRedeemItem = (item: typeof SHOP_ITEMS[0]) => {
    if (gems < item.cost) {
      alert(`Machan! You need ${item.cost - gems} more Gems to redeem this voucher. Try the Daily Check-in or Spin Game!`);
      return;
    }

    onAddGems(-item.cost);

    // Create custom voucher
    const newVoucher: Voucher = {
      id: `shop-${Date.now()}`,
      code: item.code,
      discountAmount: item.amount,
      minSpend: item.cost * 10,
      isCollected: true,
      expiryDate: 'Exp. 14 Days',
    };
    onAddCustomVoucher(newVoucher);
    alert(`Success! Redeemed ${item.cost} Gems for ${item.title} (Code: ${item.code}). Vouchers credited to your wallet!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border-2 border-orange-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative font-sans flex flex-col h-[650px] max-h-[92vh] animate-fade-in-up">
        
        {/* Top Header Background with Stars */}
        <div className="bg-gradient-to-r from-[#F85606] via-orange-500 to-[#FF6600] text-white p-5 pb-7 relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors cursor-pointer"
            id="close-gems-hub-btn"
          >
            <X size={18} />
          </button>

          <div className="flex items-center space-x-2">
            <span className="bg-yellow-400 text-gray-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Taiga Rewards Hub
            </span>
            <div className="flex items-center text-yellow-300 font-bold text-xs gap-1">
              <Sparkles size={14} className="animate-pulse" />
              <span>Gems Program Live</span>
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Taiga Gems & Spiz</h2>
              <p className="text-xs text-orange-100 mt-1">Earn Gems and spin daily for vouchers up to 99% Off!</p>
            </div>
            {/* Wallet Bubble */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/20 text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-orange-200 block">My Wallet Balance</span>
              <div className="flex items-center justify-end space-x-1">
                <span className="text-xl font-black text-yellow-300">💎 {gems}</span>
                <span className="text-[10px] text-white font-bold">Gems</span>
              </div>
            </div>
          </div>

          {/* Slashed Tab Selector inside the Orange Header */}
          <div className="flex bg-orange-700/40 rounded-xl p-1 mt-5 border border-white/10">
            <button
              onClick={() => setActiveTab('spin')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'spin' ? 'bg-white text-[#F85606] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
            >
              Daily Spin & Win
            </button>
            <button
              onClick={() => setActiveTab('quests')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'quests' ? 'bg-white text-[#F85606] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
            >
              Earn Gems (Quests)
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 text-center py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${activeTab === 'shop' ? 'bg-white text-[#F85606] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/5'}`}
            >
              Redeem Shop (99% Off)
            </button>
          </div>

        </div>

        {/* Dynamic Inner Tab Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: DAILY SPIN & WIN WHEEL (Exactly matches Daily Spin & Win Image) */}
          {activeTab === 'spin' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-3">
              <div className="text-center">
                <h3 className="text-lg font-black text-gray-900 uppercase">Daily Spin & Win</h3>
                <p className="text-xs text-gray-500">One free spin every day. Good luck!</p>
              </div>

              {/* Spin Wheel Component Layout matching user's exact design mock */}
              <div className="relative flex flex-col items-center mt-3">
                {/* Top black wedge indicator arrow */}
                <div className="absolute -top-2 z-20 text-gray-950">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21l-8-14h16z" />
                  </svg>
                </div>

                {/* The Round Sliced Wheel */}
                <div className="relative h-60 w-60 md:h-64 md:w-64 bg-red-600 rounded-full border-[10px] border-red-600 shadow-xl flex items-center justify-center overflow-hidden">
                  
                  <svg 
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning ? 'transform 3.2s cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
                    }}
                    className="h-full w-full rounded-full"
                    viewBox="0 0 200 200"
                  >
                    {/* Render alternating colored slices */}
                    {PRIZES.map((prize, idx) => {
                      const angle = 60; // 6 slices
                      const startAngle = idx * angle;
                      const endAngle = (idx + 1) * angle;

                      const radStart = (startAngle - 90) * Math.PI / 180;
                      const radEnd = (endAngle - 90) * Math.PI / 180;

                      const x1 = 100 + 100 * Math.cos(radStart);
                      const y1 = 100 + 100 * Math.sin(radStart);
                      const x2 = 100 + 100 * Math.cos(radEnd);
                      const y2 = 100 + 100 * Math.sin(radEnd);

                      return (
                        <g key={idx}>
                          <path 
                            d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`} 
                            fill={prize.color} 
                          />
                          {/* Label rotated inside the slice */}
                          <text 
                            x="100" 
                            y="40" 
                            transform={`rotate(${startAngle + 30} 100 100)`}
                            textAnchor="middle" 
                            fill="#FFFFFF" 
                            fontWeight="bold"
                            fontSize="8.5"
                          >
                            {prize.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Absolute Center GO Pin matching screenshot */}
                  <div className="absolute h-14 w-14 rounded-full bg-white border-4 border-red-600 flex items-center justify-center shadow-lg z-10 pointer-events-none">
                    <span className="text-gray-900 font-black text-sm uppercase">GO</span>
                  </div>

                </div>
              </div>

              {/* Bottom Large Spin Now Button matching user image */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white font-black text-base py-3 rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-400 cursor-pointer uppercase tracking-wider"
                id="modal-spin-now-btn"
              >
                {isSpinning ? 'Spinning...' : 'Spin now'}
              </button>

              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider text-center">
                🎉 Won rewards automatically transfer to checkout vouchers wallet!
              </p>
            </div>
          )}

          {/* TAB 2: DAILY CHECK-IN & QUESTS */}
          {activeTab === 'quests' && (
            <div className="space-y-4">
              
              {/* Daily check-in box */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-indigo-800">
                    <CheckCircle size={16} />
                    <span className="font-extrabold text-sm uppercase">Daily Check-In</span>
                  </div>
                  <p className="text-xs text-gray-500">Collect free Gems every 24 hours. Streak: <b>{streakDays} days</b></p>
                  
                  {/* Streak Day Circles */}
                  <div className="flex space-x-1.5 pt-2">
                    {[10, 15, 20, 25, 30, 40, 50].map((rew, dIdx) => {
                      const isActive = dIdx < (streakDays % 7);
                      const isCurrent = dIdx === (streakDays % 7);
                      return (
                        <div 
                          key={dIdx} 
                          className={`h-7 w-7 rounded-lg flex flex-col items-center justify-center text-[8px] font-black border ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : isCurrent && !checkedInToday ? 'bg-yellow-100 border-yellow-400 text-yellow-800 animate-pulse' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                          title={`Day ${dIdx+1}: +${rew} Gems`}
                        >
                          <span>D{dIdx+1}</span>
                          <span>+{rew}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleDailyCheckin}
                  disabled={checkedInToday}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-sm shrink-0 cursor-pointer ${checkedInToday ? 'bg-gray-100 text-gray-400 cursor-not-allowed border' : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'}`}
                >
                  {checkedInToday ? 'Claimed' : 'Check In'}
                </button>
              </div>

              {/* List of active quests */}
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest pl-1">Daily Quest Tasks</h4>

              <div className="space-y-3">
                {/* Quest 1: Browse Flash Sales */}
                <div className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-[#F85606] shrink-0">
                      <Eye size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-800 uppercase">Browse Flash Sales (10s)</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Browse high-energy deals and discover discount products.</p>
                      <span className="inline-block mt-1.5 bg-orange-50 text-[#F85606] text-[9px] font-black px-1.5 py-0.5 rounded">
                        Reward: +15 Gems
                      </span>
                    </div>
                  </div>

                  {questProgress.browse === 'completed' ? (
                    <span className="text-xs font-black text-green-600 flex items-center gap-1 shrink-0 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                      <CheckCircle size={13} /> Completed
                    </span>
                  ) : questProgress.browse === 'running' ? (
                    <span className="text-xs font-bold text-orange-600 flex items-center gap-1 shrink-0 bg-orange-50 px-3 py-1.5 rounded-xl border animate-pulse">
                      <Clock size={13} /> {browseTimer}s Left
                    </span>
                  ) : (
                    <button
                      onClick={handleStartBrowseQuest}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 hover:scale-105 transition-all cursor-pointer shrink-0"
                    >
                      Go <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {/* Quest 2: Add 3 items to Wishlist */}
                <div className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-800 uppercase">Wishlist Premium Products</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Save 3 recommended items into your shopping wishlist.</p>
                      <span className="inline-block mt-1.5 bg-pink-50 text-pink-600 text-[9px] font-black px-1.5 py-0.5 rounded">
                        Reward: +20 Gems
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      alert('Tap heart icons on product cards to add products to wishlist and collect Gems!');
                    }}
                    className="bg-gray-900 hover:bg-black text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 hover:scale-105 transition-all cursor-pointer shrink-0"
                  >
                    Go <ArrowRight size={13} />
                  </button>
                </div>

                {/* Quest 3: Social Sharing */}
                <div className="bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 shrink-0">
                      <MessageSquare size={19} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-800 uppercase">Share Taiga App with Friends</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">Simulate a referral link sharing on WhatsApp or Messenger.</p>
                      <span className="inline-block mt-1.5 bg-teal-50 text-teal-600 text-[9px] font-black px-1.5 py-0.5 rounded">
                        Reward: +10 Gems
                      </span>
                    </div>
                  </div>

                  {questProgress.share === 'completed' ? (
                    <span className="text-xs font-black text-green-600 flex items-center gap-1 shrink-0 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                      <CheckCircle size={13} /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setQuestProgress(prev => ({ ...prev, share: 'completed' }));
                        onAddGems(10);
                        alert('Referral successfully simulated! Received +10 Gems! 💎');
                      }}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1 hover:scale-105 transition-all cursor-pointer shrink-0"
                    >
                      Go <ArrowRight size={13} />
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: REDEEM STORE */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <div className="text-center bg-yellow-50/50 rounded-2xl p-3 border border-yellow-100">
                <p className="text-[11px] text-yellow-800 leading-relaxed">
                  🔥 <b>Gems Store Multipliers:</b> Cash in your accumulated Gems directly into orders checkout discount vouchers! Redeem high tier coupons to save up to <b>99% OFF</b> your total transaction.
                </p>
              </div>

              <div className="space-y-3">
                {SHOP_ITEMS.map((item) => {
                  const canAfford = gems >= item.cost;
                  const isMega = item.cost >= 500;
                  return (
                    <div 
                      key={item.id} 
                      className={`border rounded-2xl p-4 flex items-center justify-between shadow-sm bg-white transition-all ${isMega ? 'border-pink-200 bg-pink-50/20' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-11 w-11 rounded-xl flex flex-col items-center justify-center text-xs shrink-0 font-bold uppercase ${isMega ? 'bg-pink-100 text-pink-600 border border-pink-200 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                          <Gift size={16} />
                          <span className="text-[7px]">Voucher</span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="font-extrabold text-xs text-gray-800 uppercase">
                              {item.id === 'r5' 
                                ? `99% OFF Special Order (Up to ${formatPrice(item.amount)})` 
                                : `${formatPrice(item.amount)} Cash Voucher`}
                            </h4>
                            {isMega && (
                              <span className="bg-pink-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none">
                                99% OFF tier
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Voucher code: <b>{item.code}</b></p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-[#F85606] font-bold">💎 {item.cost} Gems</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeemItem(item)}
                        className={`text-xs font-black px-4 py-2 rounded-xl uppercase transition-all shadow-sm shrink-0 cursor-pointer ${canAfford ? 'bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white hover:scale-105 hover:opacity-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed border'}`}
                      >
                        Redeem
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Internal Prize Result Pop-Up Overlay (Modal in Modal for instant celebration) */}
      {showResultModal && prizeResult && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl animate-scale-up">
            
            <div className="h-14 w-14 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-200">
              <Trophy size={28} className="animate-bounce" />
            </div>

            <h3 className="text-base font-extrabold text-gray-900 uppercase">Lucky Spin Reward!</h3>
            
            <div className="my-4 space-y-2">
              <span className="text-2xl font-black text-[#F85606] block">
                {prizeResult.label}
              </span>
              <p className="text-xs text-gray-500 px-2 leading-relaxed">
                {prizeResult.type === 'try_again' 
                  ? "Ah, Machan! Almost got it. Try another spin to grab those rewards!"
                  : prizeResult.type === 'gems'
                  ? `Awesome! +${prizeResult.value} Gems have been added to your wallet.`
                  : `Congratulations! Coupon code ${prizeResult.code} is collected into your wallet for dynamic order reductions.`}
              </p>
            </div>

            <button
              onClick={() => setShowResultModal(false)}
              className="w-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white font-extrabold py-2.5 rounded-xl transition-opacity hover:opacity-95 cursor-pointer"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
