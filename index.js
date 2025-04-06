const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: '.env' });

// Importar rutas
const categoriaRoutes = require('./src/routes/categoria.routes');
const productoRoutes = require('./src/routes/producto.routes');
const stockRoutes = require('./src/routes/stock.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const rolRoutes = require('./src/routes/rol.routes');
const ventaRoutes = require('./src/routes/venta.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'src/frontend')));

// Servir archivos de uploads e imágenes
app.use('/uploads', express.static('uploads'));
app.use('/img', express.static(path.join(__dirname, 'src/frontend/img')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/frontend/html/index.html'));
});

// Rutas de la API
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/ventas', ventaRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 