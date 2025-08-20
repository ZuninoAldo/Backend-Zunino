
import express from "express";

import ProductManager from "../Managers/productManager.js";

const productsRouter = express.Router();
const productManager = new ProductManager();


productsRouter.get("/", async (req, res) => {

    const result = await productManager.getProducts(req.query);

    if (result.status === "success") {

        const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = result.payload;
        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

        res.status(200).json({
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } else {
        res.status(500).json({ status: "error", message: result.message });
    }
});


productsRouter.post("/", async (req, res) => {

    const result = await productManager.addProduct(req.body);

    if (result.status === "success") {
        res.status(201).json(result);
    } else {

        res.status(400).json({ status: "error", message: result.message });
    }
});


productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;

    const result = await productManager.updateProductById(pid, updateData);

    if (result.status === "success") {
        res.status(200).json(result);
    } else {
        res.status(404).json({ status: "error", message: result.message });
    }
});


productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const result = await productManager.deleteProductById(pid);

    if (result.status === "success") {
        res.status(200).json(result);
    } else {
        res.status(404).json({ status: "error", message: result.message });
    }
});

export default productsRouter;