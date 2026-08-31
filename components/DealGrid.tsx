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
}

export default function DealGrid({ deals, storeName, colorTheme }: { deals: Deal[], storeName: string, colorTheme: 'aliexpress' | 'temu' }) {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [sortOrder, setSortOrder] = useState('default');

  const categories = Array.from(new Set(deals.map(d => d.category || 'כללי')));

  const filteredDeals = useMemo(() => {
    let result = [...deals];
    if (selectedCategory !== 'הכל') {
      result = result.filter(d => (d.category || 'כללי') === selectedCategory);
    }
    if (sortOrder === 'price-asc' || sortOrder === 'price-desc') {
      result.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.-]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^\d.-]/g, '')) || 0;
        return sortOrder === 'price-asc' ? priceA - priceB : priceB - priceA;
      });
    }
    return result;
  }, [deals, selectedCategory, sortOrder]);

  // הגדרת הצבעים המדויקים לפי המותג
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
  const inactiveTabClass = 'text-gray-600 hover:bg-gray-50 border-r-4 border-transparent hover:border-gray-300';

  const handleCategoryClick = (cat: string) => {
    if (selectedCategory === cat && cat !== 'הכל') {
      setSelectedCategory('הכל');
    } else {
      setSelectedCategory(cat);
    }
  };

  return (
    <div className="pt-8 pb-16">
      <h2 className={`text-4xl font-extrabold text-center mb-10 tracking-tight ${current.text}`}>
        הדילים החמים - {storeName}
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-56 shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
          <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-100 pb-2">קטגוריות</h3>
          <div className="flex flex-row lg:flex-col flex-wrap gap-1">
            <button
              onClick={() => handleCategoryClick('הכל')}
              className={`text-right px-4 py-2.5 rounded-lg transition-all ${selectedCategory === 'הכל' ? current.activeTab : inactiveTabClass}`}
            >
              הכל
            </button>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => handleCategoryClick(c)}
                className={`text-right px-4 py-2.5 rounded-lg transition-all ${selectedCategory === c ? current.activeTab : inactiveTabClass}`}
              >
                {c}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
            <div className="text-gray-500 text-sm font-medium">
              מציג {filteredDeals.length} מוצרים
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">מיון:</span>
              <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-1">
                <button onClick={() => setSortOrder('default')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortOrder === 'default' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>מומלצים</button>
                <button onClick={() => setSortOrder('price-asc')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortOrder === 'price-asc' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>מהזול ליקר</button>
                <button onClick={() => setSortOrder('price-desc')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${sortOrder === 'price-desc' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>מהיקר לזול</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDeals.map((deal: Deal, index: number) => (
              <div key={index} className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden flex flex-col">
                <div className="h-56 bg-gray-50 relative overflow-hidden">
                  {deal.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={deal.image} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">אין תמונה</div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full self-start tracking-wide ${current.badge}`}>
                    {deal.category || 'כללי'}
                  </span>
                  <h3 className="font-bold text-lg text-gray-900 leading-tight mt-1 line-clamp-2">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mt-1 whitespace-pre-line text-right leading-relaxed">
                    {deal.description}
                  </p>

                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-50">
                    <span className="font-black text-2xl text-gray-900">{deal.price}</span>
                    <a
                      href={deal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${current.bg}`}
                    >
                      לקנייה
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(!filteredDeals || filteredDeals.length === 0) && (
            <div className="text-center text-gray-500 mt-20 text-xl font-medium">לא נמצאו דילים התואמים לסינון.</div>
          )}
        </main>
      </div>
    </div>
  );
}