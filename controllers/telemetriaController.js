const Telemetria = require('../models/Telemetria');

/**
 * Controlador de Telemetría IoT
 * Gestiona los datos en tiempo real de los vuelos simulados
 */
class TelemetriaController {
  
  /**
   * POST /api/telemetry
   * Recibe y almacena datos de telemetría de un vuelo
   */
  async recibirTelemetria(req, res) {
    try {
      const {
        flightId,
        latitude,
        longitude,
        altitude,
        speed,
        fuel,
        origin,
        destination,
        progress,
        timestamp
      } = req.body;

      // Validar datos obligatorios
      if (!flightId || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos obligatorios (flightId, latitude, longitude)'
        });
      }

      // Crear registro de telemetría
      const telemetria = new Telemetria({
        flightId,
        latitude,
        longitude,
        altitude: altitude || 0,
        speed: speed || 0,
        fuel: fuel || 0,
        origin: origin || 'UNK',
        destination: destination || 'UNK',
        progress: progress || 0,
        timestamp: timestamp || new Date()
      });

      await telemetria.save();

      res.status(201).json({
        success: true,
        message: 'Telemetría recibida correctamente',
        data: telemetria
      });

    } catch (error) {
      console.error('Error al recibir telemetría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al procesar telemetría',
        error: error.message
      });
    }
  }

  /**
   * GET /api/telemetry/active
   * Obtiene todos los vuelos activos (últimos 10 minutos)
   */
  async obtenerVuelosActivos(req, res) {
    try {
      const vuelosActivos = await Telemetria.getActiveFlights();

      res.json({
        success: true,
        count: vuelosActivos.length,
        data: vuelosActivos
      });

    } catch (error) {
      console.error('Error al obtener vuelos activos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener vuelos activos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/telemetry/flight/:flightId
   * Obtiene el historial de telemetría de un vuelo específico
   */
  async obtenerHistorialVuelo(req, res) {
    try {
      const { flightId } = req.params;
      const limit = parseInt(req.query.limit) || 100;

      const historial = await Telemetria.getRecentTelemetry(flightId, limit);

      res.json({
        success: true,
        flightId,
        count: historial.length,
        data: historial
      });

    } catch (error) {
      console.error('Error al obtener historial de vuelo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial de vuelo',
        error: error.message
      });
    }
  }

  /**
   * GET /api/telemetry/latest/:flightId
   * Obtiene la última posición de un vuelo
   */
  async obtenerUltimaPosicion(req, res) {
    try {
      const { flightId } = req.params;

      const ultimaPosicion = await Telemetria.findOne({ flightId })
        .sort({ timestamp: -1 });

      if (!ultimaPosicion) {
        return res.status(404).json({
          success: false,
          message: `No se encontró telemetría para el vuelo ${flightId}`
        });
      }

      res.json({
        success: true,
        data: ultimaPosicion
      });

    } catch (error) {
      console.error('Error al obtener última posición:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener última posición',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/telemetry/clean
   * Limpia telemetría antigua (más de 24 horas)
   * Solo para administradores
   */
  async limpiarTelemetriaAntigua(req, res) {
    try {
      const resultado = await Telemetria.cleanOldTelemetry();

      res.json({
        success: true,
        message: 'Telemetría antigua limpiada correctamente',
        deletedCount: resultado.deletedCount
      });

    } catch (error) {
      console.error('Error al limpiar telemetría:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar telemetría',
        error: error.message
      });
    }
  }

  /**
   * GET /api/telemetry/stats
   * Obtiene estadísticas generales de telemetría
   */
  async obtenerEstadisticas(req, res) {
    try {
      const totalRegistros = await Telemetria.countDocuments();
      const vuelosActivos = await Telemetria.getActiveFlights();
      
      // Vuelos únicos en las últimas 24 horas
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const vuelosUnicos = await Telemetria.distinct('flightId', {
        timestamp: { $gte: twentyFourHoursAgo }
      });

      res.json({
        success: true,
        stats: {
          totalRegistros,
          vuelosActivos: vuelosActivos.length,
          vuelosUltimas24h: vuelosUnicos.length,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
}

module.exports = new TelemetriaController();
