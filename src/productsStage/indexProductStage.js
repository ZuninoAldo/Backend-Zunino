import ProductManager from "../Managers/productManager.js";
import express from "express"

const app = express();
app.use(express.json());
const productManager = new ProductManager("./productsStage/products.json");

app.get("/", (req, res) => {
    res.json({message: "Hola Server!"});
});

app.get("/api/products", async(req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos" });
    }
});

app.get("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener el producto" });
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await productManager.deleteProductById(pid);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(404).json({ status: "error", message: "Error al eliminar el producto" });
    }
});

app.post("/api/products", express.json(), async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await productManager.addProduct(newProduct);
        res.status(201).json({ status: "success", products });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al agregar el producto" });
    }
});

app.put("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedData = req.body;

        const products = await productManager.updateProductById(pid, updatedData);
        res.status(200).json({ status: "success", products });
    } catch (error) {
        res.status(400).json({ status: "error", message: "Error al actualizar el producto" });
    }
});

app.listen(8080, () => {
    console.log("Servidor activo en el puerto 8080");
});
