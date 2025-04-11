// Importar el objeto api
import { api } from './api.js';

// Variables globales
let productos = [];
let categorias = [];
let productoSeleccionado = null;
let carrito = [];

// Elementos del DOM
const productosGrid = document.getElementById('productosGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const productoDetalleModal = document.getElementById('productoDetalleModal');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

// Cargar datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    await cargarCategorias();
    await cargarProductos();
    initEventListeners();
});

// Función para cargar productos
async function cargarProductos() {
    try {
        const response = await api.getProductos();
        productos = response.data;
        renderizarProductos(productos);
    } catch (error) {
        mostrarMensaje('Error al cargar los productos', 'error');
    }
}

// Función para cargar categorías
async function cargarCategorias() {
    try {
        const response = await api.getCategorias();
        categorias = response.data;
        actualizarSelectCategorias();
    } catch (error) {
        mostrarMensaje('Error al cargar las categorías', 'error');
    }
}

// Función para actualizar el select de categorías
function actualizarSelectCategorias() {
    categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        categoryFilter.appendChild(option);
    });
}

// Función para renderizar productos en cards
function renderizarProductos(productos) {
    productosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${producto.imagen_url || 'ruta/a/imagen/por/defecto.jpg'}" alt="${producto.nombre_producto}">
            <div class="product-info">
                <span class="product-category">${producto.nombre_categoria || 'Sin categoría'}</span>
                <h3>${producto.nombre_producto}</h3>
                <p>${producto.descripcion || 'Sin descripción'}</p>
                <div class="product-footer">
                    <span class="precio">$${producto.precio}</span>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="mostrarDetalleProducto(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productosGrid.appendChild(card);
    });
}

// Función para mostrar detalle del producto
function mostrarDetalleProducto(producto) {
    productoSeleccionado = producto;
    
    document.getElementById('modalProductoImagen').src = producto.imagen_url || 'ruta/a/imagen/por/defecto.jpg';
    document.getElementById('modalProductoTitulo').textContent = producto.nombre_producto;
    document.getElementById('modalProductoDescripcion').textContent = producto.descripcion || 'Sin descripción';
    document.getElementById('modalProductoCategoria').textContent = producto.nombre_categoria || 'Sin categoría';
    document.getElementById('modalProductoPrecio').textContent = `$${producto.precio}`;
    
    productoDetalleModal.style.display = 'block';
}

// Funciones del carrito
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id_producto === producto.id_producto);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    mostrarMensaje('Producto agregado al carrito', 'success');
}

function actualizarCarrito() {
    cartItems.innerHTML = '';
    let total = 0;
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i>El carrito está vacío</div>';
    } else {
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imagen_url || 'ruta/a/imagen/por/defecto.jpg'}" alt="${item.nombre_producto}">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.nombre_producto}</h4>
                    <p class="cart-item-price">$${item.precio}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad - 1})">-</button>
                        <span>${item.cantidad}</span>
                        <button class="quantity-btn" onclick="actualizarCantidad(${item.id_producto}, ${item.cantidad + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="eliminarDelCarrito(${item.id_producto})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    cartCount.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

function actualizarCantidad(idProducto, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(idProducto);
        return;
    }
    
    const item = carrito.find(item => item.id_producto === idProducto);
    if (item) {
        item.cantidad = nuevaCantidad;
        actualizarCarrito();
    }
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id_producto !== idProducto);
    actualizarCarrito();
}

// Función para filtrar productos
function filtrarProductos() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoriaId = categoryFilter.value;
    
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre_producto.toLowerCase().includes(searchTerm) ||
            (producto.descripcion && producto.descripcion.toLowerCase().includes(searchTerm));
        
        const coincideCategoria = !categoriaId || producto.id_categoria === parseInt(categoriaId);
        
        return coincideBusqueda && coincideCategoria;
    });
    
    renderizarProductos(productosFiltrados);
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo}`;
    alertDiv.textContent = mensaje;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Inicializar event listeners
function initEventListeners() {
    // Event listeners para filtros
    searchInput.addEventListener('input', filtrarProductos);
    categoryFilter.addEventListener('change', filtrarProductos);
    
    // Event listeners para el carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.style.display = 'block';
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.style.display = 'none';
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.style.display = 'none';
    });
    
    // Event listener para cerrar el modal de detalles
    window.addEventListener('click', (event) => {
        if (event.target === productoDetalleModal) {
            productoDetalleModal.style.display = 'none';
        }
    });
    document.querySelector('#productoDetalleModal .close').addEventListener('click', () => {
        productoDetalleModal.style.display = 'none';
    });
}

function verificarAutenticacion() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado'); // O utiliza cookies, según tu sistema
    return usuarioLogueado !== null;
}

// Evento para el botón de "Proceder al pago"
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (verificarAutenticacion()) {
        // Si está logueado, puedes redirigir a la página de pago
        window.location.href = "pagina_pago.html"; // Reemplaza por la URL de la página de pago
    } else {
        // Si no está logueado, redirige a la página de inicio de sesión
        window.location.href = "inicioSesion.html"; // Reemplaza por la URL de la página de login
    }
});

// Exportar funciones para uso global
window.mostrarDetalleProducto = mostrarDetalleProducto;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarCantidad = actualizarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito; 