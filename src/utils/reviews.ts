import puppeteer, { Page } from "puppeteer";

export async function getProductReviews(productUrl:string){
    

    const parts = productUrl.split("/");
    const productId = parts[parts.length - 2];
    console.log(productId)

    const browser = await puppeteer.launch({
        headless: "shell",

        args: ["--disable-blink-features=AutomationControlled", '--no-sandbox', '--disable-setuid-sandbox']
    })

    try {

        const page = await browser.newPage();
        await setPage(page);
        await page.goto( `https://www.myntra.com/reviews/${productId}`, {waitUntil: "domcontentloaded"});
        
        await page.setRequestInterception(true)
        page.on("request", (req) => {
            if(req.resourceType() == "stylesheet" || req.resourceType() == "font"){
                req.abort()
            } else {
                req.continue()
            } 

        })

        const reviews = await getReviews(page);
        console.log(reviews)
        return ({reviews})

        

        
    } catch (error) {
       console.log(error) 
    }
}

const setPage = async (page: Page) => {
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

await page.evaluate(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
});
}


const getReviews = async (page: Page) => {


    try{ 

           let previousHeight = await page.evaluate(() => document.body.scrollHeight)
           let reviews: string[] = [];

           while(reviews.length <= 20){
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight)
            })
           

        
            

        await page.waitForSelector(".detailed-reviews-userReviewsContainer", {
                timeout: 30000
            });
            

        const newReviews = await page.$$eval(".user-review-reviewTextWrapper", elements => 
                elements.map(el => el.textContent?.trim() || "") // Get only the first 20 reviews
            );

        if(newReviews.length > reviews.length){
            reviews = newReviews;
           
        } else {
            break

        }
        const  newHeight = await page.evaluate(() => document.body.scrollHeight);
        
        if(newHeight == previousHeight){
            console.log("Reached to the bottom of the page")
            break;

        }
        previousHeight = newHeight

        
        



        
           

        
    }
    return reviews
}catch(error){
        console.log(error)
    }

}