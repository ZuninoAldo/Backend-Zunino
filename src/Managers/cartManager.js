import fs from 'fs';

class CartManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId(carts) {
        if (carts.length > 0) {
            return carts[carts.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    async addNewCart(cart) {
        try {
            let fileData = '[]';
            if (fs.existsSync(this.pathFile)) {
                fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
                if (fileData.trim() === '') {
                    fileData = '[]';
                }
            }
            const carts = JSON.parse(fileData);

            const newId = this.generateNewId(carts);
            const newCart = { id: newId, ...cart };
            carts.push(newCart);

            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');
            return newCart;
        } catch (error) {
            throw new Error('Error al crear un nuevo carrito: ' + error.message);
        }
    }

    async getCartProducts(cartId) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const carts = JSON.parse(fileData);

            const cart = carts.find(cart => cart.id === parseInt(cartId));
            if (!cart) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            return cart.products;
        } catch (error) {
            throw new Error('Error al obtener los productos del carrito: ' + error.message);
        }
    }

    async addProductToCart(cartId, productData) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const carts = JSON.parse(fileData);

            const parsedCartId = parseInt(cartId);
            const cartIndex = carts.findIndex(c => c.id === parsedCartId);

            if (cartIndex === -1) {
                throw new Error(`Carrito con ID ${cartId} no encontrado.`);
            }

            const cart = carts[cartIndex];

            if (!cart.products) {
                cart.products = [];
            }

            const productId = parseInt(productData.id);
            const existingProduct = cart.products.find(p => p.id === productId);

            if (existingProduct) {

                existingProduct.quantity += (productData.quantity || 1);
            } else {
                cart.products.push({
                    id: productId,
                    title: productData.title,
                    description: productData.description,
                    quantity: productData.quantity || 1
                });
            }

            carts[cartIndex] = cart;

            await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2), 'utf-8');
            return cart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }


}

export default CartManager;