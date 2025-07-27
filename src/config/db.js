import mongoose from "mongoose";
import Product from "../models/product.model.js";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.syncIndexes();
        console.log("Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
};

export default connectMongoDB;
