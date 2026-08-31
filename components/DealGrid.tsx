"use client";
import { useState, useMemo } from 'react';

export interface Deal {
  id: string;
  title: string;
  link: string;
  image: string;
  price: string;
  category: string;
  description: string;
  rating?: string;
  sold?: string;
}

export default function DealGrid({ deals, storeName, colorTheme }: { deals: Deal[], storeName: string, colorTheme: 'aliexpress' | 'temu' }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = Array.from(new Set(deals.map(d => d.category || 'כללי')));

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    
    if (selectedCategory && selectedCategory !== 'הכל') {
      result = result.filter(d => (d.category || 'כללי') === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(lowerQuery) || 
        (d.description && d.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (sortOrder === 'price-asc' || sortOrder === 'price-desc') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price?.replace(/[^\d.-]/g, '')) || 0;
        const priceB = parseFloat(b.price?.replace(/[^\d.-]/g, '')) || 0;
        return sortOrder === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
    }
    return result;
  }, [deals, selectedCategory, sortOrder, searchTerm]);

  const theme = {
    aliexpress: {
      text: 'text-[#E52F20]',
      bg: 'bg-[#E52F20] hover:bg-[#c9271a]',
      badge: 'bg-red-50 text-[#E52F20] border border-red-100',
      activeTab: 'bg-red-50 text-[#E52F20] font-bold border-r-4 border-[#E52F20]',
    },
    temu: {
      text: 'text-[#FB7701]',
      bg: 'bg-[#FB7701] hover:bg-[#e06900]',
      badge: 'bg-orange-50 text-[#FB7701] border border-orange-100',
      activeTab: 'bg-orange-50 text-[#FB7701] font-bold border-r-4 border-[#FB7701]',
    }
  };

  const current = colorTheme === 'aliexpress' ? theme.aliexpress : theme.temu;

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(selectedCategory === cat && cat !== '' ? '' : cat);
  };

  // פונקציה חכמה לניקוי המחיר מטקסטים עודפים
  const formatPrice = (priceStr: string) => {
    if (!priceStr) return '';
    // שולף רק את המספר הראשון (המחיר האמיתי) ומתעלם משאר הטקסט
    const numMatch = priceStr.match(/\d+(?:\.\d+)?/);
    if (numMatch) {
      const symbol = priceStr.includes('$') ? '$' : '₪';
      return `${symbol} ${numMatch[0]}`;
    }
    return priceStr;
  };

  const formatSold = (soldStr?: string) => {
    if (!soldStr) return '';
    return soldStr.replace(/([\d,.]+)/, (match) => {
      const num = parseInt(match.replace(/[,.]/g, ''), 10);
      return num >= 1000 ? (num / 1000) + 'K' : match;
    });
  };

  return (
    <div className="pt-6 pb-12" dir="rtl">
      <h2 className={`text-3xl font-extrabold text-center mb-8 tracking-tight ${current.text}`}>
        הדילים החמים - {storeName}
      </h2>
      
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <aside className="w-full lg:w-56 shrink-0 bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="font-bold text-base mb-3 text-gray-800 border-b border-gray-100 pb-2">קטגוריות</h3>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1">
            <button
              onClick={() => handleCategoryClick('הכל')}
              className={`text-right px-3 py-2 rounded-md text-sm transition-all ${selectedCategory === 'הכל' || !selectedCategory ? current.activeTab : 'text-gray-600 hover:bg-gray-50'}`}
            >
              הכל
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className={`text-right px-3 py-2 rounded-md text-sm transition-all ${selectedCategory === c ? current.activeTab : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm mb-5 border border-gray-100 gap-4 xl:gap-0">
            <div className="text-gray-500 text-sm font-medium w-full xl:w-auto text-right">
              מציג {filteredDeals.length} מוצרים
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-end">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="חיפוש מוצר..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                />
                <svg className="absolute right-2.5 top-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">מיון:</span>
                <div className="flex bg-gray-50 border border-gray-200 rounded-md p-0.5">
                  <button onClick={() => setSortOrder('default')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'default' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>מומלצים</button>
                  <button onClick={() => setSortOrder('price-asc')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'price-asc' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>מהזול ליקר</button>
                  <button onClick={() => setSortOrder('price-desc')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'price-desc' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>מהיקר לזול</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDeals.map((deal, index) => (
              <div key={index} className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 flex flex-col h-full overflow-hidden text-right">
                <div className="aspect-square bg-gray-50 relative overflow-hidden shrink-0">
                  {deal.image ? (
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-300">אין תמונה</div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow gap-2.5">
                  <div className="flex flex-wrap items-start content-start justify-start gap-1.5 min-h-[44px]">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${current.badge}`}>{deal.category || 'כללי'}</span>
                    {deal.rating && (
                      <div className="flex items-center gap-0.5 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md border border-amber-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-[10px] font-bold">{deal.rating}</span>
                      </div>
                    )}
                    {deal.sold && (
                      <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-md border border-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <span className="text-[10px] font-medium">{formatSold(deal.sold)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 mt-1">{deal.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 whitespace-pre-line leading-relaxed">{deal.description}</p>
                  
                  {/* נעילת השורה התחתונה לעיצוב נקי וחלק */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div className="font-black text-xl text-gray-900 whitespace-nowrap" dir="ltr">
                      {formatPrice(deal.price)}
                    </div>
                    <a href={deal.link} target="_blank" rel="noopener noreferrer" className={`text-white text-sm font-bold py-2 px-5 rounded-lg transition-colors shadow-sm whitespace-nowrap ${current.bg}`}>
                      לקנייה
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!filteredDeals || filteredDeals.length === 0) && (
            <div className="text-center text-gray-500 mt-16 text-sm font-medium">
              לא נמצאו דילים התואמים לחיפוש שלך.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}