import { chromium } from 'playwright';

// const browser = await chromium.launch()
// const page = await browser.newPage()
// await page.goto('https://betplay.com.co');
// await page.waitForLoadState('domcontentloaded')
// await page.click(".menu-button");
// await page.click("a[data-menu-item='Deportes']")
// await page.waitForLoadState('domcontentloaded')
// await page.click(".KambiBC-applied-terms__placeholder")
// await page.$eval( '#KambiBC-term-search-overlay__input', element => {
//     element.value = 'Real Madrid';
// })
// await page.keyboard.type(' ')
// await page.waitForTimeout(2000)
// await page.keyboard.press('Enter')

// await page.waitForSelector(`.KambiBC-event-item__bet-offer-count`)

// const offers = await page.$$('.KambiBC-event-item__bet-offer-count')

// const textOffers = await Promise.all(offers.map(async off => await off.innerHTML()))

// console.log(textOffers);

// await browser.close()

//Mercado libre

const browser = await chromium.launch(
    { headless: false, slowMo: 800 }
)

async function findElementByText(elements, targetText) {
  try {
    for (const element of elements) {
      const text = await element.textContent();
      if (targetText.toLowerCase().includes(text.toLowerCase())) {
        return element;
      }
    }
  } catch (error) {
    console.error(error);
    return null; 
  }
  return null; 
}

const page = await browser.newPage()
const name = 'iPhone 11'
await page.goto('https://www.mercadolibre.com.co/');
await page.waitForLoadState('domcontentloaded')
await page.click(".nav-search-input")
await page.keyboard.type(name)
await page.click(".nav-search-btn")
await page.waitForTimeout(1000)
await page.waitForLoadState('domcontentloaded')
await page.waitForTimeout(1000)
const titles = await page.evaluate(() => {    
  const items = document.querySelectorAll('.ui-search-item__title')  
  
  
  const titles = [];
  for (let i = 0; i < items.length && i < 5; i++) {
      
      if (items[i]) {
          titles.push(items[i].textContent);
      }
      
  }
  return titles;
});
console.log(titles);

await page.waitForTimeout(3000)
const prices = await page.evaluate(() => {    
    const items2 = document.querySelectorAll('.ui-search-price--size-medium .ui-search-price__second-line .andes-money-amount__fraction')  
  
    const prices = [];
    for (let i = 0; i < items2.length && i < 5; i++) {
        if (items2[i]) {
            prices.push(items2[i].textContent);
        }
    }
    return prices;
}); 
console.log(prices);

const combinedData = [];
for (let i = 0; i < titles.length && i < prices.length; i++) {
    combinedData.push({ title: titles[i], price: prices[i] });
}

console.log(combinedData);
await page.waitForTimeout(2000)

// Limpiamos los precios y los convertimos en números antes de ordenarlos
const cleanPrices = prices.map(price => parseFloat(price.replace(/\D/g, '')));
const combinedDataWithPrices = titles.map((title, index) => ({
  title,
  price: cleanPrices[index]
}));

// Ordenamos los elementos combinados por precio numérico
combinedDataWithPrices.sort((a, b) => a.price - b.price);

// Tomamos los tres elementos más baratos
const topThreeItems = combinedDataWithPrices.slice(0, 3);
console.log(topThreeItems);
await browser.close()









