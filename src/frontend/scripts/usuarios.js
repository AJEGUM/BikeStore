import { API } from './api.js';

// Elementos del DOM
const usuariosTbody = document.getElementById('usuarios-tbody');
const searchInput = document.getElementById('search-input');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnAgregar = document.getElementById('btn-agregar');
const modalAgregar = document.getElementById('modal-agregar');
const modalEditar = document.getElementById('modal-editar');
const formAgregarUsuario = document.getElementById('form-agregar-usuario');
const formEditarUsuario = document.getElementById('form-editar-usuario');
const rolSelect = document.getElementById('rol');
const editRolSelect = document.getElementById('edit-rol');

// Estado de la aplicación
let usuarios = [];
const roles = ['admin', 'vendedor', 'cliente'];

// Cargar usuarios
async function cargarUsuarios() {
    try {
        const response = await API.get('/usuarios');
        usuarios = response.data;
        renderizarUsuarios(usuarios);
    } catch (error) {
        mostrarError('Error al cargar usuarios: ' + error.message);
    }
}

// Renderizar usuarios en la tabla
function renderizarUsuarios(usuarios) {
    usuariosTbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
            <td>
                <button class="btn-editar" data-id="${usuario.id}">Editar</button>
                <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
            </td>
        `;
        usuariosTbody.appendChild(tr);
    });
}

// Llenar select de roles
function llenarSelectRoles() {
    roles.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol;
        option.textContent = rol.charAt(0).toUpperCase() + rol.slice(1);
        rolSelect.appendChild(option);
        editRolSelect.appendChild(option.cloneNode(true));
    });
}

// Filtrar usuarios
function filtrarUsuarios() {
    const busqueda = searchInput.value.toLowerCase();
    const usuariosFiltrados = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(busqueda) ||
        usuario.email.toLowerCase().includes(busqueda) ||
        usuario.rol.toLowerCase().includes(busqueda)
    );
    renderizarUsuarios(usuariosFiltrados);
}

// Agregar usuario
async function agregarUsuario(event) {
    event.preventDefault();
    const usuario = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value
    };

    try {
        await API.post('/usuarios', usuario);
        mostrarMensaje('Usuario agregado exitosamente');
        modalAgregar.style.display = 'none';
        formAgregarUsuario.reset();
        cargarUsuarios();
    } catch (error) {
        mostrarError('Error al agregar usuario: ' + error.message);
    }
}

// Editar usuario
async function editarUsuario(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const usuario = {
        nombre: document.getElementById('edit-nombre').value,
        email: document.getElementById('edit-email').value,
        rol: document.getElementById('edit-rol').value
    };

    // Solo incluir password si se proporciona uno nuevo
    const password = document.getElementById('edit-password').value;
    if (password) {
        usuario.password = password;
    }

    try {
        await API.put(`/usuarios/${id}`, usuario);
        mostrarMensaje('Usuario actualizado exitosamente');
        modalEditar.style.display = 'none';
        formEditarUsuario.reset();
        cargarUsuarios();
    } catch (error) {
        mostrarError('Error al actualizar usuario: ' + error.message);
    }
}

// Eliminar usuario
async function eliminarUsuario(id) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        try {
            await API.delete(`/usuarios/${id}`);
            mostrarMensaje('Usuario eliminado exitosamente');
            cargarUsuarios();
        } catch (error) {
            mostrarError('Error al eliminar usuario: ' + error.message);
        }
    }
}

// Mostrar mensaje de éxito
function mostrarMensaje(mensaje) {
    alert(mensaje);
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    alert('Error: ' + mensaje);
}

// Event Listeners
btnFiltrar.addEventListener('click', filtrarUsuarios);
searchInput.addEventListener('keyup', filtrarUsuarios);

btnAgregar.addEventListener('click', () => {
    modalAgregar.style.display = 'block';
});

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modalAgregar.style.display = 'none';
        modalEditar.style.display = 'none';
    });
});

formAgregarUsuario.addEventListener('submit', agregarUsuario);
formEditarUsuario.addEventListener('submit', editarUsuario);

usuariosTbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-editar')) {
        const id = e.target.dataset.id;
        const usuario = usuarios.find(u => u.id === parseInt(id));
        if (usuario) {
            document.getElementById('edit-id').value = usuario.id;
            document.getElementById('edit-nombre').value = usuario.nombre;
            document.getElementById('edit-email').value = usuario.email;
            document.getElementById('edit-rol').value = usuario.rol;
            modalEditar.style.display = 'block';
        }
    } else if (e.target.classList.contains('btn-eliminar')) {
        const id = e.target.dataset.id;
        eliminarUsuario(id);
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    llenarSelectRoles();
    cargarUsuarios();
}); 