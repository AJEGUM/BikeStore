// Importar el objeto api
import { api } from './api.js';

// Elementos del DOM
const stockTableBody = document.getElementById('stock-table-body');
const categorySelect = document.getElementById('category-select');
const stockModal = document.getElementById('stock-modal');
const modalTitle = document.getElementById('modal-title');
const stockForm = document.getElementById('stock-form');
const productoSelect = document.getElementById('producto');

// Estado de la aplicación
let productos = [];
let categorias = [];
let stock = [];

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que el modal esté oculto al cargar la página
    stockModal.style.display = 'none';
    
    cargarCategorias();
    cargarProductos();
});

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

// Función para cargar productos
async function cargarProductos() {
    try {
        const response = await api.getProductos();
        productos = response.data;
        actualizarSelectProductos();
    } catch (error) {
        mostrarMensaje('Error al cargar los productos', 'error');
    }
}

// Función para actualizar el select de categorías
function actualizarSelectCategorias() {
    categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        categorySelect.appendChild(option);
    });
}

// Función para actualizar el select de productos
function actualizarSelectProductos(categoriaId = '') {
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    
    const productosFiltrados = categoriaId 
        ? productos.filter(p => p.id_categoria === parseInt(categoriaId))
        : productos;
    
    productosFiltrados.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id_producto;
        option.textContent = producto.nombre_producto;
        productoSelect.appendChild(option);
    });
}

// Función para renderizar productos en la tabla
function renderizarProductos(categoriaId = '') {
    stockTableBody.innerHTML = '';
    
    const productosFiltrados = categoriaId 
        ? productos.filter(p => p.id_categoria === parseInt(categoriaId))
        : productos;
    
    productosFiltrados.forEach(producto => {
        const categoria = categorias.find(c => c.id_categoria === producto.id_categoria);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre_producto}</td>
            <td>${categoria ? categoria.nombre_categoria : 'Sin categoría'}</td>
            <td>${producto.stock || 0}</td>
            <td>$${producto.precio}</td>
            <td>
                <button class="btn-edit" onclick="window.editarStock(${producto.id_producto})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        stockTableBody.appendChild(tr);
    });
}

// Función para abrir el modal de stock
function abrirModalStock(productoId = null) {
    const producto = productoId ? productos.find(p => p.id_producto === productoId) : null;
    
    modalTitle.textContent = producto ? `Actualizar Stock: ${producto.nombre_producto}` : 'Agregar Stock';
    
    if (producto) {
        document.getElementById('producto').value = producto.id_producto;
        document.getElementById('cantidad').value = producto.stock || 0;
        document.getElementById('precio').value = producto.precio;
    } else {
        document.getElementById('producto').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('precio').value = '';
    }
    
    stockModal.style.display = 'block';
    // Dar tiempo al navegador para procesar el display block
    requestAnimationFrame(() => {
        stockModal.classList.add('show');
    });
}

// Función para cerrar el modal de stock
function cerrarModalStock() {
    stockModal.classList.remove('show');
    // Esperar a que termine la animación antes de ocultar el modal
    setTimeout(() => {
        stockModal.style.display = 'none';
        stockForm.reset();
    }, 300); // El tiempo debe coincidir con la duración de la transición en CSS
}

// Función para guardar stock
async function guardarStock(event) {
    event.preventDefault();
    
    const productoId = document.getElementById('producto').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;
    
    if (!productoId) {
        mostrarMensaje('Debe seleccionar un producto', 'error');
        return;
    }
    
    // Validar que los valores sean números válidos
    const stockNumerico = parseInt(cantidad);
    const precioNumerico = parseFloat(precio);
    
    if (isNaN(stockNumerico)) {
        mostrarMensaje('La cantidad debe ser un número válido', 'error');
        return;
    }
    
    if (isNaN(precioNumerico)) {
        mostrarMensaje('El precio debe ser un número válido', 'error');
        return;
    }
    
    try {
        console.log('Enviando datos:', {
            productoId,
            stock: stockNumerico,
            precio: precioNumerico
        });
        
        // Crear un objeto con los datos a actualizar
        const productoData = {
            stock: stockNumerico,
            precio: precioNumerico
        };
        
        // Llamar a la API para actualizar el producto
        const response = await api.updateProducto(productoId, productoData);
        console.log('Respuesta del servidor:', response);
        
        if (response.status === 'success') {
            mostrarMensaje(response.message || 'Stock actualizado exitosamente', 'success');
            cerrarModalStock();
            await cargarProductos();
            renderizarProductos(categorySelect.value);
        } else {
            mostrarMensaje(response.message || 'Error al actualizar el stock', 'error');
        }
    } catch (error) {
        console.error('Error detallado al actualizar stock:', error);
        mostrarMensaje(error.message || 'Error al actualizar el stock', 'error');
    }
}

// Función para editar stock
async function editarStock(id) {
    try {
        const response = await api.getProducto(id);
        abrirModalStock(id);
    } catch (error) {
        mostrarMensaje('Error al cargar el producto', 'error');
    }
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

// Event Listeners
categorySelect.addEventListener('change', (e) => {
    const categoriaId = e.target.value;
    renderizarProductos(categoriaId);
    actualizarSelectProductos(categoriaId);
});

stockForm.addEventListener('submit', guardarStock);

// Cerrar modal al hacer clic en la X
document.querySelector('.close').addEventListener('click', cerrarModalStock);

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === stockModal) {
        cerrarModalStock();
    }
});

// Exportar funciones para uso global
window.editarStock = editarStock;
window.cerrarModalStock = cerrarModalStock; 