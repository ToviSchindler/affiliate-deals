require('dotenv').config();
const { chromium } = require('playwright-extra'); 
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth); 

const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./credentials.json');

const SHEET_ID = '1quhfHpoheGvE75s8xjDz2zoXP1H9xz9K5ngKYS8_J94';

async function runScraper() {
  try {
    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(creds); 
    await doc.loadInfo(); 
    
    const sheet = doc.sheetsByTitle['AliExpress'];
    if (!sheet) throw new Error("הלשונית 'AliExpress' לא נמצאה בגיליון.");
    
    const rows = await sheet.getRows();
    console.log(`נטענו ${rows.length} שורות מהגיליון. מתחיל סקרייפינג...`);

    const browser = await chromium.launch({ 
      headless: true,
      args: ['--disable-blink-features=AutomationControlled', '--window-size=1920,1080']
    });
    
    // הסרנו את הכותרות המזויפות כדי למנוע התנגשות עם שרתי האוטומציה
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'he-IL'
    });

    // הזרקת עוגיות כדי להכריח את אליאקספרס להישאר בגרסה הישראלית ולהציג מחירים
    await context.addCookies([
      {
        name: 'aep_usuc_f',
        value: 'region=IL&site=isr&b_locale=he_IL&c_tp=ILS',
        domain: '.aliexpress.com',
        path: '/'
      },
      {
        name: 'aep_usuc_f',
        value: 'region=IL&site=isr&b_locale=he_IL&c_tp=ILS',
        domain: '.aliexpress.us',
        path: '/'
      }
    ]);

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

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        try {
          await page.waitForFunction(() => !window.location.href.includes('s.click.aliexpress'), { timeout: 25000 });
        } catch (e) {
          console.log('⚠️ אזהרה: ההפניה למוצר התעכבה.');
        }

        let currentUrl = page.url();
        let tempTitle = await page.title();
        
        // זיהוי חסימה שקטה (מסך לבן) בנוסף לזיהוי קפצ'ה
        if (currentUrl.includes('punish') || currentUrl.includes('_____tmd_____') || tempTitle === 'CAPTCHA Verification' || tempTitle.trim() === '') {
          console.log('🛑 זוהתה חסימה שקטה או CAPTCHA מול קישור השותפים!');
          const itemMatch = currentUrl.match(/item\/(\d+)\.html/);
          if (itemMatch) {
            const cleanUrl = `https://he.aliexpress.com/item/${itemMatch[1]}.html`;
            console.log(`🔄 מפעיל עקיפה: מנווט ישירות לדומיין המקומי...`);
            await page.goto(cleanUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
          } else {
            console.log('⚠️ לא ניתן לחלץ מזהה מוצר מתוך הכתובת.');
          }
        } 
        
        await page.waitForTimeout(8000); 

        const finalUrl = page.url();
        const pageTitle = await page.title();
        console.log(`כתובת סופית: ${finalUrl}`);
        console.log(`העמוד נטען. כותרת: ${pageTitle || '[כותרת ריקה]'}`);

        const extractedData = await page.evaluate(() => {
          let price = null;
          let rating = null;
          let sold = null;
          
          try {
            if (window.runParams && window.runParams.data) {
              const data = window.runParams.data;
              if (data.priceModule) {
                price = data.priceModule.formatedActivityPrice || data.priceModule.formatedPrice;
              }
              if (data.titleModule && data.titleModule.tradeCount) {
                sold = data.titleModule.tradeCount;
                if (!sold.includes('נמכרו')) sold += ' נמכרו';
              }
              if (data.titleModule && data.titleModule.feedbackRating) {
                rating = data.titleModule.feedbackRating.averageStar;
              }
            }
          } catch (e) {}

          if (!price) {
            const metaPrice = document.querySelector('meta[property="og:price:amount"], meta[property="product:price:amount"]');
            const metaCurrency = document.querySelector('meta[property="og:price:currency"], meta[property="product:price:currency"]');
            if (metaPrice && metaPrice.content) {
              const currency = (metaCurrency && metaCurrency.content === 'ILS') ? '₪' : '$';
              price = `${currency}${metaPrice.content}`;
            } 
          }
          
          if (!price) {
            const priceSelectors = ['[class*="price--currentPriceText"]', '[class*="Price--currentPrice"]', '.product-price-current', '[class*="CurrentPrice--"]'];
            for (const sel of priceSelectors) {
              const el = document.querySelector(sel);
              if (el && el.innerText.match(/\d/)) { 
                price = el.innerText.replace(/\n/g, '').replace(/\s+/g, ' ').trim(); 
                break; 
              }
            }
          }

          if (!rating) {
            const ratingSelectors = ['.overview-rating-average', '[class*="reviewer--rating"]'];
            for (const sel of ratingSelectors) {
              const el = document.querySelector(sel);
              if (el && el.innerText.match(/\d/)) { rating = el.innerText.trim(); break; }
            }
          }

          if (!sold) {
            const soldSelectors = ['[class*="reviewer--sold"]', '.product-reviewer-sold', '[class*="trade-count"]'];
            for (const sel of soldSelectors) {
              const el = document.querySelector(sel);
              if (el && el.innerText) {
                const match = el.innerText.trim().match(/[\d.,]+[Kk+]?/);
                if (match) { sold = match[0] + ' נמכרו'; break; }
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
          console.log(`⚠️ לא נמצאו נתונים. הדף כנראה ריק או נחסם.`);
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