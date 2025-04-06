import { api } from './api.js';

// Elementos del DOM
const categoriasTable = document.getElementById('categoriasTable');
const searchInputCategorias = document.getElementById('searchInputCategorias');
const filterButtonCategorias = document.getElementById('filterButtonCategorias');
const addButtonCategoria = document.getElementById('addButtonCategoria');
const categoriaModal = document.getElementById('categoriaModal');
const modalTitleCategoria = document.getElementById('modalTitleCategoria');
const categoriaForm = document.getElementById('categoriaForm');

// Estado de la aplicación
let categorias = [];
let categoriaEditando = null;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
});

// Función para cargar categorías
async function cargarCategorias() {
    try {
        const response = await api.getCategorias();
        categorias = response.data;
        renderizarCategorias(categorias);
    } catch (error) {
        mostrarMensaje('Error al cargar las categorías', 'error');
    }
}

// Función para renderizar categorías en la tabla
function renderizarCategorias(categorias) {
    const tbody = categoriasTable.querySelector('tbody');
    tbody.innerHTML = '';

    categorias.forEach(categoria => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoria.id_categoria}</td>
            <td>${categoria.nombre_categoria}</td>
            <td>${categoria.descripcion || 'Sin descripción'}</td>
            <td>
                <button class="btn-edit" onclick="window.editarCategoria(${categoria.id_categoria})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="window.eliminarCategoria(${categoria.id_categoria})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para abrir el modal de categoría
function abrirModalCategoria(categoria = null) {
    categoriaEditando = categoria;
    modalTitleCategoria.textContent = categoria ? 'Editar Categoría' : 'Nueva Categoría';
    
    if (categoria) {
        document.getElementById('nombre_categoria').value = categoria.nombre_categoria;
        document.getElementById('descripcion_categoria').value = categoria.descripcion || '';
    } else {
        document.getElementById('nombre_categoria').value = '';
        document.getElementById('descripcion_categoria').value = '';
    }
    
    categoriaModal.style.display = 'block';
}

// Función para cerrar el modal de categoría
function cerrarModalCategoria() {
    categoriaModal.style.display = 'none';
    categoriaEditando = null;
    categoriaForm.reset();
}

// Función para guardar categoría
async function guardarCategoria(event) {
    event.preventDefault();
    
    const categoriaData = {
        nombre_categoria: document.getElementById('nombre_categoria').value,
        descripcion: document.getElementById('descripcion_categoria').value
    };

    try {
        if (categoriaEditando) {
            await api.updateCategoria(categoriaEditando.id_categoria, categoriaData);
            mostrarMensaje('Categoría actualizada exitosamente', 'success');
        } else {
            await api.createCategoria(categoriaData);
            mostrarMensaje('Categoría creada exitosamente', 'success');
        }
        
        cerrarModalCategoria();
        cargarCategorias();
    } catch (error) {
        mostrarMensaje(error.message || 'Error al guardar la categoría', 'error');
    }
}

// Función para editar categoría
async function editarCategoria(id) {
    try {
        const response = await api.getCategoria(id);
        abrirModalCategoria(response.data);
    } catch (error) {
        mostrarMensaje('Error al cargar la categoría', 'error');
    }
}

// Función para eliminar categoría
async function eliminarCategoria(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta categoría?')) {
        return;
    }

    try {
        const response = await api.deleteCategoria(id);
        mostrarMensaje('Categoría eliminada exitosamente', 'success');
        cargarCategorias();
    } catch (error) {
        // Verificar si el error es porque la categoría tiene productos asociados
        if (error.message && error.message.includes('productos asociados')) {
            mostrarMensaje('No se puede eliminar la categoría porque tiene productos asociados', 'error');
        } else {
            mostrarMensaje(error.message || 'Error al eliminar la categoría', 'error');
        }
        console.error('Error al eliminar categoría:', error);
    }
}

// Función para filtrar categorías
function filtrarCategorias() {
    const searchTerm = searchInputCategorias.value.toLowerCase();
    
    const categoriasFiltradas = categorias.filter(categoria => 
        categoria.nombre_categoria.toLowerCase().includes(searchTerm) ||
        (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm))
    );
    
    renderizarCategorias(categoriasFiltradas);
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
addButtonCategoria.addEventListener('click', () => abrirModalCategoria());
categoriaForm.addEventListener('submit', guardarCategoria);
searchInputCategorias.addEventListener('input', filtrarCategorias);
filterButtonCategorias.addEventListener('click', filtrarCategorias);

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === categoriaModal) {
        cerrarModalCategoria();
    }
});

// Exportar funciones para uso global
window.editarCategoria = editarCategoria;
window.eliminarCategoria = eliminarCategoria;
window.cerrarModalCategoria = cerrarModalCategoria; 