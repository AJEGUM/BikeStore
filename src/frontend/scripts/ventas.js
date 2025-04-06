// Importar el objeto api
import api from './api.js';

// Elementos del DOM
const ventasTbody = document.getElementById('ventas-tbody');
const searchInput = document.getElementById('search-input');
const fechaInicio = document.getElementById('fecha-inicio');
const fechaFin = document.getElementById('fecha-fin');
const btnFiltrar = document.getElementById('btn-filtrar');
const btnNuevaVenta = document.getElementById('btn-nueva-venta');
const modalNuevaVenta = document.getElementById('modal-nueva-venta');
const modalDetalleVenta = document.getElementById('modal-detalle-venta');
const formNuevaVenta = document.getElementById('form-nueva-venta');
const productosVenta = document.getElementById('productos-venta');
const btnAgregarProducto = document.getElementById('btn-agregar-producto');
const totalInput = document.getElementById('total');

// Estado de la aplicación
let ventas = [];
let productos = [];
let productosSeleccionados = [];

// Funciones para cargar datos
async function cargarVentas() {
    try {
        ventas = await api.getVentas();
        renderizarVentas(ventas);
    } catch (error) {
        mostrarError('Error al cargar las ventas');
    }
}

async function cargarProductos() {
    try {
        productos = await api.getProductos();
    } catch (error) {
        mostrarError('Error al cargar los productos');
    }
}

// Funciones para renderizar datos
function renderizarVentas(ventas) {
    ventasTbody.innerHTML = '';
    ventas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${venta.id}</td>
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${venta.cliente}</td>
            <td>$${venta.total}</td>
            <td>${venta.estado}</td>
            <td>
                <button class="btn" onclick="verDetalleVenta(${venta.id})">Ver detalle</button>
            </td>
        `;
        ventasTbody.appendChild(tr);
    });
}

function renderizarProductosVenta() {
    productosVenta.innerHTML = '';
    productosSeleccionados.forEach((producto, index) => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-venta');
        productoElement.innerHTML = `
            <div class="form-group">
                <label>Producto:</label>
                <select class="producto-select" onchange="actualizarProductoVenta(${index}, this.value)">
                    <option value="">Seleccione un producto</option>
                    ${productos.map(p => `<option value="${p.id}" ${p.id === producto.id ? 'selected' : ''}>${p.nombre}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Cantidad:</label>
                <input type="number" min="1" value="${producto.cantidad}" onchange="actualizarCantidadProducto(${index}, this.value)">
            </div>
            <button type="button" class="btn" onclick="eliminarProductoVenta(${index})">Eliminar</button>
        `;
        productosVenta.appendChild(productoElement);
    });
    actualizarTotal();
}

// Funciones para manejar ventas
function agregarProductoVenta() {
    productosSeleccionados.push({
        id: '',
        cantidad: 1
    });
    renderizarProductosVenta();
}

function actualizarProductoVenta(index, productoId) {
    productosSeleccionados[index].id = parseInt(productoId);
    actualizarTotal();
}

function actualizarCantidadProducto(index, cantidad) {
    productosSeleccionados[index].cantidad = parseInt(cantidad);
    actualizarTotal();
}

function eliminarProductoVenta(index) {
    productosSeleccionados.splice(index, 1);
    renderizarProductosVenta();
}

function actualizarTotal() {
    let total = 0;
    productosSeleccionados.forEach(producto => {
        const productoInfo = productos.find(p => p.id === producto.id);
        if (productoInfo) {
            total += productoInfo.precio * producto.cantidad;
        }
    });
    totalInput.value = total;
}

async function crearVenta(event) {
    event.preventDefault();
    const cliente = document.getElementById('cliente').value;
    const productosVenta = productosSeleccionados.map(producto => ({
        producto_id: producto.id,
        cantidad: producto.cantidad
    }));

    try {
        await api.createVenta({
            cliente,
            productos: productosVenta,
            total: parseFloat(totalInput.value)
        });
        modalNuevaVenta.classList.remove('active');
        formNuevaVenta.reset();
        productosSeleccionados = [];
        cargarVentas();
        mostrarMensaje('Venta creada correctamente');
    } catch (error) {
        mostrarError('Error al crear la venta');
    }
}

function verDetalleVenta(id) {
    const venta = ventas.find(v => v.id === id);
    if (!venta) return;

    const detalleVenta = document.getElementById('detalle-venta');
    detalleVenta.innerHTML = `
        <p><strong>ID:</strong> ${venta.id}</p>
        <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleDateString()}</p>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <p><strong>Total:</strong> $${venta.total}</p>
        <p><strong>Estado:</strong> ${venta.estado}</p>
        <h3>Productos</h3>
        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${venta.productos.map(producto => `
                    <tr>
                        <td>${producto.nombre}</td>
                        <td>${producto.cantidad}</td>
                        <td>$${producto.precio}</td>
                        <td>$${producto.precio * producto.cantidad}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    modalDetalleVenta.classList.add('active');
}

// Funciones para filtrar ventas
function filtrarVentas() {
    let ventasFiltradas = [...ventas];

    // Filtrar por búsqueda
    const busqueda = searchInput.value.toLowerCase();
    if (busqueda) {
        ventasFiltradas = ventasFiltradas.filter(venta => 
            venta.cliente.toLowerCase().includes(busqueda)
        );
    }

    // Filtrar por fecha
    const fechaInicioValue = fechaInicio.value;
    const fechaFinValue = fechaFin.value;
    if (fechaInicioValue && fechaFinValue) {
        ventasFiltradas = ventasFiltradas.filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            return fechaVenta >= new Date(fechaInicioValue) && fechaVenta <= new Date(fechaFinValue);
        });
    }

    renderizarVentas(ventasFiltradas);
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
btnNuevaVenta.addEventListener('click', () => {
    modalNuevaVenta.classList.add('active');
});

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modalNuevaVenta.classList.remove('active');
        modalDetalleVenta.classList.remove('active');
    });
});

formNuevaVenta.addEventListener('submit', crearVenta);
btnAgregarProducto.addEventListener('click', agregarProductoVenta);
btnFiltrar.addEventListener('click', filtrarVentas);
searchInput.addEventListener('input', filtrarVentas);
fechaInicio.addEventListener('change', filtrarVentas);
fechaFin.addEventListener('change', filtrarVentas);

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
    cargarProductos();
}); 