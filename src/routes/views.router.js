import express from 'express';

import ProductManager from '../Managers/productManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager();


const renderProductsPage = async (req, res, viewName) => {
    try {

        const result = await productManager.getProducts(req.query);

        if (result.status === "error") {
            return res.status(500).send({ message: result.message });
        }


        const { docs: products, totalPages, page, hasPrevPage, hasNextPage, prevPage, nextPage } = result.payload;


        const prevLink = hasPrevPage ? `/?page=${prevPage}&limit=${req.query.limit || 10}` : null;
        const nextLink = hasNextPage ? `/?page=${nextPage}&limit=${req.query.limit || 10}` : null;
        

        res.render(viewName, {
            products,
            totalPages,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

viewsRouter.get("/", async (req, res) => {
    await renderProductsPage(req, res, "home");
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    await renderProductsPage(req, res, "realtimeproducts");
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const result = await cartManager.getCartById(cid);

        if (result.status === "error") {
            return res.status(404).send(`<h1>Carrito no encontrado</h1>`);
        }
        
        const cart = result.payload;
        
        let totalPrice = 0;
        cart.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        res.render("cart", { 
            title: `Carrito de Compras`,
            cart: cart,
            totalPrice: totalPrice 
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default viewsRouter;