const pool = require('../config/database');

// Obtener todo el stock detallado
const getAllStock = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id,
                s.cantidad,
                s.lote,
                s.fecha_entrada,
                p.nombre as nombre_producto,
                c.nombre as nombre_categoria
            FROM stock s
            JOIN productos p ON s.producto_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            WHERE s.estado = true
            ORDER BY s.fecha_entrada DESC
        `;
        
        const [rows] = await pool.query(query);
        
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el stock'
        });
    }
};

// Obtener stock por ID
const getStockById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = `
            SELECT 
                s.id,
                s.cantidad,
                s.lote,
                s.fecha_entrada,
                p.nombre as nombre_producto,
                c.nombre as nombre_categoria
            FROM stock s
            JOIN productos p ON s.producto_id = p.id
            JOIN categorias c ON p.categoria_id = c.id
            WHERE s.id = ? AND s.estado = true
        `;
        
        const [rows] = await pool.query(query, [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Stock no encontrado'
            });
        }
        
        res.json({
            status: 'success',
            data: rows[0]
        });
    } catch (error) {
        console.error('Error al obtener stock por ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el stock'
        });
    }
};

// Obtener stock por categorías
const getStockPorCategorias = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.nombre as categoria,
                COUNT(p.id) as total_productos,
                SUM(s.cantidad) as stock_total
            FROM categorias c
            LEFT JOIN productos p ON c.id = p.categoria_id
            LEFT JOIN stock s ON p.id = s.producto_id
            WHERE c.activo = 1 AND s.estado = true
            GROUP BY c.id, c.nombre
            ORDER BY c.nombre ASC
        `;
        
        const [rows] = await pool.query(query);
        
        res.json({
            status: 'success',
            data: rows
        });
    } catch (error) {
        console.error('Error al obtener stock por categorías:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el stock por categorías'
        });
    }
};

// Obtener productos más vendidos
const getProductosMasVendidos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id,
                p.nombre_producto as nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                c.nombre_categoria as categoria,
                COALESCE(SUM(d.cantidad), 0) as total_vendido
            FROM productos p
            JOIN categoria c ON p.categoria_id = c.id
            LEFT JOIN detalle_venta d ON p.id = d.producto_id
            LEFT JOIN ventas v ON d.venta_id = v.id
            WHERE p.estado = 1
            GROUP BY p.id, p.nombre_producto, p.descripcion, p.precio, p.imagen, c.nombre_categoria
            ORDER BY total_vendido DESC
            LIMIT 10
        `);

        // Procesar las URLs de las imágenes
        const productos = rows.map(producto => ({
            ...producto,
            imagen: producto.imagen ? `http://localhost:3000/${producto.imagen}` : null
        }));

        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener productos más vendidos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos más vendidos',
            error: error.message
        });
    }
};

// Crear nuevo stock
const createStock = async (req, res) => {
    try {
        const { producto_id, cantidad, lote } = req.body;
        
        // Validar datos
        if (!producto_id || !cantidad || !lote) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan datos requeridos'
            });
        }
        
        // Verificar si el producto existe
        const [producto] = await pool.query(
            'SELECT id FROM productos WHERE id = ? AND activo = 1',
            [producto_id]
        );
        
        if (producto.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        
        // Insertar nuevo stock
        const [result] = await pool.query(
            'INSERT INTO stock (producto_id, cantidad, lote, fecha_entrada, estado) VALUES (?, ?, ?, NOW(), true)',
            [producto_id, cantidad, lote]
        );
        
        res.status(201).json({
            status: 'success',
            message: 'Stock creado correctamente',
            data: {
                id: result.insertId,
                producto_id,
                cantidad,
                lote
            }
        });
    } catch (error) {
        console.error('Error al crear stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear el stock'
        });
    }
};

// Actualizar stock
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, lote } = req.body;
        
        // Validar datos
        if (!cantidad || !lote) {
            return res.status(400).json({
                status: 'error',
                message: 'Faltan datos requeridos'
            });
        }
        
        // Verificar si el stock existe
        const [stock] = await pool.query(
            'SELECT id FROM stock WHERE id = ? AND estado = true',
            [id]
        );
        
        if (stock.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Stock no encontrado'
            });
        }
        
        // Actualizar stock
        await pool.query(
            'UPDATE stock SET cantidad = ?, lote = ? WHERE id = ?',
            [cantidad, lote, id]
        );
        
        res.json({
            status: 'success',
            message: 'Stock actualizado correctamente',
            data: {
                id,
                cantidad,
                lote
            }
        });
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar el stock'
        });
    }
};

// Eliminar stock (soft delete)
const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el stock existe
        const [stock] = await pool.query(
            'SELECT id FROM stock WHERE id = ? AND estado = true',
            [id]
        );
        
        if (stock.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Stock no encontrado'
            });
        }
        
        // Soft delete
        await pool.query(
            'UPDATE stock SET estado = false WHERE id = ?',
            [id]
        );
        
        res.json({
            status: 'success',
            message: 'Stock eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar stock:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar el stock'
        });
    }
};

module.exports = {
    getAllStock,
    getStockById,
    getStockPorCategorias,
    getProductosMasVendidos,
    createStock,
    updateStock,
    deleteStock
}; 