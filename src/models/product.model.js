import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: { type: String, index: "text" },
    price: Number,
    thumbnail: { type: Array, default: [] },
    code: { type: String, unique: true },
    stock: Number,
    category: { type: String, index: true },
    status: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now() },
});

productSchema.plugin(paginate);

const Product = mongoose.model("Product", productSchema);




export default Product;