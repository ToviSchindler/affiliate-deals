import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 text-center space-y-6">
      <h2 className="text-4xl font-extrabold tracking-tight text-gray-800">
        הדילים הכי שווים ברשת
      </h2>
      <p className="text-lg text-gray-600 max-w-xl pb-8">
        בחרו את הפלטפורמה המועדפת עליכם וגלו את המוצרים הכי חמים, במחירים מעולים ובהמלצה אישית.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-lg justify-center">
        <Link 
          href="/aliexpress" 
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 text-2xl flex items-center justify-center"
        >
          AliExpress
        </Link>
        <Link 
          href="/temu" 
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-5 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 text-2xl flex items-center justify-center"
        >
          Temu
        </Link>
      </div>
    </div>
  );
}