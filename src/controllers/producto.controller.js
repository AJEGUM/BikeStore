const db = require('../config/database');

// Verificar y crear la columna stock si no existe
async function verificarColumnaStock() {
    try {
        // Verificar si la columna stock existe
        const [columns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'productos' 
            AND COLUMN_NAME = 'stock'
        `);
        
        // Si la columna no existe, la creamos
        if (columns.length === 0) {
            await db.query(`
                ALTER TABLE productos 
                ADD COLUMN stock INT DEFAULT 0
            `);
            console.log('Columna stock creada exitosamente');
        }
    } catch (error) {
        console.error('Error al verificar/crear columna stock:', error);
        throw error;
    }
}

// Verificar la columna stock al iniciar
verificarColumnaStock().catch(console.error);

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.estado = TRUE
        `);
        
        // Convertir el precio a número para cada producto
        const productosFormateados = productos.map(producto => ({
            ...producto,
            precio: parseFloat(producto.precio) || 0
        }));
        
        res.json({
            status: 'success',
            data: productosFormateados
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener productos',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener un producto por ID
exports.getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [productos] = await db.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = ? AND p.estado = TRUE
        `, [id]);
        
        if (productos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        
        // Convertir el precio a número
        const producto = {
            ...productos[0],
            precio: parseFloat(productos[0].precio) || 0
        };
        
        res.json({
            status: 'success',
            data: producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Crear un nuevo producto
exports.createProducto = async (req, res) => {
    try {
        const { nombre_producto, descripcion, precio, id_categoria } = req.body;
        
        // Validar campos requeridos
        if (!nombre_producto || !precio || !id_categoria) {
            return res.status(400).json({
                status: 'error',
                message: 'Nombre, precio y categoría son obligatorios'
            });
        }
        
        // Convertir precio a número
        const precioNumerico = parseFloat(precio);
        if (isNaN(precioNumerico)) {
            return res.status(400).json({
                status: 'error',
                message: 'El precio debe ser un número válido'
            });
        }
        
        // Verificar si la categoría existe
        const [categorias] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id_categoria]);
        if (categorias.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La categoría especificada no existe'
            });
        }
        
        // Procesar la imagen si se subió una
        let imagen = null;
        if (req.file) {
            imagen = req.file.filename;
        }
        
        // Insertar el producto
        const [result] = await db.query(
            'INSERT INTO productos (nombre_producto, descripcion, precio, id_categoria, imagen) VALUES (?, ?, ?, ?, ?)',
            [nombre_producto, descripcion, precioNumerico, id_categoria, imagen]
        );
        
        // Obtener el producto creado
        const [newProducto] = await db.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = ?
        `, [result.insertId]);
        
        // Convertir el precio a número
        const productoFormateado = {
            ...newProducto[0],
            precio: parseFloat(newProducto[0].precio) || 0
        };
        
        res.status(201).json({
            status: 'success',
            message: 'Producto creado correctamente',
            data: productoFormateado
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al crear producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Actualizar un producto
exports.updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Body recibido:', req.body);
        const { nombre_producto, descripcion, precio, id_categoria, stock } = req.body;
        
        // Verificar si el producto existe
        const [productos] = await db.query('SELECT * FROM productos WHERE id_producto = ? AND estado = TRUE', [id]);
        if (productos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        
        // Si se está actualizando solo el stock y precio
        if (stock !== undefined && precio !== undefined && !nombre_producto && !id_categoria) {
            console.log('Actualizando solo stock y precio:', { stock, precio });
            
            // Convertir valores a números
            const stockNumerico = parseInt(stock);
            const precioNumerico = parseFloat(precio);
            
            // Validar que los valores sean números válidos
            if (isNaN(stockNumerico)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El stock debe ser un número válido'
                });
            }
            
            if (isNaN(precioNumerico)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El precio debe ser un número válido'
                });
            }
            
            try {
                // Asegurarse de que la columna stock existe
                await verificarColumnaStock();
                
                // Actualizar solo stock y precio
                await db.query(
                    'UPDATE productos SET stock = ?, precio = ? WHERE id_producto = ?',
                    [stockNumerico, precioNumerico, id]
                );
                
                // Obtener el producto actualizado
                const [updatedProducto] = await db.query(`
                    SELECT p.*, c.nombre_categoria 
                    FROM productos p 
                    LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
                    WHERE p.id_producto = ?
                `, [id]);
                
                if (!updatedProducto || updatedProducto.length === 0) {
                    throw new Error('No se pudo obtener el producto actualizado');
                }
                
                // Convertir el precio a número
                const productoFormateado = {
                    ...updatedProducto[0],
                    precio: parseFloat(updatedProducto[0].precio) || 0,
                    stock: parseInt(updatedProducto[0].stock) || 0
                };
                
                console.log('Producto actualizado:', productoFormateado);
                
                return res.json({
                    status: 'success',
                    message: 'Stock y precio actualizados correctamente',
                    data: productoFormateado
                });
            } catch (dbError) {
                console.error('Error en la operación de base de datos:', dbError);
                throw new Error(`Error en la base de datos: ${dbError.message}`);
            }
        }
        
        // Si se está actualizando el producto completo
        // Validar campos requeridos
        if (!nombre_producto || !precio || !id_categoria) {
            return res.status(400).json({
                status: 'error',
                message: 'Nombre, precio y categoría son obligatorios'
            });
        }
        
        // Convertir precio a número
        const precioNumerico = parseFloat(precio);
        if (isNaN(precioNumerico)) {
            return res.status(400).json({
                status: 'error',
                message: 'El precio debe ser un número válido'
            });
        }
        
        // Verificar si la categoría existe
        const [categorias] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id_categoria]);
        if (categorias.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'La categoría especificada no existe'
            });
        }
        
        // Procesar la imagen si se subió una nueva
        let imagen = productos[0].imagen;
        if (req.file) {
            imagen = req.file.filename;
        }
        
        // Actualizar el producto
        await db.query(
            'UPDATE productos SET nombre_producto = ?, descripcion = ?, precio = ?, id_categoria = ?, imagen = ? WHERE id_producto = ?',
            [nombre_producto, descripcion, precioNumerico, id_categoria, imagen, id]
        );
        
        // Obtener el producto actualizado
        const [updatedProducto] = await db.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = ?
        `, [id]);
        
        // Convertir el precio a número
        const productoFormateado = {
            ...updatedProducto[0],
            precio: parseFloat(updatedProducto[0].precio) || 0
        };
        
        res.json({
            status: 'success',
            message: 'Producto actualizado correctamente',
            data: productoFormateado
        });
    } catch (error) {
        console.error('Error detallado al actualizar producto:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Eliminar un producto (soft delete)
exports.deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si el producto existe
        const [productos] = await db.query('SELECT * FROM productos WHERE id_producto = ? AND estado = TRUE', [id]);
        if (productos.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }
        
        // Realizar soft delete
        await db.query('UPDATE productos SET estado = FALSE WHERE id_producto = ?', [id]);
        
        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 