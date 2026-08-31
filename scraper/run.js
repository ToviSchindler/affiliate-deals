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
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'he-IL'
    });

    await context.addCookies([
      { name: 'aep_usuc_f', value: 'region=IL&site=isr&b_locale=he_IL&c_tp=ILS', domain: '.aliexpress.com', path: '/' },
      { name: 'aep_usuc_f', value: 'region=IL&site=isr&b_locale=he_IL&c_tp=ILS', domain: '.aliexpress.us', path: '/' }
    ]);

    for (const row of rows) {
      const url = row.link; 
      if (!url) continue;

      const isUpdateEmptyOnly = process.env.UPDATE_ONLY_EMPTY === 'true';
      const hasPrice = row.price && row.price.toString().trim() !== '';

      if (isUpdateEmptyOnly && hasPrice) {
        console.log(`מדלג על: ${url} (הנתונים כבר קיימים)`);
        continue; 
      }

      console.log(`\nמנווט ל: ${url}`);
      
      // פותחים לשונית חדשה ונקייה לכל מוצר
      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        try {
          await page.waitForFunction(() => !window.location.href.includes('s.click.aliexpress'), { timeout: 25000 });
        } catch (e) {
          console.log('⚠️ אזהרה: ההפניה למוצר התעכבה.');
        }

        let currentUrl = page.url();
        let tempTitle = await page.title();
        
        if (currentUrl.includes('punish') || currentUrl.includes('_____tmd_____') || tempTitle === 'CAPTCHA Verification' || tempTitle.trim() === '') {
          console.log('🛑 זוהתה חסימה שקטה או CAPTCHA מול קישור השותפים!');
          const itemMatch = currentUrl.match(/item\/(\d+)\.html/);
          if (itemMatch) {
            const cleanUrl = `https://he.aliexpress.com/item/${itemMatch[1]}.html`;
            console.log(`🔄 מפעיל עקיפה: מנווט ישירות לדומיין המקומי...`);
            await page.goto(cleanUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
          }
        } 
        
        await page.waitForTimeout(5000); 

        await page.waitForFunction(() => {
          return document.body.innerText.includes('₪') || document.body.innerText.includes('$') || document.body.innerText.includes('ILS');
        }, { timeout: 12000 }).catch(() => console.log('⚠️ לא זוהה סמל מטבע, ממשיך בסריקה...'));

        await page.waitForTimeout(3000); 

        const finalUrl = page.url();
        const pageTitle = await page.title();
        console.log(`כתובת סופית: ${finalUrl}`);
        console.log(`העמוד נטען. כותרת: ${pageTitle || '[כותרת ריקה]'}`);

        const extractedData = await page.evaluate(() => {
          let price = null;
          let rating = null;
          let sold = null;
          
          try {
            if (window.runParams && window.runParams.data && window.runParams.data.priceModule) {
              price = window.runParams.data.priceModule.formatedActivityPrice || window.runParams.data.priceModule.formatedPrice;
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

          if (!price) {
            const allSpans = Array.from(document.querySelectorAll('span, div'));
            for (const el of allSpans) {
              const text = el.innerText || '';
              const className = el.className || '';
              if (typeof className === 'string' && className.toLowerCase().includes('price') && (text.includes('₪') || text.includes('$')) && text.match(/\d/)) {
                price = text.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
                break;
              }
            }
          }

          try {
            if (window.runParams && window.runParams.data && window.runParams.data.titleModule && window.runParams.data.titleModule.feedbackRating) {
              rating = window.runParams.data.titleModule.feedbackRating.averageStar;
            }
          } catch (e) {}

          if (!rating) {
            const ratingSelectors = ['.overview-rating-average', '[class*="reviewer--rating"]'];
            for (const sel of ratingSelectors) {
              const el = document.querySelector(sel);
              if (el && el.innerText.match(/\d/)) { rating = el.innerText.trim(); break; }
            }
          }

          try {
            if (window.runParams && window.runParams.data && window.runParams.data.titleModule && window.runParams.data.titleModule.tradeCount) {
              sold = window.runParams.data.titleModule.tradeCount;
              if (!sold.includes('נמכרו')) sold += ' נמכרו';
            }
          } catch (e) {}

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
      } finally {
        // סוגרים את הלשונית תמיד, גם אם הייתה שגיאה
        await page.close();
      }

      // מרווח נשימה אקראי בין מוצר למוצר (בין 4 ל-10 שניות)
      const delay = Math.floor(Math.random() * 6000) + 4000;
      console.log(`⏳ ממתין ${delay / 1000} שניות לפני המוצר הבא...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    await browser.close();
    console.log('\nהעדכון היומי הסתיים בהצלחה!');
    
  } catch (err) {
    console.error("שגיאה כללית בהפעלת הסקריפט:", err);
  }
}

runScraper();