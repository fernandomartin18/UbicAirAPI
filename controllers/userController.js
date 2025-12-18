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
      const { nombre, email, password, currentPassword, foto } = req.body;
      const datosActualizar = {};

      if (nombre) datosActualizar.nombre = nombre;
      if (email) datosActualizar.email = email;
      if (foto !== undefined) datosActualizar.fotoPerfil = foto;

      // Si se proporciona una nueva contraseña, actualizarla también
      let usuario;
      if (password) {
        // Verificar que se proporcionó la contraseña actual
        if (!currentPassword) {
          return res.status(400).json({
            success: false,
            error: 'Se requiere la contraseña actual para cambiar la contraseña'
          });
        }
        usuario = await userService.actualizarUsuarioConPassword(req.params.id, datosActualizar, currentPassword, password);
      } else {
        usuario = await userService.actualizarUsuario(req.params.id, datosActualizar);
      }

      res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: usuario
      });
    } catch (error) {
      // Si el error es de contraseña incorrecta, devolver 401
      if (error.message.includes('contraseña actual es incorrecta')) {
        return res.status(401).json({
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

  /**
   * PUT /api/users/:id/password
   * Cambiar contraseña de un usuario
   */
  async cambiarPassword(req, res) {
    try {
      const { passwordActual, passwordNueva } = req.body;

      // Validar que se proporcionen ambas contraseñas
      if (!passwordActual || !passwordNueva) {
        return res.status(400).json({
          success: false,
          error: 'Se requieren la contraseña actual y la nueva contraseña'
        });
      }

      // Verificar que el usuario solo pueda cambiar su propia contraseña
      if (req.user.id !== req.params.id) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para cambiar la contraseña de otro usuario'
        });
      }

      const resultado = await userService.cambiarPassword(
        req.params.id,
        passwordActual,
        passwordNueva
      );

      res.status(200).json({
        success: true,
        message: resultado.mensaje,
        data: resultado.usuario
      });
    } catch (error) {
      if (error.message.includes('incorrecta')) {
        return res.status(401).json({
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
   * PUT /api/users/:id/foto-perfil
   * Actualizar foto de perfil de un usuario
   */
  async actualizarFotoPerfil(req, res) {
    try {
      const { fotoPerfil } = req.body;

      // Validar que se proporcione la URL de la foto
      if (!fotoPerfil) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere la URL de la foto de perfil'
        });
      }

      // Verificar que el usuario solo pueda cambiar su propia foto
      if (req.user.id !== req.params.id) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permisos para cambiar la foto de otro usuario'
        });
      }

      const usuario = await userService.actualizarFotoPerfil(
        req.params.id,
        fotoPerfil
      );

      res.status(200).json({
        success: true,
        message: 'Foto de perfil actualizada correctamente',
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
   * GET /api/users/:id/favorites
   * Obtener favoritos de un usuario
   */
  async obtenerFavoritos(req, res) {
    try {
      const favoritos = await userService.obtenerFavoritos(req.params.id);

      res.status(200).json({
        success: true,
        data: {
          favorites: favoritos
        }
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/users/:id/favorites
   * Añadir un vuelo a favoritos
   */
  async agregarFavorito(req, res) {
    try {
      const { flight } = req.body;

      if (!flight) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere la información del vuelo'
        });
      }

      const favoritos = await userService.agregarFavorito(req.params.id, flight);

      res.status(200).json({
        success: true,
        message: 'Vuelo añadido a favoritos',
        data: {
          favorites: favoritos
        }
      });
    } catch (error) {
      if (error.message.includes('ya está en favoritos')) {
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
   * DELETE /api/users/:id/favorites
   * Eliminar un vuelo de favoritos
   */
  async eliminarFavorito(req, res) {
    try {
      const { flight } = req.body;

      if (!flight) {
        return res.status(400).json({
          success: false,
          error: 'Se requiere la información del vuelo'
        });
      }

      const favoritos = await userService.eliminarFavorito(req.params.id, flight);

      res.status(200).json({
        success: true,
        message: 'Vuelo eliminado de favoritos',
        data: {
          favorites: favoritos
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
