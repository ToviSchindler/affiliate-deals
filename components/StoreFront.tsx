"use client";
import { useState } from 'react';
import DealGrid from './DealGrid';

export default function StoreFront({ aliexpressDeals, temuDeals }: { aliexpressDeals: any[], temuDeals: any[] }) {
  const [activeStore, setActiveStore] = useState<'aliexpress' | 'temu'>('aliexpress');

  return (
    <div className="w-full relative">
      
      {/* סרגל צף (Sticky) ושקוף לחלוטין באמצעות Tailwind */}
      <div className="sticky top-20 z-40 flex justify-center py-2 pointer-events-none">
        <div className="flex bg-white/85 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200/50 pointer-events-auto transition-all" dir="ltr">
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

      <div className="mt-4">
        {activeStore === 'aliexpress' ? (
          <DealGrid deals={aliexpressDeals} storeName="AliExpress" colorTheme="aliexpress" />
        ) : (
          <DealGrid deals={temuDeals} storeName="Temu" colorTheme="temu" />
        )}
      </div>
      
    </div>
  );
}