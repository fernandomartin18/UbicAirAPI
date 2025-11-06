const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * Rutas de usuarios
 */

// POST /api/users/register - Registrar un nuevo usuario
router.post('/register', userController.registrarUsuario.bind(userController));

// POST /api/users/login - Iniciar sesión
router.post('/login', userController.loginUsuario.bind(userController));

// GET /api/users - Obtener todos los usuarios (con paginación)
router.get('/', userController.obtenerUsuarios.bind(userController));

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', userController.obtenerUsuarioPorId.bind(userController));

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', userController.actualizarUsuario.bind(userController));

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', userController.eliminarUsuario.bind(userController));

module.exports = router;
