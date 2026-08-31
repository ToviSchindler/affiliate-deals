import Link from 'next/link';

export default function SupportPage() {
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

      <main className="max-w-5xl mx-auto px-4 py-12 flex-grow w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">מדריכים ותמיכה</h1>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            כל מה שאתם צריכים לדעת כדי להזמין כמו מקצוענים, לחסוך כסף ולהימנע מטעויות.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">מכס, מע"מ ופיצול חבילות</h3>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>בישראל, הזמנות מתחת ל-<span className="font-bold text-red-600">75$</span> פטורות ממע"מ ומכס (הסכום לא כולל את עלות המשלוח, אלא רק את שווי המוצרים).</p>
              <p>עברתם את ה-75$? תדרשו לשלם 17% מע"מ, ולפעמים עמלות שחרור נוספות לחברת השליחויות.</p>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
                <span className="font-bold text-blue-800">💡 טיפ של אלופים:</span> אם אתם רוצים להזמין מספר פריטים שעוברים יחד את ה-75$, פצלו אותם ל-2 הזמנות נפרדות והמתינו <strong>כ-72 שעות</strong> בין הזמנה להזמנה כדי שהמערכת לא תאחד לכם את החבילות.
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">איך מזמינים מוצרים עם תמונה אישית?</h3>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>הזמנתם מחזיק מפתחות, מגן לטלפון או שמיכה עם תמונה של הילדים? כך עושים את זה נכון:</p>
              <ol className="list-decimal list-inside space-y-1.5 font-medium text-slate-700">
                <li>בצעו את ההזמנה של המוצר ושלמו עליה כרגיל.</li>
                <li>היכנסו לאזור ההזמנות ולחצו על <strong>"צור קשר עם המוכר"</strong> (Contact Seller).</li>
                <li>שלחו לו בהודעה את התמונה המבוקשת באיכות הגבוהה ביותר שיש לכם.</li>
              </ol>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2">
                <span className="font-bold text-emerald-800">💡 טיפ חשוב:</span> כתבו למוכר באנגלית פשוטה: <br/>
                <code className="block mt-1 bg-white px-2 py-1 rounded text-emerald-700 border border-emerald-200">"Hi, attached is my photo. Please send a preview before printing. Thanks!"</code>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">הגנת הקונה - מה לעשות אם מוצר הגיע פגום?</h3>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>קודם כל, לא להילחץ. פלטפורמות כמו AliExpress ו-Temu מציעות הגנת קונה מעולה.</p>
              <p>המוצר שבור? חסר חלק? <strong>אל תאשרו את קבלת החבילה!</strong></p>
              <p>צלמו תמונות ברורות של הפגם (וגם של שקית המשלוח המקורית עם המדבקה). היכנסו להזמנה, לחצו על <strong>Open Dispute (פתח סכסוך)</strong>, צרפו את התמונות ודרשו החזר כספי. ברוב המוחלט של המקרים הכסף יוחזר אליכם במהירות.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-4">🚚</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">מעקב משלוחים וזהירות מהודעות זבל</h3>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>כשהחבילה שלכם נוחתת בארץ, לרוב תקבלו הודעת SMS מחברת השילוח (כמו דואר ישראל, צ'יטה, או בר הפצה) כדי לבחור נקודת איסוף.</p>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 mt-2">
                <span className="font-bold text-red-800">⚠️ אזהרת פישינג (עוקץ):</span> <br/>
                קבלתם SMS שכתוב בו "החבילה שלך תקועה במכס, שלם 10 שקלים לשחרור"? <strong>זה כנראה עוקץ!</strong> לעולם אל תכניסו פרטי אשראי מקישור ב-SMS. היכנסו תמיד לאתר הרשמי של חברת השליחויות והקלידו את מספר המעקב בעצמכם.
              </div>
            </div>
          </div>

        </div>

        <div className="mt-12 bg-slate-800 rounded-3xl p-8 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-3">צריכים עזרה נוספת?</h2>
          <p className="text-slate-300 mb-6">אנחנו כאן בשבילכם לכל שאלה, התייעצות או עזרה עם הזמנות.</p>
          <a href="mailto:ali.finder12@gmail.com" className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            ali.finder12@gmail.com
          </a>
        </div>
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