const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken } = require('../middlewares/auth');

/**
 * Rutas de usuarios
 */

// POST /api/users/register - Registrar un nuevo usuario (pública)
router.post('/register', userController.registrarUsuario.bind(userController));

// POST /api/users/login - Iniciar sesión (pública)
router.post('/login', userController.loginUsuario.bind(userController));

// GET /api/users - Obtener todos los usuarios (con paginación) - Protegida
router.get('/', verificarToken, userController.obtenerUsuarios.bind(userController));

// GET /api/users/:id - Obtener un usuario por ID - Protegida
router.get('/:id', verificarToken, userController.obtenerUsuarioPorId.bind(userController));

// PUT /api/users/:id - Actualizar un usuario - Protegida
router.put('/:id', verificarToken, userController.actualizarUsuario.bind(userController));

// DELETE /api/users/:id - Eliminar un usuario - Protegida
router.delete('/:id', verificarToken, userController.eliminarUsuario.bind(userController));

module.exports = router;
