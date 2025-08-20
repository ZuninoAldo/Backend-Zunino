import Cart from '../models/cart.model.js';
import ProductManager from './productManager.js';

const productManager = new ProductManager();

class CartManager {
    constructor() {
        console.log("CartManager funcionando con MongoDB.");
    }

    async createCart() {
        try {
            const newCart = new Cart();
            await newCart.save();
            return { status: "success", payload: newCart };
        } catch (error) {
            return { status: "error", message: "Error al crear el carrito: " + error.message };
        }
    }

    async getCartById(cid) {
        try {
            const cart = await Cart.findById(cid).populate("products.product").lean();
            if (!cart) {
                return { status: "error", message: "Carrito no encontrado." };
            }
            return { status: "success", payload: cart };
        } catch (error) {
            return { status: "error", message: "Error al obtener el carrito: " + error.message };
        }
    }

    async addProductToCart(cid, pid) {

        const productCheck = await productManager.getProductById(pid);
        if (productCheck.status === 'error') {
            return { status: "error", message: "El producto que intentas agregar no existe." };
        }

        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return { status: "error", message: "Carrito no encontrado." };
            }


            const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

            if (productIndex !== -1) {

                cart.products[productIndex].quantity += 1;
            } else {

                cart.products.push({ product: pid, quantity: 1 });
            }

            await cart.save();
            return { status: "success", payload: cart };

        } catch (error) {
            return { status: "error", message: "Error al agregar producto al carrito: " + error.message };
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return { status: "error", message: "Carrito no encontrado." };
            }


            cart.products.pull({ product: pid });

            await cart.save();
            return { status: "success", payload: cart };
        } catch (error) {
            return { status: "error", message: "Error al eliminar el producto del carrito: " + error.message };
        }
    }


    async updateCart(cid, products) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return { status: "error", message: "Carrito no encontrado." };
            }

            cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
            await cart.save();
            return { status: "success", payload: cart };
        } catch (error) {
            return { status: "error", message: "Error al actualizar el carrito: " + error.message };
        }
    }

    async emptyCart(cid) {
        try {
            const cart = await Cart.findById(cid);
            if (!cart) {
                return { status: "error", message: "Carrito no encontrado." };
            }
            cart.products = []; // Seteamos el array de productos a vacío
            await cart.save();
            return { status: "success", payload: cart };
        } catch (error) {
            return { status: "error", message: "Error al vaciar el carrito: " + error.message };
        }
    }

async updateProductQuantity(cid, pid, quantity) {

    if (typeof quantity !== 'number' || quantity <= 0) {
        return { status: "error", message: "La cantidad debe ser un número positivo." };
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return { status: "error", message: "Carrito no encontrado." };
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            return { status: "error", message: "Producto no encontrado en el carrito." };
        }
        

        cart.products[productIndex].quantity = quantity;

        await cart.save();
        return { status: "success", payload: cart };
    } catch (error) {
        return { status: "error", message: "Error al actualizar la cantidad del producto: " + error.message };
    }
}
}

export default CartManager;