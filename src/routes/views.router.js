import express from 'express';
import ProductManager from '../productsStage/productManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/productsStage/products.json");

viewsRouter.get("/", async(req, res)=> {
    try {
        const products = await productManager.getProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

viewsRouter.get("/realtimeproducts", async(req, res)=> {
    try {
        const products = await productManager.getProducts();
        res.render("realtimeproducts", { products });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default viewsRouter;