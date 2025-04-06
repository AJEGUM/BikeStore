const pool = require('../config/database');

const getProductos = async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen,
                   c.id as categoria_id, c.nombre as categoria
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = 1
            ORDER BY p.nombre ASC
        `;
        
        const [productos] = await pool.query(query);
        
        // Procesar las URLs de las imágenes
        productos.forEach(producto => {
            if (producto.imagen) {
                producto.imagen = `/uploads/${producto.imagen}`;
            }
        });

        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

const getCategorias = async (req, res) => {
    try {
        const query = `
            SELECT id, nombre
            FROM categorias
            WHERE activo = 1
            ORDER BY nombre ASC
        `;
        
        const [categorias] = await pool.query(query);
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ message: 'Error al obtener las categorías' });
    }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.imagen,
                   c.id as categoria_id, c.nombre as categoria
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ? AND p.activo = 1
        `;
        
        const [producto] = await pool.query(query, [id]);
        
        if (producto.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Procesar la URL de la imagen
        if (producto[0].imagen) {
            producto[0].imagen = `/uploads/${producto[0].imagen}`;
        }

        res.json(producto[0]);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

module.exports = {
    getProductos,
    getCategorias,
    getProductoById
}; 