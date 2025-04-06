// Importar el objeto api
import api from './api.js';

// Elementos del DOM
const stockTbody = document.getElementById('stock-tbody');
const searchInput = document.getElementById('search-input');
const selectCategoria = document.getElementById('select-categoria');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnAgregar = document.getElementById('btn-agregar');
const modalAgregar = document.getElementById('modal-agregar');
const modalEditar = document.getElementById('modal-editar');
const formAgregarStock = document.getElementById('form-agregar-stock');
const formEditarStock = document.getElementById('form-editar-stock');
const productoIdSelect = document.getElementById('producto-id');
const editProductoIdSelect = document.getElementById('edit-producto-id');

// Estado de la aplicación
let stock = [];
let productos = [];
let categorias = [];

// Funciones para cargar datos
async function cargarStock() {
    try {
        stock = await api.getStock();
        renderizarStock(stock);
    } catch (error) {
        mostrarError('Error al cargar el stock');
    }
}

async function cargarProductos() {
    try {
        productos = await api.getProductos();
        renderizarSelectProductos(productoIdSelect, productos);
        renderizarSelectProductos(editProductoIdSelect, productos);
    } catch (error) {
        mostrarError('Error al cargar los productos');
    }
}

async function cargarCategorias() {
    try {
        categorias = await api.getCategorias();
        renderizarSelectCategorias(selectCategoria, categorias);
    } catch (error) {
        mostrarError('Error al cargar las categorías');
    }
}

// Funciones para renderizar datos
function renderizarStock(stock) {
    stockTbody.innerHTML = '';
    stock.forEach(item => {
        const producto = productos.find(p => p.id === item.producto_id);
        const categoria = categorias.find(c => c.id === producto?.categoria_id);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${producto?.nombre || 'N/A'}</td>
            <td>${categoria?.nombre || 'N/A'}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>
                <button class="btn" onclick="editarStock(${item.id})">Editar</button>
                <button class="btn" onclick="eliminarStock(${item.id})">Eliminar</button>
            </td>
        `;
        stockTbody.appendChild(tr);
    });
}

function renderizarSelectProductos(select, productos) {
    select.innerHTML = '<option value="">Seleccione un producto</option>';
    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = producto.nombre;
        select.appendChild(option);
    });
}

function renderizarSelectCategorias(select, categorias) {
    select.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

// Funciones para manejar el stock
async function agregarStock(event) {
    event.preventDefault();
    const productoId = document.getElementById('producto-id').value;
    const cantidad = document.getElementById('cantidad').value;
    const precio = document.getElementById('precio').value;

    try {
        await api.createStock({
            producto_id: parseInt(productoId),
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio)
        });
        modalAgregar.classList.remove('active');
        formAgregarStock.reset();
        cargarStock();
        mostrarMensaje('Stock agregado correctamente');
    } catch (error) {
        mostrarError('Error al agregar el stock');
    }
}

async function editarStock(id) {
    const item = stock.find(s => s.id === id);
    if (!item) return;

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-producto-id').value = item.producto_id;
    document.getElementById('edit-cantidad').value = item.cantidad;
    document.getElementById('edit-precio').value = item.precio;

    modalEditar.classList.add('active');
}

async function actualizarStock(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const productoId = document.getElementById('edit-producto-id').value;
    const cantidad = document.getElementById('edit-cantidad').value;
    const precio = document.getElementById('edit-precio').value;

    try {
        await api.updateStock(id, {
            producto_id: parseInt(productoId),
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio)
        });
        modalEditar.classList.remove('active');
        formEditarStock.reset();
        cargarStock();
        mostrarMensaje('Stock actualizado correctamente');
    } catch (error) {
        mostrarError('Error al actualizar el stock');
    }
}

async function eliminarStock(id) {
    if (!confirm('¿Está seguro de eliminar este stock?')) return;

    try {
        await api.deleteStock(id);
        cargarStock();
        mostrarMensaje('Stock eliminado correctamente');
    } catch (error) {
        mostrarError('Error al eliminar el stock');
    }
}

// Funciones para filtrar stock
function filtrarStock() {
    let stockFiltrado = [...stock];

    // Filtrar por búsqueda
    const busqueda = searchInput.value.toLowerCase();
    if (busqueda) {
        stockFiltrado = stockFiltrado.filter(item => {
            const producto = productos.find(p => p.id === item.producto_id);
            return producto?.nombre.toLowerCase().includes(busqueda);
        });
    }

    // Filtrar por categoría
    const categoriaSeleccionada = selectCategoria.value;
    if (categoriaSeleccionada) {
        stockFiltrado = stockFiltrado.filter(item => {
            const producto = productos.find(p => p.id === item.producto_id);
            return producto?.categoria_id === parseInt(categoriaSeleccionada);
        });
    }

    renderizarStock(stockFiltrado);
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
btnAgregar.addEventListener('click', () => {
    modalAgregar.classList.add('active');
});

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modalAgregar.classList.remove('active');
        modalEditar.classList.remove('active');
    });
});

formAgregarStock.addEventListener('submit', agregarStock);
formEditarStock.addEventListener('submit', actualizarStock);
btnFiltrar.addEventListener('click', filtrarStock);
searchInput.addEventListener('input', filtrarStock);
selectCategoria.addEventListener('change', filtrarStock);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarStock();
    cargarProductos();
    cargarCategorias();
}); 