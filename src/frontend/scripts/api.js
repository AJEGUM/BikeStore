// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Funciones para manejar las llamadas a la API
export const api = {
    // Productos
    async getProductos() {
        try {
            const response = await fetch(`${API_URL}/productos`);
            if (!response.ok) {
                throw new Error('Error al obtener los productos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getProducto(id) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createProducto(formData) {
        try {
            const response = await fetch(`${API_URL}/productos`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error al crear el producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateProducto(id, formData) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteProducto(id) {
        try {
            const response = await fetch(`${API_URL}/productos/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Categorías
    async getCategorias() {
        try {
            const response = await fetch(`${API_URL}/categorias`);
            if (!response.ok) {
                throw new Error('Error al obtener las categorías');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getCategoria(id) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener la categoría');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createCategoria(categoriaData) {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriaData),
            });
            if (!response.ok) {
                throw new Error('Error al crear la categoría');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateCategoria(id, categoriaData) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoriaData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar la categoría');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteCategoria(id) {
        try {
            const response = await fetch(`${API_URL}/categorias/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al eliminar la categoría');
            }
            
            return data;
        } catch (error) {
            console.error('Error en deleteCategoria:', error);
            throw error;
        }
    },

    // Stock
    async getStock() {
        try {
            const response = await fetch(`${API_URL}/stock`);
            if (!response.ok) {
                throw new Error('Error al obtener el stock');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getStockPorCategorias() {
        try {
            const response = await fetch(`${API_URL}/stock/categorias`);
            if (!response.ok) {
                throw new Error('Error al obtener el stock por categorías');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getProductosMasVendidos() {
        try {
            const response = await fetch(`${API_URL}/stock/mas-vendidos`);
            if (!response.ok) {
                throw new Error('Error al obtener los productos más vendidos');
            }
            const data = await response.json();
            console.log('Respuesta de la API:', data);

            // Asegurarse de que los datos sean un array
            if (!data.data || !Array.isArray(data.data)) {
                console.error('Los datos no tienen el formato esperado:', data);
                return [];
            }

            // Procesar los datos para asegurar que todos los campos necesarios estén presentes
            const productos = data.data.map(producto => ({
                id: producto.id,
                nombre: producto.nombre || 'Sin nombre',
                descripcion: producto.descripcion || 'Sin descripción',
                precio: parseFloat(producto.precio) || 0,
                imagen: producto.imagen ? `/uploads/${producto.imagen}` : '../img/default.jpg',
                categoria: producto.categoria || 'Sin categoría'
            }));

            console.log('Productos procesados:', productos);
            return productos;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    },

    async getStockById(id) {
        try {
            const response = await fetch(`${API_URL}/stock/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener el stock');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createStock(stockData) {
        try {
            const response = await fetch(`${API_URL}/stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });
            if (!response.ok) {
                throw new Error('Error al crear el stock');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateStock(id, stockData) {
        try {
            const response = await fetch(`${API_URL}/stock/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el stock');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteStock(id) {
        try {
            const response = await fetch(`${API_URL}/stock/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el stock');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Usuarios
    async login(credentials) {
        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_URL}/usuarios/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Ventas
    async getVentas() {
        try {
            const response = await fetch(`${API_URL}/ventas`);
            if (!response.ok) {
                throw new Error('Error al obtener las ventas');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createVenta(ventaData) {
        try {
            const response = await fetch(`${API_URL}/ventas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ventaData),
            });
            if (!response.ok) {
                throw new Error('Error al crear la venta');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
}; 