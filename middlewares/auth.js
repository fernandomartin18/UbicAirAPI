const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT
 * Se espera que el token venga en el header Authorization: Bearer <token>
 */
const verificarToken = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No se proporcionó token de autenticación'
      });
    }

    // El formato esperado es: "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Formato de token inválido'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar la información del usuario decodificada al request
    req.usuario = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expirado'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Error al verificar el token'
    });
  }
};

/**
 * Middleware opcional - No falla si no hay token, pero lo valida si existe
 */
const verificarTokenOpcional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
      }
    }

    next();
  } catch (error) {
    // Si el token es inválido en modo opcional, simplemente continúa sin usuario
    next();
  }
};

module.exports = {
  verificarToken,
  verificarTokenOpcional
};
