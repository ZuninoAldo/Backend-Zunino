import fs from 'fs';

class ProductManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
}

generateNewId(products){
    if (products.length > 0){
        return products[products.length - 1].id + 1;
    }else {
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
        console.log(`Producto "${newProduct.title}" agregado exitosamente con ID ${newId}.`);
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

        const product = products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
        }
        return product;
    } catch (error) {
        throw new Error('Error al obtener el producto por ID: ' + error.message);
    }
}
}

export default ProductManager;