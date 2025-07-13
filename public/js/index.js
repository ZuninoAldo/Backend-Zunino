const socket = io();

const formNewProduct = document.getElementById('formNewProduct');

formNewProduct.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key) => {
        productData[key] = value;
    });

    socket.emit('newProduct', productData);
    formNewProduct.reset();
})

socket.on('productAdded', (newProduct) => {
    const productList = document.getElementById('productList');
    productList.innerHTML += `<li>Producto: ${newProduct.title} - $${newProduct.price} - Stock: ${newProduct.stock}</li>`;
});