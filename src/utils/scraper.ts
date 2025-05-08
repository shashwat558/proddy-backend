import puppeteer, { Page } from "puppeteer";

export async function getProductDetails(productUrl: string){
    

    const parts = productUrl.split("/");
    const productId = parts[parts.length - 2];
    console.log(productId)

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/opt/render/project/puppeteer/chromium/chrome',


        args: ["--disable-blink-features=AutomationControlled", '--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {

        const page = await browser.newPage();
        await setPage(page);
        await page.goto(productUrl, {waitUntil: "domcontentloaded"});
        await page.setRequestInterception(true)
        page.on("request", (req) => {
            if(req.resourceType() == "stylesheet" && req.resourceType() == "font"){
                req.abort()
            } else {
                req.continue()
            } 

        })

        const [titleText, productName, price, mrp,  seller, productInfo, images] = await Promise.all([
            getTextContent(page, ".pdp-title"),
            getTextContent(page, ".pdp-name"),
            getTextContent(page, ".pdp-price"),
            getTextContent(page, ".pdp-mrp"),
            getTextContent(page, ".supplier-productSellerName"),
            getTextContent(page, ".pdp-product-description-content"),
            getImages(page, ".image-grid-imageContainer"),

            // getImages(page, ".expiryDate-container"),
            
        ])

        return ({titleText, productName, price, mrp, seller,productInfo, images})

        
    } catch (error) {
       console.log(error) 
    }
}


const setPage = async (page: Page) => {
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

await page.evaluate(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
});


    

    await page.setViewport({width: 1024, height: 1080})
}


const getTextContent = async (page: Page, selector: string): Promise<string> => {
   try{ await page.waitForSelector(selector, {timeout: 6000});
    const textElement = await page.$(selector);
    if(!textElement) return "N/A"
    const text = await page.evaluate((el) => el?.textContent || "N/A", textElement);


    return text ?? "";
} catch(error){
    console.log(error)
    return "N/A"
}


}

const getImages = async(page: Page, selector: string) => {
     await page.waitForSelector(selector);
    //   await page.waitForNavigation({ waitUntil: 'load' });
    const images = await page.$$eval(".image-grid-image", elements => 
        elements.map((el) => {
            const style = el.getAttribute("style");
            const match = style?.match(/url\("(.+?)"\)/);
            return match ? match[1] : null
        })
    )

    return images

   


}

