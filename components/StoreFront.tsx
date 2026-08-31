"use client";
import { useState } from 'react';
import DealGrid, { Deal } from './DealGrid';

interface StoreFrontProps {
  aliexpressDeals: Deal[];
  temuDeals: Deal[];
}

export default function StoreFront({ aliexpressDeals, temuDeals }: StoreFrontProps) {
  const [activeStore, setActiveStore] = useState<'aliexpress' | 'temu'>('aliexpress');

  return (
    <div className="w-full" dir="rtl">
      
      {/* סרגל ניווט צף - ללא לוגו, ממורכז ועם אפקט שקיפות בגלילה */}
      <div className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md py-4 border-b border-slate-200/50 mb-6 transition-all">
        <div className="flex justify-center">
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
      </div>

      {/* תוכן האתר (הגריד) */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {activeStore === 'aliexpress' ? (
          <DealGrid deals={aliexpressDeals} storeName="AliExpress" colorTheme="aliexpress" />
        ) : (
          <DealGrid deals={temuDeals} storeName="Temu" colorTheme="temu" />
        )}
      </div>
      
    </div>
  );
}