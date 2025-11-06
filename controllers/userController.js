const userService = require('../services/userService');

/**
 * Controlador para manejar las peticiones HTTP relacionadas con usuarios
 */
class UserController {
  /**
   * POST /api/users/register
   * Registrar un nuevo usuario
   */
  async registrarUsuario(req, res) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Todos los campos son obligatorios (nombre, email, password)'
        });
      }

      const usuario = await userService.registrarUsuario(nombre, email, password);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente',
        data: usuario
      });
    } catch (error) {
      if (error.message.includes('ya está registrado')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }

      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/users/login
   * Iniciar sesión
   */
  async loginUsuario(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son obligatorios'
        });
      }

      const usuario = await userService.validarCredenciales(email, password);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: usuario
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/users
   * Obtener todos los usuarios con paginación
   */
  async obtenerUsuarios(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await userService.obtenerTodosLosUsuarios(page, limit);

      res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/users/:id
   * Obtener un usuario específico por ID
   */
  async obtenerUsuarioPorId(req, res) {
    try {
      const usuario = await userService.obtenerUsuarioPorId(req.params.id);

      res.status(200).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/users/:id
   * Actualizar un usuario
   */
  async actualizarUsuario(req, res) {
    try {
      const { nombre, email } = req.body;
      const datosActualizar = {};

      if (nombre) datosActualizar.nombre = nombre;
      if (email) datosActualizar.email = email;

      const usuario = await userService.actualizarUsuario(req.params.id, datosActualizar);

      res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: usuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/users/:id
   * Eliminar un usuario
   */
  async eliminarUsuario(req, res) {
    try {
      const resultado = await userService.eliminarUsuario(req.params.id);

      res.status(200).json({
        success: true,
        message: resultado.mensaje
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
