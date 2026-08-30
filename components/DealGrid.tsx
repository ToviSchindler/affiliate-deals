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

export default function DealGrid({ deals, storeName, colorTheme }: { deals: Deal[], storeName: string, colorTheme: 'orange' | 'teal' }) {
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [sortOrder, setSortOrder] = useState('default');

  const categories = ['הכל', ...Array.from(new Set(deals.map(d => d.category || 'כללי')))];

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

  const colorClass = colorTheme === 'orange' ? 'text-orange-600' : 'text-teal-600';
  const bgClass = colorTheme === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-500 hover:bg-teal-600';
  const badgeClass = colorTheme === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-teal-100 text-teal-800';

  return (
    <div className="pt-8 pb-16">
      <h2 className={`text-3xl font-bold text-center mb-8 ${colorClass}`}>
        הדילים החמים - {storeName}
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">קטגוריה:</span>
          <select
            className="border border-gray-200 rounded-xl p-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">מחיר:</span>
          <select
            className="border border-gray-200 rounded-xl p-2 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">ללא מיון</option>
            <option value="price-asc">מהזול ליקר</option>
            <option value="price-desc">מהיקר לזול</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal: Deal, index: number) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
            <div className="h-56 bg-gray-100 relative">
              {deal.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">אין תמונה</div>
              )}
            </div>

            <div className="p-5 flex flex-col flex-grow gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full self-start ${badgeClass}`}>
                {deal.category || 'כללי'}
              </span>
              <h3 className="font-bold text-lg text-gray-900 leading-tight mt-1 line-clamp-2">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mt-2 whitespace-pre-line text-right leading-relaxed">
                {deal.description}
              </p>

              <div className="mt-auto pt-5 flex items-center justify-between">
                <span className="font-black text-2xl text-emerald-600">{deal.price}</span>
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md ${bgClass}`}
                >
                  לקנייה
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!filteredDeals || filteredDeals.length === 0) && (
        <div className="text-center text-gray-500 mt-16 text-lg">
          לא נמצאו דילים התואמים לסינון.
        </div>
      )}
    </div>
  );
}