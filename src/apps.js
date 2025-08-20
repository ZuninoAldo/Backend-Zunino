import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import Handlebars from "handlebars";
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

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Helper para multiplicar
Handlebars.registerHelper("multiply", (a, b) => a * b);

// Conectar a MongoDB
connectMongoDB();

// Puerto del servidor
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👉 Para manejar formularios
app.use(express.static("public"));

// Rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

// Levantar servidor
server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));