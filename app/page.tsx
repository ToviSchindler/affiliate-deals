import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center py-2 md:py-4 min-h-[80vh] bg-slate-50 overflow-hidden font-sans">
      
      {/* אלמנטים עיצוביים ברקע - הוספנו אנימציית פעימה (Pulse) עדינה ומושהית */}
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-5xl px-4 mt-2">
        
        {/* תגית עדכון חי */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white rounded-full shadow-sm border border-slate-200 mb-5 hover:shadow-md transition-shadow cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs md:text-sm font-medium text-slate-700 tracking-wide">מערכת דילים מסונכרנת בזמן אמת</span>
        </div>

        {/* כותרת ראשית */}
        <div className="text-center max-w-3xl mb-5 space-y-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            המוצרים הכי שווים ברשת, <br className="hidden md:block"/>
            <span className="text-slate-700">
              במקום אחד.
            </span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed px-4">
            אנחנו סורקים את הרשת, מסננים רעשים ומביאים לכם רק את הדילים המשתלמים ביותר – מסודרים, מאומתים ומוכנים לקנייה.
          </p>
        </div>

        {/* אזור חנויות */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-5">
          
          {/* כרטיסיית AliExpress - הוספנו אפקט ריחוף עמוק יותר */}
          <Link href="/aliexpress" className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-red-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between h-24">
            <div className="flex items-center gap-3 md:gap-4">
              {/* האייקון עכשיו גדל מעט ומסתובב קלות בעת ריחוף */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              </div>
              <div className="text-right">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">AliExpress</h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium group-hover:text-red-500 transition-colors">לכל הדילים מאליאקספרס</p>
              </div>
            </div>
            {/* החץ זז מעט שמאלה בעת ריחוף כדי "להזמין" להקלקה */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-red-500 group-hover:bg-red-50 transition-all duration-300 shrink-0 group-hover:-translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
          </Link>

          {/* כרטיסיית Temu */}
          <Link href="/temu" className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-200 hover:border-orange-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-between h-24">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
              </div>
              <div className="text-right">
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">Temu</h2>
                <p className="text-xs md:text-sm text-slate-500 font-medium group-hover:text-orange-500 transition-colors">לכל הדילים מטמו</p>
              </div>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-all duration-300 shrink-0 group-hover:-translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
          </Link>
        </div>

        {/* פאנל יתרונות עסקי - טקסטים הודגשו לקריאות טובה יותר והוספה אנימציית ריחוף */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 md:p-4 w-full max-w-4xl relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
            
            <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
              <div className="text-blue-600 mb-1.5 bg-blue-50 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">איכות מאומתת</h3>
              {/* הטקסט הוחלף ל-slate-600 */}
              <p className="text-[11px] md:text-xs text-slate-600 leading-tight">בוחרים רק מוצרים עם דירוג גבוה.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
              <div className="text-emerald-600 mb-1.5 bg-emerald-50 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">סנכרון אוטומטי</h3>
              {/* הטקסט הוחלף ל-slate-600 */}
              <p className="text-[11px] md:text-xs text-slate-600 leading-tight">הדיל מופיע באתר באופן מיידי.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-1 py-2 md:py-0 group cursor-default transition-transform hover:scale-105 duration-300">
              <div className="text-purple-600 mb-1.5 bg-purple-50 p-2 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
              </div>
              <h3 className="text-xs md:text-sm font-bold text-slate-900 mb-0.5">חיסכון מובטח</h3>
              {/* הטקסט הוחלף ל-slate-600 */}
              <p className="text-[11px] md:text-xs text-slate-600 leading-tight">רק מוצרים שחוסכים לכם כסף.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}