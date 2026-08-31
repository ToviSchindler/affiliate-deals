import StoreFront from "../components/StoreFront";
import FloatingCouponBadge from "../components/FloatingCouponBadge";
// @ts-ignore
import { GoogleSpreadsheet } from 'google-spreadsheet';

export const revalidate = 60; 

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function fetchDeals(storeName: string) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
      private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle[storeName];
    if (!sheet) return [];
    
    const rows = await sheet.getRows();
    
    return rows.map((row: any) => ({
      id: row.link || Math.random().toString(),
      title: row.title || row.description || 'ללא כותרת',
      link: row.link || '',
      image: row.image || '',
      price: row.price || '',
      category: row.category || '',
      subcategory: row.subcategory || '', 
      description: row.description || '',
      rating: row.rating || '',
      sold: row.sold || ''
    })).filter((deal: any) => deal.link && deal.price); 
  } catch (error) {
    console.error(`שגיאה במשיכת נתונים מ-${storeName}:`, error);
    return [];
  }
}

export default async function Home() {
  const aliexpressDeals = await fetchDeals('AliExpress');
  const temuDeals = await fetchDeals('Temu').catch(() => []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col relative">
      
      <FloatingCouponBadge />

      <div className="relative flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden flex-grow">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 mt-4">
          
          <div className="flex items-center gap-3 px-6 py-2.5 bg-white rounded-full shadow-sm border border-slate-200 mb-8 cursor-default">
            <span className="text-2xl">🎯</span>
            <span className="text-sm md:text-base font-semibold text-slate-700 tracking-wide">רק מוצרים מומלצים ודילים משתלמים</span>
          </div>

          <div className="text-center max-w-4xl mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              המוצרים הכי שווים ברשת, <br className="hidden md:block"/>
              <span className="text-slate-700">נבדקו ונבחרו עבורכם.</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed px-4">
              אנחנו סורקים את הרשת ומביאים לכם רק את הדילים המשתלמים ביותר – איכותיים, מסודרים ומוכנים לקנייה בראש שקט.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 w-full max-w-5xl relative mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
              
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-2 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-blue-600 mb-3 bg-blue-50 p-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">איכות מאומתת</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">בוחרים רק מוצרים עם דירוג גבוה שנוסו ונבדקו.</p>
              </div>
              
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-2 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-emerald-600 mb-3 bg-emerald-50 p-4 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">חיסכון מובטח</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">מוצאים את המחירים הטובים ביותר ברשת.</p>
              </div>
              
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-2 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-purple-600 mb-3 bg-purple-50 p-4 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.5-1 2-1.5.5-1 1-1.5 1-2.5 0-2.7-1.5-5-3-5Z"/><path d="M15 8.5c-.5-.5-1-.5-1.5-.5"/><path d="M11.5 7.5c-.5-.5-1-.5-1.5-.5"/></svg>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">ליווי מלא</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">איתכם לאורך כל הדרך, מהקנייה ועד לקבלת החבילה.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      <StoreFront aliexpressDeals={aliexpressDeals} temuDeals={temuDeals} />

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-lg font-bold text-slate-800 mb-2">DealFinder PRO</h2>
          <p className="text-slate-600 text-sm mb-4">
            אנחנו מביאים מוצרים מומלצים ודילים משתלמים, ומלווים אתכם מהקנייה ועד לקבלת החבילה.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <a href="mailto:ali.finder12@gmail.com" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
              ali.finder12@gmail.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}