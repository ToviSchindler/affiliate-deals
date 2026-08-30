import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finder Best Links - דילים שווים",
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
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight hover:text-indigo-800 transition-colors">
              Finder Best Links
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}