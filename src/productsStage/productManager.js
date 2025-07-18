import fs from 'fs';

class ProductManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    generateNewId(products) {
        if (products.length > 0) {
            return products[products.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    async addProduct(newProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);

            const codeExists = products.some(product => product.code === newProduct.code);
            if (codeExists) {
                throw new Error(`Ya existe un producto con el código "${newProduct.code}".`);
            }

            const newId = this.generateNewId(products);
            const product = { id: newId, ...newProduct };
            products.push(product);

            await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2), 'utf-8');
            return product;
        } catch (error) {
            throw new Error('Error al agregar el nuevo producto: ' + error.message);
        }
    }

    async getProducts() {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);

            return products;
        } catch (error) {
            throw new Error('Error al obtener los productos');
        }
    }

    async getProductById(id) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(fileData);

            const product = products.find((prod) => prod.id === parseInt(id));

            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado.`);
            }
            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto por ID: ' + error.message);
        }
    }

    async deleteProductById(idProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const data = JSON.parse(fileData);
            const productIndex = data.findIndex((prod) => prod.id === parseInt(idProduct));

            if (productIndex === -1) throw new Error(`Producto con ID ${idProduct} no encontrado.`);
            data.splice(productIndex, 1);

            await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), 'utf-8');
            return data;
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }

    async updateProductById(idProduct, updatedProduct) {
        try {
            const fileData = await fs.promises.readFile(this.pathFile, 'utf-8');
            const data = JSON.parse(fileData);
            const productIndex = data.findIndex((prod) => prod.id === parseInt(idProduct));
            if (productIndex === -1) throw new Error(`Producto con ID ${idProduct} no encontrado.`);

            data[productIndex] = { ...data[productIndex], ...updatedProduct };
            await fs.promises.writeFile(this.pathFile, JSON.stringify(data, null, 2), 'utf-8');
            return data;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

}

export default ProductManager;