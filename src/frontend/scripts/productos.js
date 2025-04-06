// Importar el objeto api
import api from './api.js';

// Elementos del DOM
const productosContainer = document.getElementById('productos-container');
const categoriasContainer = document.getElementById('categorias-container');
const carritoContainer = document.getElementById('carrito-container');
const carritoTotal = document.getElementById('carrito-total');
const btnCarrito = document.getElementById('btn-carrito');
const btnCerrarCarrito = document.getElementById('btn-cerrar-carrito');
const btnFiltrar = document.getElementById('btn-filtrar');
const selectCategoria = document.getElementById('select-categoria');
const selectOrdenar = document.getElementById('select-ordenar');
const searchInput = document.getElementById('search-input');

// Estado de la aplicación
let productos = [];
let categorias = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funciones para manejar los productos
async function cargarProductos() {
    try {
        productos = await api.getProductos();
        renderizarProductos(productos);
    } catch (error) {
        mostrarError('Error al cargar los productos');
    }
}

async function cargarCategorias() {
    try {
        categorias = await api.getCategorias();
        renderizarCategorias(categorias);
    } catch (error) {
        mostrarError('Error al cargar las categorías');
    }
}

function renderizarProductos(productos) {
    productosContainer.innerHTML = '';
    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('product-card');
        productoElement.innerHTML = `
            <img src="${producto.imagen || 'img/default.jpg'}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <button class="btn" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        productosContainer.appendChild(productoElement);
    });
}

function renderizarCategorias(categorias) {
    categoriasContainer.innerHTML = '';
    categorias.forEach(categoria => {
        const categoriaElement = document.createElement('div');
        categoriaElement.classList.add('categoria-card');
        categoriaElement.innerHTML = `
            <h3>${categoria.nombre}</h3>
            <p>${categoria.descripcion}</p>
        `;
        categoriasContainer.appendChild(categoriaElement);
    });
}

// Funciones para manejar el carrito
function agregarAlCarrito(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const itemCarrito = carrito.find(item => item.id === productoId);
    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje('Producto agregado al carrito');
}

function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <img src="${item.imagen || 'img/default.jpg'}" alt="${item.nombre}">
            <div>
                <h4>${item.nombre}</h4>
                <p>$${item.precio} x ${item.cantidad}</p>
            </div>
            <button class="btn" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
        `;
        carritoContainer.appendChild(itemElement);
        total += item.precio * item.cantidad;
    });

    carritoTotal.textContent = `Total: $${total}`;
}

function eliminarDelCarrito(productoId) {
    carrito = carrito.filter(item => item.id !== productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje('Producto eliminado del carrito');
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
    mostrarMensaje('Carrito vaciado');
}

// Funciones para filtrar y ordenar productos
function filtrarProductos() {
    let productosFiltrados = [...productos];

    // Filtrar por categoría
    const categoriaSeleccionada = selectCategoria.value;
    if (categoriaSeleccionada) {
        productosFiltrados = productosFiltrados.filter(producto => producto.categoria_id === parseInt(categoriaSeleccionada));
    }

    // Filtrar por búsqueda
    const busqueda = searchInput.value.toLowerCase();
    if (busqueda) {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.nombre.toLowerCase().includes(busqueda) || 
            producto.descripcion.toLowerCase().includes(busqueda)
        );
    }

    // Ordenar productos
    const ordenSeleccionado = selectOrdenar.value;
    switch (ordenSeleccionado) {
        case 'precio-asc':
            productosFiltrados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosFiltrados.sort((a, b) => b.precio - a.precio);
            break;
        case 'nombre-asc':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'nombre-desc':
            productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
    }

    renderizarProductos(productosFiltrados);
}

// Funciones para mostrar mensajes
function mostrarMensaje(mensaje) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-success');
    alertElement.textContent = mensaje;
    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

function mostrarError(mensaje) {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert', 'alert-danger');
    alertElement.textContent = mensaje;
    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Event listeners
btnCarrito.addEventListener('click', () => {
    document.getElementById('carrito').classList.add('active');
});

btnCerrarCarrito.addEventListener('click', () => {
    document.getElementById('carrito').classList.remove('active');
});

btnFiltrar.addEventListener('click', filtrarProductos);

selectCategoria.addEventListener('change', filtrarProductos);

selectOrdenar.addEventListener('change', filtrarProductos);

searchInput.addEventListener('input', filtrarProductos);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCategorias();
    actualizarCarrito();
}); 