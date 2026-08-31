import Papa from 'papaparse';
import DealGrid, { Deal } from '../../components/DealGrid';

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';
const SHEET_NAME = 'Temu';

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
    <DealGrid deals={deals} storeName="Temu" colorTheme="temu" />
  );
}