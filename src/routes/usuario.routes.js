const express = require('express');
const router = express.Router();

// Importar el controlador cuando esté creado
// const usuarioController = require('../controllers/usuario.controller');

// Rutas temporales
router.get('/', (req, res) => {
    res.json({ message: 'Ruta de usuarios - En construcción' });
});

router.get('/:id', (req, res) => {
    res.json({ message: 'Obtener usuario por ID - En construcción' });
});

router.post('/', (req, res) => {
    res.json({ message: 'Crear usuario - En construcción' });
});

router.put('/:id', (req, res) => {
    res.json({ message: 'Actualizar usuario - En construcción' });
});

router.delete('/:id', (req, res) => {
    res.json({ message: 'Eliminar usuario - En construcción' });
});

module.exports = router; 