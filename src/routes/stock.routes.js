const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');

// Rutas para stock
router.get('/', stockController.getAllStock);
router.get('/categorias', stockController.getStockPorCategorias);
router.get('/mas-vendidos', stockController.getProductosMasVendidos);
router.get('/:id', stockController.getStockById);
router.post('/', stockController.createStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);

module.exports = router; 