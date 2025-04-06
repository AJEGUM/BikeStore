const express = require('express');
const router = express.Router();

// Importar el controlador cuando esté creado
// const ventaController = require('../controllers/venta.controller');

// Rutas temporales
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de ventas - En construcción' });
});

router.get('/:id', (req, res) => {
    res.json({ message: 'Obtener venta por ID - En construcción' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Crear venta - En construcción' });
});

router.put('/:id', (req, res) => {
    res.json({ message: 'Actualizar venta - En construcción' });
});

router.delete('/:id', (req, res) => {
    res.json({ message: 'Eliminar venta - En construcción' });
});

module.exports = router; 