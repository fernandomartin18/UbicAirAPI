const express = require('express');
const router = express.Router();
const telemetriaController = require('../controllers/telemetriaController');
const { verificarToken } = require('../middlewares/auth');

/**
 * Rutas de Telemetría IoT
 * Endpoints para recibir y consultar datos de vuelos en tiempo real
 */

// POST /api/telemetry - Recibir telemetría de un vuelo (Pública para el simulador)
router.post('/', telemetriaController.recibirTelemetria);

// GET /api/telemetry/active - Obtener todos los vuelos activos (Pública)
router.get('/active', telemetriaController.obtenerVuelosActivos);

// GET /api/telemetry/flight/:flightId - Obtener historial de un vuelo específico (Pública)
router.get('/flight/:flightId', telemetriaController.obtenerHistorialVuelo);

// GET /api/telemetry/latest/:flightId - Obtener última posición de un vuelo (Pública)
router.get('/latest/:flightId', telemetriaController.obtenerUltimaPosicion);

// GET /api/telemetry/stats - Obtener estadísticas generales (Pública)
router.get('/stats', telemetriaController.obtenerEstadisticas);

// DELETE /api/telemetry/clean - Limpiar telemetría antigua (Protegida)
router.delete('/clean', verificarToken, telemetriaController.limpiarTelemetriaAntigua);

// DELETE /api/telemetry/flight/:flightId - Eliminar telemetría de un vuelo específico (Pública)
router.delete('/flight/:flightId', telemetriaController.eliminarVuelo);

// DELETE /api/telemetry/all - Eliminar toda la telemetría (Pública para el simulador)
router.delete('/all', telemetriaController.eliminarTodaLaTelemetria);

module.exports = router;
