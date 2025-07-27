import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

cartRouter.post("/", async (req, res) => {
    try {
        const cart = new Cart();
        await cart.save();

        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await Cart.findById(cid).populate("products.product");
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }
        res.status(200).json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos del carrito" });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const {cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await Cart.findByIdAndUpdate(cid, { $push: { products: { product: pid, quantity } } }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }
        res.status(201).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al agregar el producto al carrito" });
    }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await Cart.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al eliminar el producto del carrito" });
    }
});

export default cartRouter;