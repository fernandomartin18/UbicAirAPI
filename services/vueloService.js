const Vuelo = require('../models/Vuelo');

/**
 * Servicio para manejar la lógica de negocio de vuelos
 */
class VueloService {
  /**
   * Obtener todos los vuelos con paginación
   */
  async obtenerTodosLosVuelos(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      console.log('Filtros recibidos:', filters);
      const query = this.construirQuery(filters);
      console.log('Query final:', JSON.stringify(query));

      const vuelos = await Vuelo.find(query)
        .limit(limit)
        .skip(skip)
        .lean();

      console.log('Vuelos encontrados:', vuelos.length);

      const total = await Vuelo.countDocuments(query);

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener vuelos: ${error.message}`);
    }
  }

  /**
   * Obtener un vuelo por ID
   */
  async obtenerVueloPorId(id) {
    try {
      const vuelo = await Vuelo.findById(id);
      if (!vuelo) {
        throw new Error('Vuelo no encontrado');
      }
      return vuelo;
    } catch (error) {
      throw new Error(`Error al obtener vuelo: ${error.message}`);
    }
  }

  /**
   * Buscar vuelos por origen
   */
  async buscarPorOrigen(origen, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const vuelos = await Vuelo.find({ ORIGIN: origen.toUpperCase() })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Vuelo.countDocuments({ ORIGIN: origen.toUpperCase() });

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar vuelos por origen: ${error.message}`);
    }
  }

  /**
   * Buscar vuelos por destino
   */
  async buscarPorDestino(destino, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const vuelos = await Vuelo.find({ DEST: destino.toUpperCase() })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Vuelo.countDocuments({ DEST: destino.toUpperCase() });

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar vuelos por destino: ${error.message}`);
    }
  }

  /**
   * Buscar vuelos por ruta (origen y destino)
   */
  async buscarPorRuta(origen, destino, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const vuelos = await Vuelo.find({
        ORIGIN: origen.toUpperCase(),
        DEST: destino.toUpperCase()
      })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Vuelo.countDocuments({
        ORIGIN: origen.toUpperCase(),
        DEST: destino.toUpperCase()
      });

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar vuelos por ruta: ${error.message}`);
    }
  }

  /**
   * Buscar vuelos por aerolínea
   */
  async buscarPorAerolinea(aerolinea, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const vuelos = await Vuelo.find({
        AIRLINE: { $regex: aerolinea, $options: 'i' }
      })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Vuelo.countDocuments({
        AIRLINE: { $regex: aerolinea, $options: 'i' }
      });

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar vuelos por aerolínea: ${error.message}`);
    }
  }

  /**
   * Buscar vuelos retrasados
   */
  async buscarVuelosRetrasados(minRetraso = 0, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const vuelos = await Vuelo.find({
        $or: [
          { DEP_DELAY: { $gt: minRetraso } },
          { ARR_DELAY: { $gt: minRetraso } }
        ]
      })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Vuelo.countDocuments({
        $or: [
          { DEP_DELAY: { $gt: minRetraso } },
          { ARR_DELAY: { $gt: minRetraso } }
        ]
      });

      return {
        vuelos,
        paginacion: {
          total,
          pagina: page,
          limite: limit,
          totalPaginas: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar vuelos retrasados: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de vuelos
   */
  async obtenerEstadisticas() {
    try {
      const stats = await Vuelo.aggregate([
        {
          $facet: {
            estadisticasGenerales: [
              {
                $group: {
                  _id: null,
                  totalVuelos: { $sum: 1 },
                  retrasoPromedioSalida: { $avg: '$DEP_DELAY' },
                  retrasoPromedioLlegada: { $avg: '$ARR_DELAY' },
                  tiempoPromedioVuelo: { $avg: '$AIR_TIME' },
                  distanciaPromedio: { $avg: '$DISTANCE' },
                  retrasoMaxSalida: { $max: '$DEP_DELAY' },
                  retrasoMaxLlegada: { $max: '$ARR_DELAY' }
                }
              }
            ],
            puntualidad: [
              {
                $project: {
                  retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
                }
              },
              {
                $group: {
                  _id: null,
                  totalVuelos: { $sum: 1 },
                  vuelosPuntuales: {
                    $sum: { $cond: [{ $lte: ['$retrasoTotal', 0] }, 1, 0] }
                  }
                }
              }
            ]
          }
        }
      ]);

      const statsData = stats[0].estadisticasGenerales[0] || {};
      const puntualidadData = stats[0].puntualidad[0] || { totalVuelos: 0, vuelosPuntuales: 0 };
      
      statsData.porcentajePuntualidad = puntualidadData.totalVuelos > 0 
        ? (puntualidadData.vuelosPuntuales / puntualidadData.totalVuelos) * 100 
        : 0;

      return statsData;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener análisis de retrasos
   */
  async obtenerAnalisisRetrasos() {
    try {
      // Análisis mensual de retrasos (extraer mes desde FL_DATE)
      const retrasosMensuales = await Vuelo.aggregate([
        {
          $project: {
            mes: { $month: { $dateFromString: { dateString: '$FL_DATE' } } },
            DEP_DELAY: 1,
            ARR_DELAY: 1
          }
        },
        {
          $group: {
            _id: '$mes',
            retrasoPromedioSalida: { $avg: '$DEP_DELAY' },
            retrasoPromedioLlegada: { $avg: '$ARR_DELAY' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Distribución de retrasos (basado en la suma de DEP_DELAY + ARR_DELAY)
      const distribucion = await Vuelo.aggregate([
        {
          $project: {
            retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
          }
        },
        {
          $facet: {
            adelantados: [
              { $match: { retrasoTotal: { $lt: -15 } } },
              { $count: 'count' }
            ],
            puntualesNegativo: [
              { $match: { retrasoTotal: { $gte: -15, $lt: 0 } } },
              { $count: 'count' }
            ],
            puntualesPositivo: [
              { $match: { retrasoTotal: { $gte: 0, $lte: 15 } } },
              { $count: 'count' }
            ],
            retrasoPequeno: [
              { $match: { retrasoTotal: { $gt: 15, $lte: 30 } } },
              { $count: 'count' }
            ],
            retrasoModerado: [
              { $match: { retrasoTotal: { $gt: 30, $lte: 60 } } },
              { $count: 'count' }
            ],
            retrasoGrande: [
              { $match: { retrasoTotal: { $gt: 60 } } },
              { $count: 'count' }
            ]
          }
        }
      ]);

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const retrasosPorMes = retrasosMensuales.map(item => ({
        mes: meses[item._id - 1] || `Mes ${item._id}`,
        retrasoPromedioSalida: parseFloat((item.retrasoPromedioSalida || 0).toFixed(2)),
        retrasoPromedioLlegada: parseFloat((item.retrasoPromedioLlegada || 0).toFixed(2))
      }));

      const dist = distribucion[0];
      const distribucionRetrasos = [
        { rango: '-30 a -15 min', cantidad: dist.adelantados[0]?.count || 0 },
        { rango: '-15 a 0 min', cantidad: dist.puntualesNegativo[0]?.count || 0 },
        { rango: '0-15 min', cantidad: dist.puntualesPositivo[0]?.count || 0 },
        { rango: '15-30 min', cantidad: dist.retrasoPequeno[0]?.count || 0 },
        { rango: '30-60 min', cantidad: dist.retrasoModerado[0]?.count || 0 },
        { rango: '60+ min', cantidad: dist.retrasoGrande[0]?.count || 0 }
      ];

      return {
        retrasosPorMes,
        distribucionRetrasos
      };
    } catch (error) {
      throw new Error(`Error al obtener análisis de retrasos: ${error.message}`);
    }
  }

  /**
   * Obtener aeropuertos únicos
   */
  async obtenerAeropuertos() {
    try {
      const origenes = await Vuelo.distinct('ORIGIN');
      const destinos = await Vuelo.distinct('DEST');
      const aeropuertos = [...new Set([...origenes, ...destinos])].sort();

      return {
        total: aeropuertos.length,
        aeropuertos
      };
    } catch (error) {
      throw new Error(`Error al obtener aeropuertos: ${error.message}`);
    }
  }

  /**
   * Obtener aerolíneas únicas
   */
  async obtenerAerolineas() {
    try {
      const aerolineas = await Vuelo.distinct('AIRLINE');
      return {
        total: aerolineas.length,
        aerolineas: aerolineas.sort()
      };
    } catch (error) {
      throw new Error(`Error al obtener aerolíneas: ${error.message}`);
    }
  }

  /**
   * Obtener comparación de aerolíneas
   */
  async obtenerComparacionAerolineas() {
    try {
      const comparacion = await Vuelo.aggregate([
        {
          $project: {
            AIRLINE: 1,
            DEP_DELAY: 1,
            ARR_DELAY: 1,
            DISTANCE: 1,
            AIR_TIME: 1,
            retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
          }
        },
        {
          $group: {
            _id: '$AIRLINE',
            totalVuelos: { $sum: 1 },
            retrasoPromedioSalida: { $avg: '$DEP_DELAY' },
            retrasoPromedioLlegada: { $avg: '$ARR_DELAY' },
            distanciaPromedio: { $avg: '$DISTANCE' },
            tiempoVueloPromedio: { $avg: '$AIR_TIME' },
            vuelosPuntuales: {
              $sum: {
                $cond: [{ $lte: ['$retrasoTotal', 0] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            aerolinea: '$_id',
            totalVuelos: 1,
            retrasoPromedioSalida: { $round: ['$retrasoPromedioSalida', 2] },
            retrasoPromedioLlegada: { $round: ['$retrasoPromedioLlegada', 2] },
            retrasoPromedio: {
              $round: [
                { $avg: ['$retrasoPromedioSalida', '$retrasoPromedioLlegada'] },
                2
              ]
            },
            distanciaPromedio: { $round: ['$distanciaPromedio', 0] },
            tiempoVueloPromedio: { $round: ['$tiempoVueloPromedio', 0] },
            porcentajePuntualidad: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$vuelosPuntuales', '$totalVuelos'] },
                    100
                  ]
                },
                2
              ]
            }
          }
        },
        {
          $sort: { totalVuelos: -1 }
        },
        {
          $limit: 20
        }
      ]);

      return comparacion;
    } catch (error) {
      throw new Error(`Error al obtener comparación de aerolíneas: ${error.message}`);
    }
  }

  /**
   * Obtener rutas populares
   */
  async obtenerRutasPopulares() {
    try {
      // Rutas con mayor tráfico
      const rutasPopulares = await Vuelo.aggregate([
        {
          $project: {
            ruta: { $concat: ['$ORIGIN', ' → ', '$DEST'] },
            ORIGIN: 1,
            DEST: 1,
            DISTANCE: 1,
            DEP_DELAY: 1,
            ARR_DELAY: 1,
            retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
          }
        },
        {
          $group: {
            _id: { origen: '$ORIGIN', destino: '$DEST' },
            ruta: { $first: '$ruta' },
            totalVuelos: { $sum: 1 },
            retrasoPromedio: { $avg: { $avg: ['$DEP_DELAY', '$ARR_DELAY'] } },
            distanciaPromedio: { $avg: '$DISTANCE' },
            vuelosPuntuales: {
              $sum: {
                $cond: [{ $lte: ['$retrasoTotal', 0] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            ruta: 1,
            totalVuelos: 1,
            retrasoPromedio: { $round: ['$retrasoPromedio', 2] },
            distancia: { $round: ['$distanciaPromedio', 0] },
            porcentajePuntualidad: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$vuelosPuntuales', '$totalVuelos'] },
                    100
                  ]
                },
                2
              ]
            }
          }
        },
        {
          $sort: { totalVuelos: -1 }
        },
        {
          $limit: 15
        }
      ]);

      // Distribución por distancia
      const distribucionDistancia = await Vuelo.aggregate([
        {
          $bucket: {
            groupBy: '$DISTANCE',
            boundaries: [0, 1000, 3000, 6000, 20000],
            default: 'Otras',
            output: {
              totalVuelos: { $sum: 1 }
            }
          }
        }
      ]);

      const categorias = ['Corta (< 1000 km)', 'Media (1000-3000 km)', 'Larga (3000-6000 km)', 'Ultra Larga (> 6000 km)'];
      const totalVuelos = distribucionDistancia.reduce((sum, cat) => sum + cat.totalVuelos, 0);
      
      const distribucion = distribucionDistancia.map((item, index) => ({
        categoria: categorias[index] || 'Otras',
        totalVuelos: item.totalVuelos,
        porcentaje: parseFloat(((item.totalVuelos / totalVuelos) * 100).toFixed(2))
      }));

      return {
        rutasPopulares,
        distribucionDistancia: distribucion
      };
    } catch (error) {
      throw new Error(`Error al obtener rutas populares: ${error.message}`);
    }
  }

  /**
   * Obtener análisis temporal
   */
  async obtenerAnalisisTemporal() {
    try {
      // Análisis por hora del día
      const analisisPorHora = await Vuelo.aggregate([
        {
          $project: {
            horaSalida: { $floor: '$DEP_TIME' },
            horaLlegada: { $floor: '$ARR_TIME' },
            DEP_DELAY: 1,
            ARR_DELAY: 1,
            retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
          }
        },
        {
          $facet: {
            salidas: [
              {
                $group: {
                  _id: '$horaSalida',
                  totalVuelos: { $sum: 1 },
                  retrasoPromedio: { $avg: '$retrasoTotal' }
                }
              },
              { $sort: { _id: 1 } }
            ],
            llegadas: [
              {
                $group: {
                  _id: '$horaLlegada',
                  totalVuelos: { $sum: 1 }
                }
              },
              { $sort: { _id: 1 } }
            ]
          }
        }
      ]);

      // Combinar datos de salidas y llegadas por hora
      const salidasMap = new Map();
      const llegadasMap = new Map();
      
      analisisPorHora[0].salidas.forEach(item => {
        salidasMap.set(item._id, {
          salidas: item.totalVuelos,
          retrasoPromedio: parseFloat((item.retrasoPromedio || 0).toFixed(2))
        });
      });
      
      analisisPorHora[0].llegadas.forEach(item => {
        llegadasMap.set(item._id, item.totalVuelos);
      });

      const datosPorHora = [];
      for (let hora = 0; hora < 24; hora += 2) {
        const salidas = salidasMap.get(hora) || { salidas: 0, retrasoPromedio: 0 };
        const llegadas = llegadasMap.get(hora) || 0;
        
        datosPorHora.push({
          hora: `${hora.toString().padStart(2, '0')}:00`,
          salidas: salidas.salidas,
          llegadas: llegadas,
          retrasoPromedio: salidas.retrasoPromedio
        });
      }

      // Análisis por día de la semana
      const analisisSemanal = await Vuelo.aggregate([
        {
          $project: {
            diaSemana: { $dayOfWeek: { $dateFromString: { dateString: '$FL_DATE' } } },
            DEP_DELAY: 1,
            ARR_DELAY: 1,
            retrasoTotal: { $add: ['$DEP_DELAY', '$ARR_DELAY'] }
          }
        },
        {
          $group: {
            _id: '$diaSemana',
            totalVuelos: { $sum: 1 },
            retrasoPromedio: { $avg: '$retrasoTotal' },
            vuelosPuntuales: {
              $sum: {
                $cond: [{ $lte: ['$retrasoTotal', 0] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            diaSemana: '$_id',
            totalVuelos: 1,
            retrasoPromedio: { $round: ['$retrasoPromedio', 2] },
            porcentajePuntualidad: {
              $round: [
                {
                  $multiply: [
                    { $divide: ['$vuelosPuntuales', '$totalVuelos'] },
                    100
                  ]
                },
                2
              ]
            }
          }
        },
        { $sort: { diaSemana: 1 } }
      ]);

      const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const datosSemana = analisisSemanal.map(item => ({
        dia: diasSemana[item.diaSemana - 1],
        totalVuelos: item.totalVuelos,
        retrasoPromedio: item.retrasoPromedio,
        porcentajePuntualidad: item.porcentajePuntualidad
      }));

      // Calcular horas pico
      const horaPicoSalidas = datosPorHora.reduce((max, item) => 
        item.salidas > max.salidas ? item : max
      );
      const horaPicoLlegadas = datosPorHora.reduce((max, item) => 
        item.llegadas > max.llegadas ? item : max
      );

      return {
        datosPorHora,
        datosSemana,
        horasPico: {
          salidas: horaPicoSalidas.hora,
          llegadas: horaPicoLlegadas.hora
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener análisis temporal: ${error.message}`);
    }
  }

  /**
   * Construir query para filtros dinámicos
   */
  construirQuery(filters) {
    const query = {};

    // Si se proporciona search, buscar en origen O destino
    if (filters.search) {
      const searchUpper = filters.search.toUpperCase();
      console.log('Búsqueda con:', searchUpper);
      query.$or = [
        { ORIGIN: { $regex: searchUpper, $options: 'i' } },
        { DEST: { $regex: searchUpper, $options: 'i' } }
      ];
      console.log('Query construida:', JSON.stringify(query));
    } else {
      // Filtros individuales (comportamiento original)
      if (filters.origen) {
        query.ORIGIN = filters.origen.toUpperCase();
      }

      if (filters.destino) {
        query.DEST = filters.destino.toUpperCase();
      }
    }

    if (filters.aerolinea) {
      query.AIRLINE = { $regex: filters.aerolinea, $options: 'i' };
    }

    if (filters.fecha) {
      query.FL_DATE = filters.fecha;
    }

    if (filters.retrasoMin) {
      if (query.$or) {
        // Si ya existe $or, agregamos las condiciones en un $and
        query.$and = [
          { $or: query.$or },
          {
            $or: [
              { DEP_DELAY: { $gte: parseInt(filters.retrasoMin) } },
              { ARR_DELAY: { $gte: parseInt(filters.retrasoMin) } }
            ]
          }
        ];
        delete query.$or;
      } else {
        query.$or = [
          { DEP_DELAY: { $gte: parseInt(filters.retrasoMin) } },
          { ARR_DELAY: { $gte: parseInt(filters.retrasoMin) } }
        ];
      }
    }

    return query;
  }
}

module.exports = new VueloService();
