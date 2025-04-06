const express = require('express');
const router = express.Router();

// Importar el controlador
const rolController = require('../controllers/rol.controller');

// Rutas para roles
router.get('/', rolController.getAllRoles);
router.get('/:id', rolController.getRolById);
router.post('/', rolController.createRol);
router.put('/:id', rolController.updateRol);
router.delete('/:id', rolController.deleteRol);

module.exports = router; 