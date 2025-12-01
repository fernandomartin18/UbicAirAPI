const express = require('express');
const router = express.Router();
const vueloController = require('../controllers/vueloController');
const { verificarTokenOpcional } = require('../middlewares/auth');

/**
 * @route   GET /api/vuelos
 * @desc    Obtener todos los vuelos con paginación y filtros opcionales
 * @query   page, limit, origen, destino, aerolinea, fecha, retrasoMin
 * @access  Public
 */
router.get('/', verificarTokenOpcional, vueloController.obtenerVuelos);

/**
 * @route   GET /api/vuelos/estadisticas
 * @desc    Obtener estadísticas generales de vuelos
 * @access  Public
 */
router.get('/estadisticas', vueloController.obtenerEstadisticas);

/**
 * @route   GET /api/vuelos/aeropuertos
 * @desc    Obtener lista de todos los aeropuertos
 * @access  Public
 */
router.get('/aeropuertos', vueloController.obtenerAeropuertos);

/**
 * @route   GET /api/vuelos/aerolineas
 * @desc    Obtener lista de todas las aerolíneas
 * @access  Public
 */
router.get('/aerolineas', vueloController.obtenerAerolineas);

/**
 * @route   GET /api/vuelos/analisis-retrasos
 * @desc    Obtener análisis de retrasos (mensual y distribución)
 * @access  Public
 */
router.get('/analisis-retrasos', vueloController.obtenerAnalisisRetrasos);

/**
 * @route   GET /api/vuelos/comparacion-aerolineas
 * @desc    Obtener comparación de aerolíneas
 * @access  Public
 */
router.get('/comparacion-aerolineas', vueloController.obtenerComparacionAerolineas);

/**
 * @route   GET /api/vuelos/retrasados
 * @desc    Obtener vuelos con retrasos
 * @query   minutos (retraso mínimo), page, limit
 * @access  Public
 */
router.get('/retrasados', vueloController.buscarVuelosRetrasados);

/**
 * @route   GET /api/vuelos/origen/:codigo
 * @desc    Buscar vuelos por aeropuerto de origen
 * @param   codigo - Código del aeropuerto (ej: JFK)
 * @query   page, limit
 * @access  Public
 */
router.get('/origen/:codigo', vueloController.buscarPorOrigen);

/**
 * @route   GET /api/vuelos/destino/:codigo
 * @desc    Buscar vuelos por aeropuerto de destino
 * @param   codigo - Código del aeropuerto (ej: LAX)
 * @query   page, limit
 * @access  Public
 */
router.get('/destino/:codigo', vueloController.buscarPorDestino);

/**
 * @route   GET /api/vuelos/ruta/:origen/:destino
 * @desc    Buscar vuelos por ruta específica
 * @param   origen - Código aeropuerto origen
 * @param   destino - Código aeropuerto destino
 * @query   page, limit
 * @access  Public
 */
router.get('/ruta/:origen/:destino', vueloController.buscarPorRuta);

/**
 * @route   GET /api/vuelos/aerolinea/:nombre
 * @desc    Buscar vuelos por aerolínea
 * @param   nombre - Nombre de la aerolínea
 * @query   page, limit
 * @access  Public
 */
router.get('/aerolinea/:nombre', vueloController.buscarPorAerolinea);

/**
 * @route   GET /api/vuelos/:id
 * @desc    Obtener un vuelo específico por ID
 * @param   id - ID del vuelo en MongoDB
 * @access  Public
 */
router.get('/:id', vueloController.obtenerVueloPorId);

module.exports = router;
