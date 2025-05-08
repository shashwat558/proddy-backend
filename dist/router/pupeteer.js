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
const express_1 = __importDefault(require("express"));
const scraper_1 = require("../utils/scraper");
const reviews_1 = require("../utils/reviews");
const router = express_1.default.Router();
//@ts-ignore
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { url } = (_a = yield req.body) !== null && _a !== void 0 ? _a : "https://www.myntra.com/backpacks/tommy+hilfiger/tommy-hilfiger-pinocchio-unisex-brand-logo-backpack-11-l/27031998/buy";
    console.log(url);
    if (!url) {
        return res.json({ message: "No url provided" });
    }
    try {
        const productDetails = yield (0, scraper_1.getProductDetails)(url);
        const reviews = yield (0, reviews_1.getProductReviews)(url);
        console.log(productDetails, reviews);
        return res.json({ productDetails, reviews });
    }
    catch (error) {
        res.json({ "message": "Error scraping details" });
    }
}));
exports.default = router;
