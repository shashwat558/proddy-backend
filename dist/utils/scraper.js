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
exports.getProductDetails = getProductDetails;
const puppeteer_1 = __importDefault(require("puppeteer"));
function getProductDetails(productUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const parts = productUrl.split("/");
        const productId = parts[parts.length - 2];
        console.log(productId);
        const browser = yield puppeteer_1.default.launch({
            headless: "shell",
            args: ["--disable-blink-features=AutomationControlled", '--no-sandbox', '--disable-setuid-sandbox'],
        });
        try {
            const page = yield browser.newPage();
            yield setPage(page);
            yield page.goto(productUrl, { waitUntil: "domcontentloaded" });
            yield page.setRequestInterception(true);
            page.on("request", (req) => {
                if (req.resourceType() == "stylesheet" && req.resourceType() == "font") {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });
            const [titleText, productName, price, mrp, seller, productInfo, images] = yield Promise.all([
                getTextContent(page, ".pdp-title"),
                getTextContent(page, ".pdp-name"),
                getTextContent(page, ".pdp-price"),
                getTextContent(page, ".pdp-mrp"),
                getTextContent(page, ".supplier-productSellerName"),
                getTextContent(page, ".pdp-product-description-content"),
                getImages(page, ".image-grid-imageContainer"),
                // getImages(page, ".expiryDate-container"),
            ]);
            return ({ titleText, productName, price, mrp, seller, productInfo, images });
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
    yield page.setViewport({ width: 1024, height: 1080 });
});
const getTextContent = (page, selector) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield page.waitForSelector(selector, { timeout: 6000 });
        const textElement = yield page.$(selector);
        if (!textElement)
            return "N/A";
        const text = yield page.evaluate((el) => (el === null || el === void 0 ? void 0 : el.textContent) || "N/A", textElement);
        return text !== null && text !== void 0 ? text : "";
    }
    catch (error) {
        console.log(error);
        return "N/A";
    }
});
const getImages = (page, selector) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.waitForSelector(selector);
    //   await page.waitForNavigation({ waitUntil: 'load' });
    const images = yield page.$$eval(".image-grid-image", elements => elements.map((el) => {
        const style = el.getAttribute("style");
        const match = style === null || style === void 0 ? void 0 : style.match(/url\("(.+?)"\)/);
        return match ? match[1] : null;
    }));
    return images;
});
