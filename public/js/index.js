const socket = io();

const formNewProduct = document.getElementById('formNewProduct');
const productList = document.getElementById('productList');


formNewProduct.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(formNewProduct);
    const productData = {};

    formData.forEach((value, key) => {

        if (key === 'price' || key === 'stock') {
            productData[key] = parseFloat(value);
        } else {
            productData[key] = value;
        }
    });

    socket.emit('newProduct', productData);
    formNewProduct.reset();
});


socket.on('productAdded', (newProduct) => {

    if (newProduct && newProduct.id && newProduct.title && newProduct.price && newProduct.stock) {
        const li = document.createElement('li');
        li.setAttribute('data-id', newProduct.id);
        li.innerHTML = `
            Producto: ${newProduct.title} - $${newProduct.price} - Stock: ${newProduct.stock}
            <button class="delete-button" data-id="${newProduct.id}">Eliminar</button>
        `;
        productList.appendChild(li);
    } else {
        console.error("Producto recibido incompleto o con formato incorrecto:", newProduct);
    }
});


socket.on('productDeleted', (productId) => {

    const productItem = productList.querySelector(`li[data-id="${productId}"]`);
    if (productItem) {
        productList.removeChild(productItem);
        console.log(`Producto con ID ${productId} eliminado del DOM.`);
    } else {
        console.warn(`No se encontró el elemento <li> para el producto con ID ${productId} para eliminar.`);
    }
});

productList.addEventListener('click', (event) => {

    if (event.target.classList.contains('delete-button')) {

        const productId = parseInt(event.target.dataset.id);

        if (!isNaN(productId)) {
            socket.emit('deleteProduct', productId);
            console.log(`Solicitud de eliminación enviada para el producto con ID: ${productId}`);
        } else {
            console.error("ID de producto no válido para eliminar:", event.target.dataset.id);
        }
    }
});