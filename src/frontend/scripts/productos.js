import { api } from './api.js';

// Elementos del DOM
const productosTable = document.getElementById('productosTable');
const searchInputProductos = document.getElementById('searchInputProductos');
const filterButtonProductos = document.getElementById('filterButtonProductos');
const addButtonProducto = document.getElementById('addButtonProducto');
const categorySelect = document.getElementById('category-select');
const productoModal = document.getElementById('productoModal');
const modalTitleProducto = document.getElementById('modalTitleProducto');
const productoForm = document.getElementById('productoForm');

// Estado de la aplicación
let productos = [];
let categorias = [];
let productoEditando = null;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarCategorias();
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
    const categoriaSelect = document.getElementById('id_categoria');
    categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        categoriaSelect.appendChild(option);
    });

    // También actualizar el select de filtro
    categorySelect.innerHTML = '<option value="">Todas las categorías</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id_categoria;
        option.textContent = categoria.nombre_categoria;
        categorySelect.appendChild(option);
    });
}

// Función para renderizar productos en la tabla
function renderizarProductos(productos) {
    const tbody = productosTable.querySelector('tbody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.nombre_producto}</td>
            <td>${producto.nombre_categoria || 'Sin categoría'}</td>
            <td>$${producto.precio}</td>
            <td>${producto.estado ? 'Activo' : 'Inactivo'}</td>
            <td>
                <button class="btn-edit" onclick="window.editarProducto(${producto.id_producto})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="window.eliminarProducto(${producto.id_producto})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para abrir el modal de producto
function abrirModalProducto(producto = null) {
    productoEditando = producto;
    modalTitleProducto.textContent = producto ? 'Editar Producto' : 'Nuevo Producto';
    
    if (producto) {
        document.getElementById('nombre_producto').value = producto.nombre_producto;
        document.getElementById('descripcion').value = producto.descripcion || '';
        document.getElementById('precio').value = producto.precio;
        document.getElementById('id_categoria').value = producto.id_categoria || '';
    } else {
        document.getElementById('nombre_producto').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('precio').value = '';
        document.getElementById('id_categoria').value = '';
        document.getElementById('imagen').value = '';
    }
    
    productoModal.style.display = 'block';
}

// Función para cerrar el modal de producto
function cerrarModalProducto() {
    productoModal.style.display = 'none';
    productoEditando = null;
    productoForm.reset();
}

// Función para guardar producto
async function guardarProducto(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('nombre_producto', document.getElementById('nombre_producto').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('id_categoria', document.getElementById('id_categoria').value);
    
    const imagenInput = document.getElementById('imagen');
    if (imagenInput.files.length > 0) {
        formData.append('imagen', imagenInput.files[0]);
    }

    try {
        if (productoEditando) {
            await api.updateProducto(productoEditando.id_producto, formData);
            mostrarMensaje('Producto actualizado exitosamente', 'success');
        } else {
            await api.createProducto(formData);
            mostrarMensaje('Producto creado exitosamente', 'success');
        }
        
        cerrarModalProducto();
        cargarProductos();
    } catch (error) {
        mostrarMensaje(error.message || 'Error al guardar el producto', 'error');
    }
}

// Función para editar producto
async function editarProducto(id) {
    try {
        const response = await api.getProducto(id);
        abrirModalProducto(response.data);
    } catch (error) {
        mostrarMensaje('Error al cargar el producto', 'error');
    }
}

// Función para eliminar producto
async function eliminarProducto(id) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }

    try {
        await api.deleteProducto(id);
        mostrarMensaje('Producto eliminado exitosamente', 'success');
        cargarProductos();
    } catch (error) {
        mostrarMensaje(error.message || 'Error al eliminar el producto', 'error');
    }
}

// Función para filtrar productos
function filtrarProductos() {
    const searchTerm = searchInputProductos.value.toLowerCase();
    const categoriaId = categorySelect.value;
    
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

// Event Listeners
addButtonProducto.addEventListener('click', () => abrirModalProducto());
productoForm.addEventListener('submit', guardarProducto);
searchInputProductos.addEventListener('input', filtrarProductos);
categorySelect.addEventListener('change', filtrarProductos);

// Exportar funciones para uso global
window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.cerrarModalProducto = cerrarModalProducto; 