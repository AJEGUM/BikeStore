const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de Multer para productos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'producto-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Importar el controlador
const productoController = require('../controllers/producto.controller');

// Rutas de productos
router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', upload.single('imagen'), productoController.createProducto);
router.put('/:id', upload.single('imagen'), productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

module.exports = router; 