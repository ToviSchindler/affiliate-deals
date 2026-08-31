require('dotenv').config();
const { chromium } = require('playwright');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./credentials.json');

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function runScraper() {
  try {
    // אתחול הגיליון והתחברות ישירה
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds); 
    await doc.loadInfo(); 
    
    // בחירת הלשונית
    const sheet = doc.sheetsByTitle['AliExpress'];
    if (!sheet) {
      throw new Error("הלשונית 'AliExpress' לא נמצאה בגיליון.");
    }
    
    const rows = await sheet.getRows();
    console.log(`נטענו ${rows.length} שורות מהגיליון. מתחיל סקרייפינג...`);

    // הפעלת הדפדפן 
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // ריצה על הלינקים
    for (const row of rows) {
      // בגרסה 3 ניגשים לעמודה ישירות כשם מאפיין (נניח שהעמודה נקראת 'link')
      const url = row.link; 
      if (!url) continue;

      console.log(`מנווט ל: ${url}`);
      try {
        // מחכים פחות זמן לטעינה המלאה, אבל נותנים ספייס להפניות של הלינק
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        
        // המתנה של 6 שניות כדי לתת לפופאפים לקפוץ ולדף להתרנדר לגמרי
        await page.waitForTimeout(6000); 

        // שמירת צילום מסך בכל ריצה כדי שתוכלי לראות מה חוסם אותנו
        await page.screenshot({ path: 'debug_page.png' });

        const extractedData = await page.evaluate(() => {
          let price = null;
          let rating = null;
          
          // שליפת מחיר
          const priceSelectors = [
            '[class*="price--currentPriceText"]', 
            '.product-price-value',
            '.uniform-banner-box-price',
            '.price--current--'
          ];
          for (const sel of priceSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.match(/\d/)) {
              price = el.innerText.trim();
              break;
            }
          }

          // שליפת דירוג כוכבים / ביקורות
          const ratingSelectors = [
            '.overview-rating-average',
            '[class*="reviewer--rating"]',
            '[class*="rating--"]',
            '.product-reviewer-reviews'
          ];
          for (const sel of ratingSelectors) {
            const el = document.querySelector(sel);
            if (el && el.innerText.match(/\d/)) {
              rating = el.innerText.trim();
              break;
            }
          }

          return { price, rating };
        });

        if (extractedData.price || extractedData.rating) {
          if (extractedData.price) row.price = extractedData.price;
          if (extractedData.rating) row.rating = extractedData.rating;
          
          await row.save();
          console.log(`עודכן! מחיר: ${extractedData.price || 'ללא שינוי'} | דירוג: ${extractedData.rating || 'לא זוהה'}`);
        } else {
          console.log(`לא זוהו נתונים לעדכון בעמוד זה.`);
        }

      } catch (error) {
        console.error(`שגיאה בשליפת הנתונים מהקישור: ${url}`, error.message);
      }
    }

    await browser.close();
    console.log('העדכון היומי הסתיים בהצלחה!');
    
  } catch (err) {
    console.error("שגיאה כללית בהפעלת הסקריפט:", err);
  }
}

runScraper();