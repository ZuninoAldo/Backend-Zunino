import CartManager from "../Managers/cartManager.js";
import express from "express";

const app = express();
app.use(express.json());
const cartManager = new CartManager("./cartStage/cart.json");

app.get("/", (req, res) => {
    res.json({message: "Hola Server!"});
});

app.post("/api/carts", async (req, res) => {
    try {
        const newCart = req.body;
        const Cart = await cartManager.addNewCart(newCart);
        res.status(201).json({ status: "success", Cart });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al crear el carrito." });
    }
});

app.get("/api/carts/:id/products", async (req, res) => {
    const cartId = parseInt(req.params.id);
    try {
        const products = await cartManager.getCartProducts(cartId);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(404).json({ status: "error", message: "Carrito no encontrado o sin productos." });
    }
});

app.post("/api/carts/:id/products", async (req, res) => {
    const cartId = parseInt(req.params.id);
    const productData = req.body;
    try {
        const updatedCart = await cartManager.addProductToCart(cartId, productData);
        res.status(200).json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito: " + error.message });
    }
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
