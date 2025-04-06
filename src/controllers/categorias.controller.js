const pool = require('../config/database');

// Obtener todas las categorías
const getCategorias = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categoria ORDER BY id_categoria');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías'
        });
    }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM categoria WHERE id_categoria = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoría'
        });
    }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
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
        const existingCategoria = await pool.query(
            'SELECT * FROM categoria WHERE nombre_categoria = $1',
            [nombre_categoria]
        );

        if (existingCategoria.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        const result = await pool.query(
            'INSERT INTO categoria (nombre_categoria, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre_categoria, descripcion]
        );

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'Categoría creada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría'
        });
    }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
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
        const existingCategoria = await pool.query(
            'SELECT * FROM categoria WHERE id_categoria = $1',
            [id]
        );

        if (existingCategoria.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Verificar si el nuevo nombre ya existe en otra categoría
        const duplicateCategoria = await pool.query(
            'SELECT * FROM categoria WHERE nombre_categoria = $1 AND id_categoria != $2',
            [nombre_categoria, id]
        );

        if (duplicateCategoria.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }

        const result = await pool.query(
            'UPDATE categoria SET nombre_categoria = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *',
            [nombre_categoria, descripcion, id]
        );

        res.json({
            success: true,
            data: result.rows[0],
            message: 'Categoría actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría'
        });
    }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si la categoría existe
        const existingCategoria = await pool.query(
            'SELECT * FROM categoria WHERE id_categoria = $1',
            [id]
        );

        if (existingCategoria.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        // Verificar si hay productos asociados a esta categoría
        const productosAsociados = await pool.query(
            'SELECT * FROM productos WHERE id_categoria = $1',
            [id]
        );

        if (productosAsociados.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }

        await pool.query('DELETE FROM categoria WHERE id_categoria = $1', [id]);

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
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
}; 