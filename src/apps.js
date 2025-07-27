import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import connectMongoDB from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import dotenv from "dotenv";
import cartRouter from "./routes/carts.router.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//contamos con mongodb
connectMongoDB();

//puerto que se utilliza para nuestro servidor
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.static("public"));

//endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));