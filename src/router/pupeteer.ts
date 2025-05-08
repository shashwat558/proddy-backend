import express from 'express';
import type { Request, Response } from 'express';
import { getProductDetails } from '../utils/scraper';
import { getProductReviews } from '../utils/reviews';

const router = express.Router();

//@ts-ignore
router.post("/", async (req: Request, res: Response) => {
    const {url} = await req.body ?? "https://www.myntra.com/backpacks/tommy+hilfiger/tommy-hilfiger-pinocchio-unisex-brand-logo-backpack-11-l/27031998/buy";
    console.log(url)

    if(!url){
        return res.json({message: "No url provided"})
    }
    try {
        const [productDetails, reviews] = await Promise.all([getProductDetails(url), getProductReviews(url)]);
        console.log(productDetails, reviews);
        return res.json({productDetails, reviews});
    } catch (error) {
        res.json({"message": "Error scraping details"})
    }
})


export default router;