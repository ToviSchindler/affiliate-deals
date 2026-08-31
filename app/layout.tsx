import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DealFinder - הדילים החמים ברשת",
  description: "הדילים הכי שווים מאליאקספרס וטמו, מתעדכנים באופן שוטף.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* הלוגו המעוצב עם גרדיאנט של אליאקספרס וטמו */}
              <div className="bg-gradient-to-br from-[#E52F20] to-[#FB7701] text-white p-2 rounded-xl group-hover:scale-105 transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <span className="text-2xl font-black tracking-tight">
                <span className="text-[#E52F20]">Deal</span><span className="text-[#FB7701]">Finder</span>
              </span>
            </Link>
          </div>
        </header>
        <main className="max-w-[1200px] mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}