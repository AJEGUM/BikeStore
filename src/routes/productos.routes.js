const express = require('express');
const router = express.Router();
const { 
    getProductos, 
    getCategorias, 
    getProductoById 
} = require('../controllers/productos.controller');

// Rutas para productos
router.get('/productos', getProductos);
router.get('/productos/:id', getProductoById);
router.get('/categorias', getCategorias);

module.exports = router; 