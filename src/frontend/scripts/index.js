// Importar el objeto api
import api from './api.js';

// Elementos del DOM
const productosContainer = document.getElementById('productos-mas-vendidos-container');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Estado de la aplicación
let productos = [];
let carrito = [];

// Funciones para cargar datos
async function cargarProductos() {
    try {
        console.log('Cargando productos...');
        productos = await api.getProductosMasVendidos();
        console.log('Productos cargados:', productos);
        renderizarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('Error al cargar los productos');
    }
}

// Funciones para renderizar datos
function renderizarProductos(productos) {
    console.log('Renderizando productos:', productos);
    productosContainer.innerHTML = '';
    
    if (!productos || productos.length === 0) {
        productosContainer.innerHTML = '<p class="no-products">No hay productos disponibles</p>';
        return;
    }
    
    productos.forEach(producto => {
        console.log('Renderizando producto:', producto);
        const productoElement = document.createElement('div');
        productoElement.classList.add('product-card');
        productoElement.innerHTML = `
            <img src="${producto.imagen || '../img/default.jpg'}" alt="${producto.nombre}">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion || 'Descripción no disponible'}</p>
                <p class="precio">$${producto.precio.toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${producto.id}">Agregar al carrito</button>
            </div>
        `;
        productosContainer.appendChild(productoElement);
    });

    // Agregar event listeners a los botones de "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const producto = productos.find(p => p.id === productId);
            if (producto) {
                agregarAlCarrito(producto);
            }
        });
    });
}

// Funciones para el carrito de compras
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
        itemExistente.subtotal = itemExistente.precio * itemExistente.cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen || '../img/default.jpg',
            cantidad: 1,
            subtotal: producto.precio
        });
    }
    
    actualizarCarrito();
    mostrarMensaje('Producto agregado al carrito');
}

function actualizarCarrito() {
    // Actualizar el contador del carrito
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartCountElement.textContent = totalItems;
    
    // Actualizar la lista de productos en el carrito
    cartItemsContainer.innerHTML = '';
    
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="cart-item-subtotal">Subtotal: $${item.subtotal.toFixed(2)}</div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Agregar event listeners a los botones de cantidad
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                cambiarCantidad(id, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                cambiarCantidad(id, 1);
            });
        });
        
        // Agregar event listeners a los inputs de cantidad
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.id);
                const nuevaCantidad = parseInt(e.target.value);
                if (nuevaCantidad > 0) {
                    actualizarCantidad(id, nuevaCantidad);
                }
            });
        });
        
        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.remove-item').dataset.id);
                eliminarDelCarrito(id);
            });
        });
    }
    
    // Actualizar el total del carrito
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    cartTotalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        const nuevaCantidad = item.cantidad + cambio;
        if (nuevaCantidad > 0) {
            actualizarCantidad(id, nuevaCantidad);
        }
    }
}

function actualizarCantidad(id, nuevaCantidad) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = nuevaCantidad;
        item.subtotal = item.precio * item.cantidad;
        actualizarCarrito();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
    mostrarMensaje('Producto eliminado del carrito');
}

function abrirCarrito() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
}

function cerrarCarrito() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
}

function realizarCompra() {
    if (carrito.length === 0) {
        mostrarError('El carrito está vacío');
        return;
    }
    
    // Aquí se implementaría la lógica para procesar la compra
    // Por ahora, solo mostraremos un mensaje de éxito
    mostrarMensaje('¡Compra realizada con éxito!');
    carrito = [];
    actualizarCarrito();
    cerrarCarrito();
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-success');
    alertElement.textContent = mensaje;
    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-danger');
    alertElement.textContent = mensaje;
    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Event Listeners
cartIcon.addEventListener('click', abrirCarrito);
closeCartBtn.addEventListener('click', cerrarCarrito);
cartOverlay.addEventListener('click', cerrarCarrito);
checkoutBtn.addEventListener('click', realizarCompra);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
}); 