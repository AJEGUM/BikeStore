const pool = require('../config/database');

const categoriaController = {
    // Obtener todas las categorías
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM categoria ORDER BY id_categoria');
            res.json({
                success: true,
                data: rows
            });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener las categorías'
            });
        }
    },

    // Obtener una categoría por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query(
                'SELECT * FROM categoria WHERE id_categoria = ?',
                [id]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            res.json({
                success: true,
                data: rows[0]
            });
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener la categoría'
            });
        }
    },

    // Crear una nueva categoría
    create: async (req, res) => {
        try {
            const { nombre_categoria, descripcion } = req.body;
            
            // Validar campos requeridos
            if (!nombre_categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de la categoría es requerido'
                });
            }

            // Verificar si la categoría ya existe
            const [existingRows] = await pool.query(
                'SELECT * FROM categoria WHERE nombre_categoria = ?',
                [nombre_categoria]
            );

            if (existingRows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                });
            }

            const [result] = await pool.query(
                'INSERT INTO categoria (nombre_categoria, descripcion) VALUES (?, ?)',
                [nombre_categoria, descripcion]
            );

            const [newCategoria] = await pool.query(
                'SELECT * FROM categoria WHERE id_categoria = ?',
                [result.insertId]
            );

            res.status(201).json({
                success: true,
                data: newCategoria[0],
                message: 'Categoría creada exitosamente'
            });
        } catch (error) {
            console.error('Error al crear categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear la categoría'
            });
        }
    },

    // Actualizar una categoría
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre_categoria, descripcion } = req.body;

            // Validar campos requeridos
            if (!nombre_categoria) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de la categoría es requerido'
                });
            }

            // Verificar si la categoría existe
            const [existingRows] = await pool.query(
                'SELECT * FROM categoria WHERE id_categoria = ?',
                [id]
            );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            // Verificar si el nuevo nombre ya existe en otra categoría
            const [duplicateRows] = await pool.query(
                'SELECT * FROM categoria WHERE nombre_categoria = ? AND id_categoria != ?',
                [nombre_categoria, id]
            );

            if (duplicateRows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Ya existe una categoría con ese nombre'
                });
            }

            await pool.query(
                'UPDATE categoria SET nombre_categoria = ?, descripcion = ? WHERE id_categoria = ?',
                [nombre_categoria, descripcion, id]
            );

            const [updatedCategoria] = await pool.query(
                'SELECT * FROM categoria WHERE id_categoria = ?',
                [id]
            );

            res.json({
                success: true,
                data: updatedCategoria[0],
                message: 'Categoría actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la categoría'
            });
        }
    },

    // Eliminar una categoría
    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // Verificar si la categoría existe
            const [existingRows] = await pool.query(
                'SELECT * FROM categoria WHERE id_categoria = ?',
                [id]
            );

            if (existingRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoría no encontrada'
                });
            }

            // Verificar si hay productos asociados a esta categoría
            const [productosAsociados] = await pool.query(
                'SELECT COUNT(*) as count FROM productos WHERE id_categoria = ? AND estado = TRUE',
                [id]
            );

            if (productosAsociados[0].count > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar la categoría porque tiene productos asociados. Primero elimine o reasigne los productos.'
                });
            }

            await pool.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);

            res.json({
                success: true,
                message: 'Categoría eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar la categoría'
            });
        }
    }
};

module.exports = categoriaController; 