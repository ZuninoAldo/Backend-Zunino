
import Product from '../models/product.model.js';

class ProductManager {

    constructor() {
        console.log("ProductManager funcionando con MongoDB.");
    }

    async getProducts(params) {

        const { limit = 10, page = 1, sort, query } = params;

        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true
        };


        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }


        const filter = query ? { category: query } : {};

        try {

            const result = await Product.paginate(filter, options);
            return { status: "success", payload: result };
        } catch (error) {
            return { status: "error", message: "Error al obtener los productos: " + error.message };
        }
    }

    async addProduct(productData) {

        const { title, description, price, code, stock, category } = productData;
        if (!title || !description || !price || !code || !stock || !category) {
            return { status: "error", message: "Faltan campos obligatorios para crear el producto." };
        }

        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            return { status: "success", payload: newProduct };
        } catch (error) {

            if (error.code === 11000) {
                return { status: "error", message: `El código "${code}" ya existe.` };
            }
            return { status: "error", message: "Error al agregar el producto: " + error.message };
        }
    }

    async updateProductById(pid, updateData) {

        delete updateData.code;
        delete updateData._id;

        try {
            const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, { new: true });
            if (!updatedProduct) {
                return { status: "error", message: "Producto no encontrado." };
            }
            return { status: "success", payload: updatedProduct };
        } catch (error) {
            return { status: "error", message: "Error al actualizar el producto: " + error.message };
        }
    }


    async getProductById(pid) {
        try {
            const product = await Product.findById(pid);
            if (!product) {
                return { status: "error", message: "Producto no encontrado." };
            }
            return { status: "success", payload: product };
        } catch (error) {
            return { status: "error", message: "Error al buscar el producto: " + error.message };
        }
    }

    async deleteProductById(pid) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(pid);
            if (!deletedProduct) {
                return { status: "error", message: "Producto no encontrado." };
            }
            return { status: "success", payload: deletedProduct };
        } catch (error) {
            return { status: "error", message: "Error al eliminar el producto: " + error.message };
        }
    }
}

export default ProductManager;