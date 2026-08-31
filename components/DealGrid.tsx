"use client";
import { useState, useMemo } from 'react';

export interface Deal {
  id: string;
  title: string;
  link: string;
  image: string;
  price: string;
  category: string;
  subcategory?: string;
  description: string;
  rating?: string;
  sold?: string;
}

export default function DealGrid({ deals, storeName, colorTheme }: { deals: Deal[], storeName: string, colorTheme: 'aliexpress' | 'temu' }) {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(''); // שומר איזה תפריט פתוח עכשיו
  const [sortOrder, setSortOrder] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryHierarchy = useMemo(() => {
    const hierarchy: Record<string, Set<string>> = {};
    deals.forEach(deal => {
      const cat = deal.category || 'כללי';
      if (!hierarchy[cat]) hierarchy[cat] = new Set();
      if (deal.subcategory) hierarchy[cat].add(deal.subcategory);
    });
    return hierarchy;
  }, [deals]);

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    
    if (selectedCategory && selectedCategory !== 'הכל') {
      result = result.filter(d => (d.category || 'כללי') === selectedCategory);
      if (selectedSubCategory) {
        result = result.filter(d => d.subcategory === selectedSubCategory);
      }
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
  }, [deals, selectedCategory, selectedSubCategory, sortOrder, searchTerm]);

  const theme = {
    aliexpress: {
      text: 'text-[#E52F20]',
      bg: 'bg-[#E52F20] hover:bg-[#c9271a]',
      badge: 'bg-red-50 text-[#E52F20] border border-red-100',
      activeTab: 'bg-red-50 text-[#E52F20] font-bold border-r-4 border-[#E52F20]',
      subTab: 'text-[#E52F20] font-bold bg-red-50/50',
    },
    temu: {
      text: 'text-[#FB7701]',
      bg: 'bg-[#FB7701] hover:bg-[#e06900]',
      badge: 'bg-orange-50 text-[#FB7701] border border-orange-100',
      activeTab: 'bg-orange-50 text-[#FB7701] font-bold border-r-4 border-[#FB7701]',
      subTab: 'text-[#FB7701] font-bold bg-orange-50/50',
    }
  };

  const current = colorTheme === 'aliexpress' ? theme.aliexpress : theme.temu;

  const handleCategoryClick = (cat: string) => {
    // 1. קובעים את הסינון תמיד, כדי שלא יתבטל
    setSelectedCategory(cat);
    setSelectedSubCategory('');
    
    // 2. מנהלים את פתיחת/סגירת התפריט בלבד
    if (cat === 'הכל') {
      setExpandedCategory('');
    } else {
      // אם הקטגוריה פתוחה, סגור אותה. אחרת פתח אותה.
      setExpandedCategory(prev => prev === cat ? '' : cat);
    }
  };

  const formatPrice = (priceStr: string) => {
    if (!priceStr) return '';
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
        <aside className="w-full lg:w-64 shrink-0 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
          <h3 className="font-bold text-base mb-4 text-slate-800 border-b border-slate-100 pb-3">סינון קטגוריות</h3>
          <div className="flex flex-col gap-1.5">
            
            <button
              onClick={() => handleCategoryClick('הכל')}
              className={`text-right px-4 py-2.5 rounded-lg text-sm transition-all ${selectedCategory === 'הכל' ? current.activeTab : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
            >
              הכל
            </button>

            {Object.entries(categoryHierarchy).map(([cat, subcatsSet]) => {
              const subcats = Array.from(subcatsSet);
              const isSelected = selectedCategory === cat; // קובע את העיצוב (צבוע באדום)
              const isOpen = expandedCategory === cat;     // קובע אם התפריט פתוח
              const hasSubcats = subcats.length > 0;

              return (
                <div key={cat} className="flex flex-col w-full">
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex justify-between items-center text-right px-4 py-2.5 rounded-lg text-sm transition-all ${isSelected ? current.activeTab : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                  >
                    <span>{cat}</span>
                    {hasSubcats && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-current' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {isOpen && hasSubcats && (
                    <div className="flex flex-col gap-1 pr-5 pl-2 mt-2 mb-2 border-r-[3px] border-slate-100 py-1">
                      <button
                        onClick={() => setSelectedSubCategory('')}
                        className={`text-right px-3 py-2 rounded-md text-sm transition-all ${!selectedSubCategory ? current.subTab : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                      >
                        הכל ב{cat}
                      </button>
                      {subcats.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSubCategory(sub)}
                          className={`text-right px-3 py-2 rounded-md text-sm transition-all ${selectedSubCategory === sub ? current.subTab : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm mb-5 border border-slate-200 gap-4 xl:gap-0">
            <div className="text-slate-500 text-sm font-medium w-full xl:w-auto text-right">
              מציג {filteredDeals.length} מוצרים
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-end">
              <div className="relative w-full sm:w-64">
                <input 
                  type="text" 
                  placeholder="חיפוש מוצר..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all"
                />
                <svg className="absolute right-2.5 top-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">מיון:</span>
                <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
                  <button onClick={() => setSortOrder('default')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'default' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>מומלצים</button>
                  <button onClick={() => setSortOrder('price-asc')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'price-asc' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>מהזול ליקר</button>
                  <button onClick={() => setSortOrder('price-desc')} className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${sortOrder === 'price-desc' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>מהיקר לזול</button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDeals.map((deal, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-300 flex flex-col h-full overflow-hidden text-right">
                <div className="aspect-square bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
                  {deal.image ? (
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-300">אין תמונה</div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow gap-3">
                  <div className="flex flex-wrap items-start content-start justify-start gap-1.5 min-h-[44px]">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md ${current.badge}`}>{deal.subcategory || deal.category || 'כללי'}</span>
                    {deal.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md border border-amber-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-current shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-[10px] font-bold">{deal.rating}</span>
                      </div>
                    )}
                    {deal.sold && (
                      <div className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <span className="text-[10px] font-medium">{formatSold(deal.sold)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-slate-900 leading-snug line-clamp-2 mt-1">{deal.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 line-clamp-2 whitespace-pre-line leading-relaxed">{deal.description}</p>
                  
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-slate-100">
                    <div className="font-black text-xl md:text-2xl text-slate-900 whitespace-nowrap" dir="ltr">
                      {formatPrice(deal.price)}
                    </div>
                    <a href={deal.link} target="_blank" rel="noopener noreferrer" className={`text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm whitespace-nowrap ${current.bg}`}>
                      לקנייה
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!filteredDeals || filteredDeals.length === 0) && (
            <div className="text-center text-slate-500 mt-16 text-sm font-medium bg-white p-12 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-4xl mb-4 block">🔍</span>
              לא נמצאו דילים התואמים לחיפוש שלך.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}