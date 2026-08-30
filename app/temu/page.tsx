import Papa from 'papaparse';

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';
const SHEET_NAME = 'Temu';

interface Deal {
  id: string;
  title: string;
  link: string;
  image: string;
  price: string;
  category: string;
  description: string;
}

async function getDeals() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
  
  const response = await fetch(url, { next: { revalidate: 60 } }); 
  const csvText = await response.text();
  
  const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  return data as Deal[];
}

export default async function TemuPage() {
  const deals = await getDeals();

  return (
    <div className="pt-8 pb-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-teal-600">
        הדילים החמים - Temu
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal: Deal, index: number) => (
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
              <span className="text-xs font-bold bg-teal-100 text-teal-800 px-3 py-1 rounded-full self-start">
                {deal.category || 'כללי'}
              </span>
              <h3 className="font-bold text-lg text-gray-900 leading-tight mt-1 line-clamp-2">
                {deal.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                {deal.description}
              </p>
              
              <div className="mt-auto pt-5 flex items-center justify-between">
                <span className="font-black text-2xl text-emerald-600">{deal.price}</span>
                <a 
                  href={deal.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md"
                >
                  לקנייה
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {(!deals || deals.length === 0) && (
        <div className="text-center text-gray-500 mt-16 text-lg">
          עדיין אין דילים. הוסיפו שורה ללשונית Temu בגיליון!
        </div>
      )}
    </div>
  );
}