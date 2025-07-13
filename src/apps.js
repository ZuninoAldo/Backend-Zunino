import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./productsStage/productManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//puerto que se utilliza para nuestro servidor
const PORT =  8080;

app.use(express.json());

app.use(express.static("public"));

//endpoints
app.use("/", viewsRouter);

//websocket
const productManager = new ProductManager("./src/productsStage/products.json");
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async(productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            io.emit("productAdded", newProduct);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }

        socket.on("deleteProduct", async (productId) => {
            try {
                await productManager.deleteProductById(productId);
                io.emit("productDeleted", productId);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                
            }
        });
    });
});

server.listen(PORT, ()=> console.log(`Servidor escuchando en el puerto ${PORT}`));