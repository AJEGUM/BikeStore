const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function verificarDatos() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'Bikestore'
    });

    try {
        console.log('Conectado a la base de datos. Verificando datos...');

        // Verificar la consulta de productos más vendidos
        const query = `
            SELECT 
                p.id,
                p.nombre_producto as nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                c.nombre_categoria as categoria,
                SUM(d.cantidad) as total_vendido
            FROM productos p
            JOIN categoria c ON p.categoria_id = c.id
            JOIN detalle_venta d ON p.id = d.producto_id
            JOIN ventas v ON d.venta_id = v.id
            WHERE p.estado = 1 AND v.estado = 'completada'
            GROUP BY p.id, p.nombre_producto, p.descripcion, p.precio, p.imagen, c.nombre_categoria
            ORDER BY total_vendido DESC
            LIMIT 10
        `;
        
        const [productosMasVendidos] = await connection.query(query);
        console.log(`Productos más vendidos encontrados: ${productosMasVendidos.length}`);
        
        if (productosMasVendidos.length > 0) {
            console.log('Primer producto más vendido:');
            console.log(productosMasVendidos[0]);
        } else {
            console.log('No se encontraron productos más vendidos.');
            
            // Verificar si hay productos en la base de datos
            const [productos] = await connection.query('SELECT COUNT(*) as total FROM productos WHERE estado = 1');
            console.log(`Total de productos activos: ${productos[0].total}`);
            
            // Verificar si hay ventas completadas
            const [ventas] = await connection.query("SELECT COUNT(*) as total FROM ventas WHERE estado = 'completada'");
            console.log(`Total de ventas completadas: ${ventas[0].total}`);
            
            // Verificar si hay detalles de venta
            const [detallesVenta] = await connection.query('SELECT COUNT(*) as total FROM detalle_venta');
            console.log(`Total de detalles de venta: ${detallesVenta[0].total}`);
        }

    } catch (error) {
        console.error('Error al verificar datos:', error);
    } finally {
        await connection.end();
        console.log('Conexión cerrada.');
    }
}

verificarDatos(); 