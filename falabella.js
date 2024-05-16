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

const pages = await browser.newPage()
const name2 = 'samsung s23 ultra'
await pages.goto('https://www.falabella.com.co/falabella-co');
await pages.waitForLoadState('domcontentloaded')
await pages.click(".SearchBar-module_searchBar__MCR66")
await pages.keyboard.type(name2)
await pages.click(".SearchBar-module_searchBtnIcon__2L2s0")
await pages.waitForTimeout(1000)
await pages.waitForLoadState('domcontentloaded')
await pages.waitForTimeout(1000)
const titles = await pages.evaluate(() => {    
    const items = document.querySelectorAll('.jsx-2481219049.copy5.primary.jsx-3451706699.normal.line-clamp.line-clamp-3.pod-subTitle.subTitle-rebrand')  
    
    
    const titles = [];
    for (let i = 0; i < items.length && i < 5; i++) {
        
        if (items[i]) {
            titles.push(items[i].textContent);
        }
        
    }
    return titles;
});
console.log(titles);

await pages.waitForTimeout(3000)
const prices = await pages.evaluate(() => {    
    const items2 = document.querySelectorAll('.copy10.primary.medium.jsx-3451706699.normal.line-height-22')  
  
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
await pages.waitForTimeout(2000)

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

