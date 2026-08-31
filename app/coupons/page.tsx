import { GoogleSpreadsheet } from 'google-spreadsheet';
import CouponsClient from './CouponsClient';

export const revalidate = 60; 

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function fetchCoupons() {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string,
      private_key: (process.env.GOOGLE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
    });
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['Coupons'];
    if (!sheet) return [];
    
    const rows = await sheet.getRows();
    
    return rows.map(row => ({
      store: (row.store || 'aliexpress').toLowerCase(),
      code: row.code || '',
      discount: row.discount || '',
      description: row.description || '',
      link: row.link || 'https://best.aliexpress.com/'
    })).filter(coupon => coupon.code && coupon.discount); 
  } catch (error) {
    console.error('שגיאה במשיכת קופונים:', error);
    return [];
  }
}

export default async function CouponsPage() {
  const coupons = await fetchCoupons();
  return <CouponsClient initialCoupons={coupons} />;
}