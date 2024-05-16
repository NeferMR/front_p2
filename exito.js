import { chromium } from 'playwright';

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

const page3 = await browser.newPage()
const name2 = 'samsung s23 ultra'
await page3.goto('https://www.exito.com/');
await page3.waitForLoadState('domcontentloaded')
await page3.click(".search-input_fs-search-input__o0Mud")
await page3.keyboard.type(name2)
await page3.keyboard.press('Enter')
await page3.waitForTimeout(1000)
await page3.waitForLoadState('domcontentloaded')
await page3.waitForTimeout(1000)
const titles = await page3.evaluate(() => {    
    const items = document.querySelectorAll('article.product-card-no-alimentos_fsProductCardNoAlimentos__zw867 h3')  
    
    
    const titles = [];
    for (let i = 0; i < items.length && i < 5; i++) {
        
        if (items[i]) {
            titles.push(items[i].textContent);
        }
        
    }
    return titles;
});
console.log(titles);
  
await page3.waitForTimeout(3000)
const prices = await page3.evaluate(() => {    
    const items2 = document.querySelectorAll('article.product-card-no-alimentos_fsProductCardNoAlimentos__zw867 p.ProductPrice_container__price__XmMWA')  
  
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
await page3.waitForTimeout(2000)

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