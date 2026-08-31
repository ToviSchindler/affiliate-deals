"use client";
import { useState } from 'react';
import Link from 'next/link';

interface Coupon {
  store: string;
  code: string;
  discount: string;
  description: string;
  link: string;
}

export default function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [activeStore, setActiveStore] = useState<'aliexpress' | 'temu'>('aliexpress');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const currentCoupons = initialCoupons.filter(c => c.store === activeStore);
  const btnColor = activeStore === 'aliexpress' ? 'bg-[#E52F20] hover:bg-[#c9271a]' : 'bg-[#FB7701] hover:bg-[#e06900]';

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col" dir="rtl">
      
      {/* תפריט עליון אחיד וקבוע */}
      <div className="w-full bg-slate-900 text-white text-sm py-3 px-6 flex justify-between items-center z-50 sticky top-0">
        <span className="font-bold tracking-widest text-lg">DealFinder PRO</span>
        <div className="flex gap-4 md:gap-6">
          <Link href="/" className="hover:text-blue-400 transition-colors font-medium flex items-center gap-1.5">
            <span className="hidden md:inline">ראשי</span> 🏠
          </Link>
          <Link href="/coupons" className="hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5">
            <span className="hidden md:inline">קופונים</span> ✨
          </Link>
          <Link href="/support" className="hover:text-emerald-400 transition-colors font-medium flex items-center gap-1.5">
            <span className="hidden md:inline">מדריכים ותמיכה</span> 💡
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">קופונים והטבות שוות</h1>
          <p className="text-slate-500 text-base">ריכזנו עבורכם את הקופונים הכי שווים שעובדים כרגע ברשת.</p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-slate-200" dir="ltr">
            <button 
              onClick={() => setActiveStore('aliexpress')}
              className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeStore === 'aliexpress' ? 'bg-[#E52F20] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              AliExpress
            </button>
            <button 
              onClick={() => setActiveStore('temu')}
              className={`px-8 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeStore === 'temu' ? 'bg-[#FB7701] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              Temu
            </button>
          </div>
        </div>

        {currentCoupons.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">אין קופונים פעילים כרגע בחנות זו.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {currentCoupons.map((coupon, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col transition-transform hover:-translate-y-1 duration-300 h-full">
                
                <div className="flex flex-col flex-grow items-center text-center mb-6">
                  <h3 className={`font-black text-xl md:text-2xl mb-3 leading-tight ${activeStore === 'aliexpress' ? 'text-[#E52F20]' : 'text-[#FB7701]'}`}>
                    {coupon.discount}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {coupon.description}
                  </p>
                </div>
                
                <div className="mt-auto w-full">
                  <button 
                    onClick={() => handleCopy(coupon.code)}
                    className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-lg py-3 px-4 flex items-center justify-between mb-4 hover:bg-slate-100 transition-colors group cursor-pointer"
                  >
                    <span className="font-mono text-lg font-bold text-slate-800 tracking-wider uppercase group-hover:text-black transition-colors">{coupon.code}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded transition-colors ${copiedCode === coupon.code ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'}`}>
                      {copiedCode === coupon.code ? '✓ הועתק!' : 'העתיקו קוד'}
                    </span>
                  </button>
                  
                  <a 
                    href={coupon.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`block w-full text-center text-white font-bold py-3 rounded-lg transition-colors ${btnColor}`}
                  >
                    למימוש באתר
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-2">DealFinder PRO</h2>
          <p className="text-slate-600 text-sm mb-4">אנחנו מביאים מוצרים מומלצים ודילים משתלמים, ומלווים אתכם מהקנייה ועד לקבלת החבילה.</p>
        </div>
      </footer>
    </div>
  );
}