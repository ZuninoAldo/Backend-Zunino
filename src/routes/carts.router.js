import express from "express";
import CartManager from "../Managers/cartManager.js";

const cartRouter = express.Router();
const cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
    const result = await cartManager.createCart();
    if (result.status === "success") {
        res.status(201).json(result);
    } else {
        res.status(500).json({ status: "error", message: result.message });
    }
});


cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const result = await cartManager.getCartById(cid);
    
    if (result.status === "success") {
        res.status(200).json(result);
    } else {
        res.status(404).json({ status: "error", message: result.message });
    }
});


cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const result = await cartManager.addProductToCart(cid, pid);
    
    if (result.status === "success") {
        res.status(201).json(result);
    } else {
        res.status(400).json({ status: "error", message: result.message });
    }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const result = await cartManager.removeProductFromCart(cid, pid);

    if (result.status === "success") {
        res.status(200).json(result);
    } else {
        res.status(404).json({ status: "error", message: result.message });
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    const result = await cartManager.updateProductQuantity(cid, pid, quantity);
    
    if (result.status === "success") {
        res.status(200).json(result);
    } else {
        res.status(400).json({ status: "error", message: result.message });
    }
});

export default cartRouter;