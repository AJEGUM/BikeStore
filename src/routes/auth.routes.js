const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre_usuario, email, clave, nombre_completo, telefono, direccion } = req.body;
        
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        // Insertar nuevo usuario (rol_id 3 = Cliente por defecto)
        const [result] = await pool.query(
            'INSERT INTO usuarios (rol_id, nombre_usuario, email, clave, nombre_completo, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [3, nombre_usuario, email, hashedPassword, nombre_completo, telefono, direccion]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, clave } = req.body;

        // Buscar usuario por email
        const [users] = await pool.query(
            'SELECT u.*, r.nombre_rol FROM usuarios u JOIN roles r ON u.rol_id = r.id WHERE u.email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(clave, user.clave);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                rol: user.nombre_rol
            },
            process.env.JWT_SECRET || 'tu_secreto_seguro',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                email: user.email,
                rol: user.nombre_rol
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Ruta para crear un usuario administrador (solo para desarrollo)
router.post('/create-admin', async (req, res) => {
    try {
        const { nombre_usuario, email, clave, nombre_completo } = req.body;
        
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clave, salt);

        // Insertar nuevo usuario administrador (rol_id 1 = Administrador)
        const [result] = await pool.query(
            'INSERT INTO usuarios (rol_id, nombre_usuario, email, clave, nombre_completo) VALUES (?, ?, ?, ?, ?)',
            [1, nombre_usuario, email, hashedPassword, nombre_completo]
        );

        res.status(201).json({ message: 'Administrador creado exitosamente' });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({ message: 'Error al crear administrador' });
    }
});

module.exports = router; 