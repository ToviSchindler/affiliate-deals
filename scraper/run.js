require('dotenv').config();
const { chromium } = require('playwright-extra'); // שימוש בגרסה המורחבת
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth); // הפעלת ההסוואה

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./credentials.json');

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function runScraper() {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds); 
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByTitle['AliExpress'];
    if (!sheet) {
      throw new Error("הלשונית 'AliExpress' לא נמצאה בגיליון.");
    }
    
    const rows = await sheet.getRows();
    console.log(`נטענו ${rows.length} שורות מהגיליון. מתחיל סקרייפינג...`);

    // אתחול הדפדפן עם ארגומנטים שמוחקים את זיהוי האוטומציה של כרום
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'he-IL'
    });
    const page = await context.newPage();

    for (const row of rows) {
      const url = row.link; 
      if (!url) continue;

      console.log(`\nמנווט ל: ${url}`);
      try {
        const isUpdateEmptyOnly = process.env.UPDATE_ONLY_EMPTY === 'true';
        const hasPrice = row.price && row.price.toString().trim() !== '';

        if (isUpdateEmptyOnly && hasPrice) {
          console.log(`מדלג על: ${url} (הנתונים כבר קיימים)`);
          continue; 
        }

        // טעינת הקישור הראשוני (s.click)
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // המתנה לשינוי ה-URL כדי לוודא ששרשרת ההפניות של האפיליאט הסתיימה
        try {
          await page.waitForFunction(() => !window.location.href.includes('s.click.aliexpress'), { timeout: 25000 });
          console.log('הפניית האפיליאט עברה בהצלחה למסך המוצר.');
        } catch (e) {
          console.log('⚠️ אזהרה: ההפניה למוצר התעכבה, מנסה להמשיך בסריקה בכל זאת.');
        }

        // המתנה לרינדור סופי של המחירים והביקורות
        await page.waitForTimeout(5000); 

        const pageTitle = await page.title();
        console.log(`העמוד נטען. כותרת: ${pageTitle}`);

        await page.screenshot({ path: 'debug_page.png' });

        const extractedData = await page.evaluate(() => {
          let price = null;
          let rating = null;
          let sold = null;
          
          const priceSelectors = ['[class*="price--currentPriceText"]', '.product-price-value', '.uniform-banner-box-price', '.price--current--'];
          for (const sel of priceSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.match(/\d/)) { price = el.innerText.trim(); break; }
          }

          const ratingSelectors = ['.overview-rating-average', '[class*="reviewer--rating"]', '[class*="rating--"]', '.product-reviewer-reviews'];
          for (const sel of ratingSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.match(/\d/)) { rating = el.innerText.trim(); break; }
          }

          const soldSelectors = [
            '[class*="reviewer--sold"]', 
            '.product-reviewer-sold', 
            '[class*="trade-count"]',
            '[class*="format--trade--"]',
            '[class*="tradeInfo--"]',
            '[class*="sales-text"]',
            'span[class*="trade"]'
          ];
          
          for (const sel of soldSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText) {
              const text = el.innerText.trim();
              const match = text.match(/[\d.,]+[Kk+]?/);
              if (match) { 
                sold = match[0] + ' נמכרו'; 
                break; 
              }
            }
          }

          return { price, rating, sold };
        });

        if (extractedData.price || extractedData.rating || extractedData.sold) {
          if (extractedData.price) row.price = extractedData.price;
          if (extractedData.rating) row.rating = extractedData.rating;
          if (extractedData.sold) row.sold = extractedData.sold;
          
          await row.save();
          console.log(`✅ עודכן! מחיר: ${extractedData.price || '-'} | דירוג: ${extractedData.rating || '-'} | נמכרו: ${extractedData.sold || '-'}`);
        } else {
          console.log(`⚠️ לא נמצאו נתונים! ייתכן שהסלקטורים לא תואמים או שאליאקספרס חסם אותנו בדף הזה.`);
        }

      } catch (error) {
        console.error(`❌ שגיאה בשליפת הנתונים מהקישור: ${url}`, error.message);
      }
    }

    await browser.close();
    console.log('\nהעדכון היומי הסתיים בהצלחה!');
    
  } catch (err) {
    console.error("שגיאה כללית בהפעלת הסקריפט:", err);
  }
}

runScraper();