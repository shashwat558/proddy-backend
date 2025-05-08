import express from "express";
import cors from "cors"
import productDetailsRouter from "./router/pupeteer"

const port = 8080;

const app = express();



app.use(express.json());
app.use(cors())

app.use("/scraper", productDetailsRouter)


app.listen(port, () => {
    console.log("Listening to port 8080")
})