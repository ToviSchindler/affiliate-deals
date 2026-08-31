import StoreFront from "../components/StoreFront";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import creds from './credentials.json';

// רענון אוטומטי של הנתונים כל 60 שניות
export const revalidate = 60; 

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function fetchDeals(storeName: string) {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle[storeName];
    if (!sheet) return [];
    
    const rows = await sheet.getRows();
    
    // ממירים את נתוני הגיליון למבנה שהקומפוננטה שלנו מצפה לקבל
    return rows.map(row => ({
      id: row.link || Math.random().toString(),
      title: row.title || row.description || 'ללא כותרת', // גיבוי במידה ואין עמודת כותרת
      link: row.link || '',
      image: row.image || '',
      price: row.price || '',
      category: row.category || '',
      description: row.description || '',
      rating: row.rating || '',
      sold: row.sold || ''
    })).filter(deal => deal.link && deal.price); // מציג רק מוצרים עם קישור ומחיר שעודכנו
  } catch (error) {
    console.error(`שגיאה במשיכת נתונים מ-${storeName}:`, error);
    return [];
  }
}

export default async function Home() {
  // שליפת הנתונים מתבצעת בצד שרת (SSR) לפני רינדור העמוד
  const aliexpressDeals = await fetchDeals('AliExpress');
  // במקרה שעדיין אין לשונית Temu בגיליון, נשלח מערך ריק זמנית
  const temuDeals = await fetchDeals('Temu').catch(() => []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      <div className="relative flex flex-col items-center justify-center pt-12 pb-8 overflow-hidden">
        
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4 mt-2">
          
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 mb-5 hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs md:text-sm font-medium text-slate-700 tracking-wide">מערכת דילים מסונכרנת בזמן אמת</span>
          </div>

          <div className="text-center max-w-3xl mb-8 space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              המוצרים הכי שווים ברשת, <br className="hidden md:block"/>
              <span className="text-slate-700">במקום אחד.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
              אנחנו סורקים את הרשת, מסננים רעשים ומביאים לכם רק את הדילים המשתלמים ביותר – מסודרים, מאומתים ומוכנים לקנייה.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-4 w-full max-w-4xl relative mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
              
              <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-blue-600 mb-1.5 bg-blue-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">איכות מאומתת</h3>
                <p className="text-[11px] md:text-xs text-slate-600 leading-tight">בוחרים רק מוצרים עם דירוג גבוה.</p>
              </div>
              
              <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-emerald-600 mb-1.5 bg-emerald-50 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">סנכרון אוטומטי</h3>
                <p className="text-[11px] md:text-xs text-slate-600 leading-tight">הדיל מופיע באתר באופן מיידי.</p>
              </div>
              
              <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
                <div className="text-purple-600 mb-1.5 bg-purple-50 p-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
                </div>
                <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">חיסכון מובטח</h3>
                <p className="text-[11px] md:text-xs text-slate-600 leading-tight">רק מוצרים שחוסכים לכם כסף.</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      <StoreFront aliexpressDeals={aliexpressDeals} temuDeals={temuDeals} />

    </div>
  );
}