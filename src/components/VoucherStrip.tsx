import { Voucher } from '../types';
import { Gift, CheckCircle } from 'lucide-react';
import { useCurrency } from '../lib/CurrencyContext';

interface VoucherStripProps {
  vouchers: Voucher[];
  onCollect: (voucherId: string) => void;
}

export default function VoucherStrip({ vouchers, onCollect }: VoucherStripProps) {
  const { formatPrice, t } = useCurrency();

  return (
    <div className="w-full bg-orange-50 border border-orange-200 rounded-xl p-4 my-6" id="voucher-strip">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-1.5 uppercase tracking-wide">
            <Gift className="text-[#F85606] animate-bounce" size={20} />
            {t('vouchersTitle')}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">Collect vouchers to save big at checkout. Applicable on items across the platform!</p>
        </div>
        <span className="text-[10px] sm:text-xs font-black text-white bg-gradient-to-r from-[#F85606] to-[#FF6600] px-3 py-1 rounded-full uppercase shadow">
          Limited Stock Only
        </span>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {vouchers.map((v) => (
          <div 
            key={v.id} 
            className={`relative rounded-lg overflow-hidden border flex flex-col justify-between p-3 h-28 bg-white transition-all ${v.isCollected ? 'border-green-300 bg-green-50/20' : 'border-dashed border-orange-300 hover:border-orange-500 shadow-sm'}`}
          >
            {/* Coupon accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F85606]" />

            <div>
              <div className="flex items-baseline space-x-0.5">
                <span className="text-xl font-black text-[#F85606]">{formatPrice(v.discountAmount)}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium">Min. spend {formatPrice(v.minSpend)}</p>
              <span className="inline-block mt-1 font-mono font-bold text-[9px] text-[#FF6600] bg-orange-100 px-1 py-0.5 rounded border border-orange-200">
                {v.code}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <span className="text-[9px] text-gray-400">Exp: {v.expiryDate}</span>
              {v.isCollected ? (
                <span className="text-green-600 font-bold text-[10px] flex items-center gap-0.5">
                  <CheckCircle size={11} />
                  {t('collected')}
                </span>
              ) : (
                <button
                  onClick={() => onCollect(v.id)}
                  className="bg-[#F85606] hover:bg-[#FF6600] text-white text-[10px] font-black px-2.5 py-1 rounded cursor-pointer transition-all shadow hover:scale-105"
                  id={`collect-btn-${v.id}`}
                >
                  {t('collect')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
