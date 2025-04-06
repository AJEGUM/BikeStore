const pool = require('../config/database');

const categoriaController = {
    // Obtener todas las categorías
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM categoria WHERE estado = TRUE');
            res.json({
                status: 'success',
                data: rows
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Obtener una categoría por ID
    getById: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM categoria WHERE id = ? AND estado = TRUE', [req.params.id]);
            if (rows.length === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            res.json({
                status: 'success',
                data: rows[0]
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Crear una nueva categoría
    create: async (req, res) => {
        try {
            const { nombre_categoria, descripcion } = req.body;
            const [result] = await pool.query(
                'INSERT INTO categoria (nombre_categoria, descripcion) VALUES (?, ?)',
                [nombre_categoria, descripcion]
            );
            res.status(201).json({
                status: 'success',
                message: 'Categoría creada exitosamente',
                data: {
                    id: result.insertId,
                    nombre_categoria,
                    descripcion
                }
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Actualizar una categoría
    update: async (req, res) => {
        try {
            const { nombre_categoria, descripcion } = req.body;
            const [result] = await pool.query(
                'UPDATE categoria SET nombre_categoria = ?, descripcion = ? WHERE id = ?',
                [nombre_categoria, descripcion, req.params.id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            res.json({
                status: 'success',
                message: 'Categoría actualizada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    // Eliminar una categoría (soft delete)
    delete: async (req, res) => {
        try {
            const [result] = await pool.query(
                'UPDATE categoria SET estado = FALSE WHERE id = ?',
                [req.params.id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            res.json({
                status: 'success',
                message: 'Categoría eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
};

module.exports = categoriaController; 