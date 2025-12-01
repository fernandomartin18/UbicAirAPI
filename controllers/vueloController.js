const vueloService = require('../services/vueloService');

/**
 * Controlador para manejar las peticiones HTTP relacionadas con vuelos
 */
class VueloController {
  /**
   * GET /api/vuelos
   * Obtener todos los vuelos con paginación y filtros
   */
  async obtenerVuelos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        origen: req.query.origen,
        destino: req.query.destino,
        aerolinea: req.query.aerolinea,
        fecha: req.query.fecha,
        retrasoMin: req.query.retrasoMin
      };

      const resultado = await vueloService.obtenerTodosLosVuelos(page, limit, filters);

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
   * GET /api/vuelos/:id
   * Obtener un vuelo específico por ID
   */
  async obtenerVueloPorId(req, res) {
    try {
      const vuelo = await vueloService.obtenerVueloPorId(req.params.id);

      res.status(200).json({
        success: true,
        data: vuelo
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/origen/:codigo
   * Buscar vuelos por origen
   */
  async buscarPorOrigen(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await vueloService.buscarPorOrigen(
        req.params.codigo,
        page,
        limit
      );

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
   * GET /api/vuelos/destino/:codigo
   * Buscar vuelos por destino
   */
  async buscarPorDestino(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await vueloService.buscarPorDestino(
        req.params.codigo,
        page,
        limit
      );

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
   * GET /api/vuelos/ruta/:origen/:destino
   * Buscar vuelos por ruta (origen y destino)
   */
  async buscarPorRuta(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await vueloService.buscarPorRuta(
        req.params.origen,
        req.params.destino,
        page,
        limit
      );

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
   * GET /api/vuelos/aerolinea/:nombre
   * Buscar vuelos por aerolínea
   */
  async buscarPorAerolinea(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await vueloService.buscarPorAerolinea(
        req.params.nombre,
        page,
        limit
      );

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
   * GET /api/vuelos/retrasados
   * Buscar vuelos con retrasos
   */
  async buscarVuelosRetrasados(req, res) {
    try {
      const minRetraso = parseInt(req.query.minutos) || 0;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const resultado = await vueloService.buscarVuelosRetrasados(
        minRetraso,
        page,
        limit
      );

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
   * GET /api/vuelos/estadisticas
   * Obtener estadísticas generales de vuelos
   */
  async obtenerEstadisticas(req, res) {
    try {
      const stats = await vueloService.obtenerEstadisticas();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/aeropuertos
   * Obtener lista de aeropuertos únicos
   */
  async obtenerAeropuertos(req, res) {
    try {
      const aeropuertos = await vueloService.obtenerAeropuertos();

      res.status(200).json({
        success: true,
        data: aeropuertos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/aerolineas
   * Obtener lista de aerolíneas únicas
   */
  async obtenerAerolineas(req, res) {
    try {
      const aerolineas = await vueloService.obtenerAerolineas();

      res.status(200).json({
        success: true,
        data: aerolineas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/analisis-retrasos
   * Obtener análisis de retrasos (mensual y distribución)
   */
  async obtenerAnalisisRetrasos(req, res) {
    try {
      const analisis = await vueloService.obtenerAnalisisRetrasos();

      res.status(200).json({
        success: true,
        data: analisis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/comparacion-aerolineas
   * Obtener comparación de aerolíneas
   */
  async obtenerComparacionAerolineas(req, res) {
    try {
      const comparacion = await vueloService.obtenerComparacionAerolineas();

      res.status(200).json({
        success: true,
        data: comparacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/vuelos/rutas-populares
   * Obtener rutas populares y distribución por distancia
   */
  async obtenerRutasPopulares(req, res) {
    try {
      const rutas = await vueloService.obtenerRutasPopulares();

      res.status(200).json({
        success: true,
        data: rutas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new VueloController();
