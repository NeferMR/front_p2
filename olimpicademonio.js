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

const pag = await browser.newPage()
const name2 = 'samsung s23 ultra'
await pag.goto('https://www.olimpica.com/');
await pag.waitForLoadState('domcontentloaded')
await pag.click(".c-muted-2.fw5.flex.items-center.t-body.bg-base.vtex-input__suffix.br2.bl-0.br--right.pr5.pl4")
await pag.keyboard.type(name2)
await pag.keyboard.press('Enter')
await pag.waitForTimeout(1000)
await pag.waitForLoadState('domcontentloaded')
await pag.waitForTimeout(1000)
const titles = await pag.evaluate(() => {    
    const items = document.querySelectorAll('h3')  
    
    
    const titles = [];
    for (let i = 0; i < items.length && i < 5; i++) {
        
        if (items[i]) {
            titles.push(items[i].textContent);
        }
        
    }
    return titles;
});
console.log(titles);

await pag.waitForTimeout(3000)
const prices = await pag.evaluate(() => {    
    const items2 = document.querySelectorAll('.vtex-product-price-1-x-sellingPrice--hasListPrice--dynamicF .olimpica-dinamic-flags-0-x-currencyContainer')   
  
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
await pag.waitForTimeout(2000)

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