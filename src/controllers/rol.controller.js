const db = require('../config/database');

// Obtener todos los roles
exports.getAllRoles = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM roles WHERE estado = TRUE');
        res.json({
            status: 'success',
            data: roles
        });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener roles',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener un rol por ID
exports.getRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const [roles] = await db.query('SELECT * FROM roles WHERE id = ? AND estado = TRUE', [id]);
        
        if (roles.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }
        
        res.json({
            status: 'success',
            data: roles[0]
        });
    } catch (error) {
        console.error('Error al obtener rol:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener rol',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Crear un nuevo rol
exports.createRol = async (req, res) => {
    try {
        const { nombre_rol, descripcion } = req.body;
        
        if (!nombre_rol) {
            return res.status(400).json({
                status: 'error',
                message: 'El nombre del rol es obligatorio'
            });
        }
        
        const [result] = await db.query(
            'INSERT INTO roles (nombre_rol, descripcion) VALUES (?, ?)',
            [nombre_rol, descripcion]
        );
        
        const [newRol] = await db.query('SELECT * FROM roles WHERE id = ?', [result.insertId]);
        
        res.status(201).json({
            status: 'success',
            message: 'Rol creado correctamente',
            data: newRol[0]
        });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear rol',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Actualizar un rol
exports.updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_rol, descripcion } = req.body;
        
        if (!nombre_rol) {
            return res.status(400).json({
                status: 'error',
                message: 'El nombre del rol es obligatorio'
            });
        }
        
        // Verificar si el rol existe
        const [roles] = await db.query('SELECT * FROM roles WHERE id = ? AND estado = TRUE', [id]);
        
        if (roles.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }
        
        // Actualizar el rol
        await db.query(
            'UPDATE roles SET nombre_rol = ?, descripcion = ? WHERE id = ?',
            [nombre_rol, descripcion, id]
        );
        
        // Obtener el rol actualizado
        const [updatedRol] = await db.query('SELECT * FROM roles WHERE id = ?', [id]);
        
        res.json({
            status: 'success',
            message: 'Rol actualizado correctamente',
            data: updatedRol[0]
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar rol',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Eliminar un rol (soft delete)
exports.deleteRol = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el rol existe
        const [roles] = await db.query('SELECT * FROM roles WHERE id = ? AND estado = TRUE', [id]);
        
        if (roles.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rol no encontrado'
            });
        }
        
        // Realizar soft delete
        await db.query('UPDATE roles SET estado = FALSE WHERE id = ?', [id]);
        
        res.json({
            status: 'success',
            message: 'Rol eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar rol',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 