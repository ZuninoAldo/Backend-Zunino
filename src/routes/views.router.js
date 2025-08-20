import express from 'express';
import ProductManager from '../Managers/productManager.js';
import CartManager from '../Managers/cartManager.js';

const cartManager = new CartManager();
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
    try {
        const { page = 1, limit = 10 } = req.query;

        const productsResult = await productManager.getProducts({ page, limit });
        const products = productsResult.payload.docs;

        let cart;
        const existingCarts = await cartManager.getCarts();
        if (existingCarts.length > 0) {
            cart = existingCarts[0];
        } else {
            const newCart = await cartManager.createCart();
            cart = newCart.payload;
        }

        res.render("home", {
            products,
            hasPrevPage: productsResult.payload.hasPrevPage,
            hasNextPage: productsResult.payload.hasNextPage,
            prevLink: productsResult.payload.hasPrevPage ? `/?page=${productsResult.payload.prevPage}` : null,
            nextLink: productsResult.payload.hasNextPage ? `/?page=${productsResult.payload.nextPage}` : null,
            cartId: cart._id.toString()
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista home");
    }
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

viewsRouter.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await productManager.getProductById(pid);

        if (result.status === "error") {
            return res.status(404).send("Producto no encontrado");
        }

        let cart;
        const existingCarts = await cartManager.getCarts();
        if (existingCarts.length > 0) {
            cart = existingCarts[0];
        } else {
            const newCart = await cartManager.createCart();
            cart = newCart.payload;
        }

        res.render("productDetail", {
            product: result.payload,
            cartId: cart._id.toString()
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de producto");
    }
});

export default viewsRouter;