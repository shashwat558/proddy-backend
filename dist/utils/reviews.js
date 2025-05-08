"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductReviews = getProductReviews;
const puppeteer_1 = __importDefault(require("puppeteer"));
function getProductReviews(productUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const parts = productUrl.split("/");
        const productId = parts[parts.length - 2];
        console.log(productId);
        const browser = yield puppeteer_1.default.launch({
            headless: "shell",
            args: ["--disable-blink-features=AutomationControlled", '--no-sandbox', '--disable-setuid-sandbox']
        });
        try {
            const page = yield browser.newPage();
            yield setPage(page);
            yield page.goto(`https://www.myntra.com/reviews/${productId}`, { waitUntil: "domcontentloaded" });
            yield page.setRequestInterception(true);
            page.on("request", (req) => {
                if (req.resourceType() == "stylesheet" || req.resourceType() == "font") {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });
            const reviews = yield getReviews(page);
            console.log(reviews);
            return ({ reviews });
        }
        catch (error) {
            console.log(error);
        }
    });
}
const setPage = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    yield page.evaluate(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
    });
});
const getReviews = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let previousHeight = yield page.evaluate(() => document.body.scrollHeight);
        let reviews = [];
        while (reviews.length <= 20) {
            yield page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            yield page.waitForSelector(".detailed-reviews-userReviewsContainer", {
                timeout: 30000
            });
            const newReviews = yield page.$$eval(".user-review-reviewTextWrapper", elements => elements.map(el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; }) // Get only the first 20 reviews
            );
            if (newReviews.length > reviews.length) {
                reviews = newReviews;
            }
            else {
                break;
            }
            const newHeight = yield page.evaluate(() => document.body.scrollHeight);
            if (newHeight == previousHeight) {
                console.log("Reached to the bottom of the page");
                break;
            }
            previousHeight = newHeight;
        }
        return reviews;
    }
    catch (error) {
        console.log(error);
    }
});
