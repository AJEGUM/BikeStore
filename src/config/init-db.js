const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        // Crear conexión sin base de datos
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Conectado al servidor MySQL');

        // Leer el archivo SQL
        const sqlFile = await fs.readFile(path.join(__dirname, 'database.sql'), 'utf8');
        const statements = sqlFile.split(';').filter(statement => statement.trim());

        // Ejecutar cada statement
        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
                console.log('Statement ejecutado:', statement.substring(0, 50) + '...');
            }
        }

        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar la inicialización
initializeDatabase(); 