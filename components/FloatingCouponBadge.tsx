import Link from 'next/link';

export default function FloatingCouponBadge() {
  return (
    <Link href="/coupons" className="fixed bottom-6 left-6 z-50 group">
      <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
        
        {/* טבעת חיצונית מסתובבת - קו מקווקו המדמה תלוש לגזירה */}
        <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-[#E52F20] animate-[spin_10s_linear_infinite] opacity-60"></div>
        
        {/* אנימציית הילה (Pulse) למשיכת תשומת לב */}
        <div className="absolute inset-0 rounded-full border-2 border-[#E52F20] animate-ping opacity-20"></div>
        
        {/* רקע פנימי קבוע עם אייקון וטקסט */}
        <div className="absolute inset-1.5 bg-red-50 rounded-full shadow-lg border border-red-100 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-100 flex flex-col items-center justify-center">
          
          {/* אייקון קופון במקום חץ */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#E52F20" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mb-0.5 md:mb-1 w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12"
          >
            <path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/>
            <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2H5a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4V7a2 2 0 0 1 2 -2z"/>
          </svg>
          
          {/* טקסט ברור במרכז */}
          <span className="text-[#E52F20] font-black text-[11px] md:text-sm tracking-wide">
            קופונים
          </span>
          
        </div>
      </div>
    </Link>
  );
}