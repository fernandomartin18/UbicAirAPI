const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Servicio para manejar la lógica de negocio de usuarios
 */
class UserService {
  /**
   * Registrar un nuevo usuario
   */
  async registrarUsuario(nombre, email, password) {
    try {
      // Verificar si el usuario ya existe
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const nuevoUsuario = new User({
        nombre,
        email,
        password
      });

      // Guardar en la base de datos
      await nuevoUsuario.save();

      return nuevoUsuario;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('El email ya está registrado');
      }
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  /**
   * Obtener todos los usuarios con paginación
   */
  async obtenerTodosLosUsuarios(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const usuarios = await User.find()
        .select('-password')
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await User.countDocuments();

      return {
        usuarios,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async obtenerUsuarioPorId(id) {
    try {
      const usuario = await User.findById(id).select('-password');
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Obtener un usuario por email
   */
  async obtenerUsuarioPorEmail(email) {
    try {
      const usuario = await User.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  }

  /**
   * Actualizar un usuario
   */
  async actualizarUsuario(id, datos) {
    try {
      const usuario = await User.findByIdAndUpdate(
        id,
        { $set: datos },
        { new: true, runValidators: true }
      ).select('-password');

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return usuario;
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  /**
   * Eliminar un usuario
   */
  async eliminarUsuario(id) {
    try {
      const usuario = await User.findByIdAndDelete(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return { mensaje: 'Usuario eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }

  /**
   * Validar credenciales de usuario (para login)
   */
  async validarCredenciales(email, password) {
    try {
      const usuario = await User.findOne({ email });
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }

      const passwordValida = await usuario.compararPassword(password);
      if (!passwordValida) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token JWT
      const token = jwt.sign(
        { 
          id: usuario._id, 
          email: usuario.email,
          nombre: usuario.nombre 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expira en 24 horas
      );

      // Devolver usuario sin contraseña y con token
      const usuarioSinPassword = usuario.toJSON();
      return {
        ...usuarioSinPassword,
        token
      };
    } catch (error) {
      throw new Error(`Error al validar credenciales: ${error.message}`);
    }
  }

  /**
   * Cambiar contraseña de usuario
   */
  async cambiarPassword(id, passwordActual, passwordNueva) {
    try {
      // Obtener usuario con contraseña
      const usuario = await User.findById(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que la contraseña actual sea correcta
      const passwordValida = await usuario.compararPassword(passwordActual);
      if (!passwordValida) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Validar que la nueva contraseña cumpla con los requisitos
      if (!passwordNueva || passwordNueva.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      // Actualizar contraseña (se encriptará automáticamente por el middleware pre-save)
      usuario.password = passwordNueva;
      await usuario.save();

      return { mensaje: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  }

  /**
   * Actualizar foto de perfil del usuario
   */
  async actualizarFotoPerfil(id, urlFoto) {
    try {
      // Validar que se proporcione una URL
      if (!urlFoto || typeof urlFoto !== 'string') {
        throw new Error('Se debe proporcionar una URL válida para la foto de perfil');
      }

      // Actualizar foto de perfil
      const usuario = await User.findByIdAndUpdate(
        id,
        { $set: { fotoPerfil: urlFoto } },
        { new: true, runValidators: true }
      ).select('-password');

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      return usuario;
    } catch (error) {
      throw new Error(`Error al actualizar foto de perfil: ${error.message}`);
    }
  }
}

module.exports = new UserService();
