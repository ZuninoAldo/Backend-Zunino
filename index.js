import ProductManager from "./productManager.js";

const main = async() => {

    try {
        const productManager = new ProductManager("./products.json");

        await productManager.addProduct({ 
            title: "Cooler RGB",
            description: "Un cooler RGB de alta calidad.",
            price: 9,
            thumbnail: "https://example.com/image5.jpg",
            code: "CL005",
            stock: 21
        });
        const products = await productManager.getProducts();
        console.table(products);
    } catch (error) {
        console.log(error.message);
    }

}

main();