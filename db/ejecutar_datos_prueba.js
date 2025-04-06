const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function ejecutarScript() {
    // Crear conexión a la base de datos
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'Bikestore',
        multipleStatements: true // Permitir múltiples consultas
    });

    try {
        console.log('Conectado a la base de datos. Ejecutando script de datos de prueba...');

        // Leer el archivo SQL
        const sqlScript = fs.readFileSync(path.join(__dirname, 'datos_prueba.sql'), 'utf8');

        // Ejecutar el script
        await connection.query(sqlScript);

        console.log('Datos de prueba insertados correctamente.');
    } catch (error) {
        console.error('Error al ejecutar el script:', error);
    } finally {
        // Cerrar la conexión
        await connection.end();
        console.log('Conexión cerrada.');
    }
}

// Ejecutar la función
ejecutarScript(); 