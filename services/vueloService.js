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
      const query = this.construirQuery(filters);

      const vuelos = await Vuelo.find(query)
        .limit(limit)
        .skip(skip)
        .lean();

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
      ]);

      return stats[0] || {};
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
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
   * Construir query para filtros dinámicos
   */
  construirQuery(filters) {
    const query = {};

    if (filters.origen) {
      query.ORIGIN = filters.origen.toUpperCase();
    }

    if (filters.destino) {
      query.DEST = filters.destino.toUpperCase();
    }

    if (filters.aerolinea) {
      query.AIRLINE = { $regex: filters.aerolinea, $options: 'i' };
    }

    if (filters.fecha) {
      query.FL_DATE = filters.fecha;
    }

    if (filters.retrasoMin) {
      query.$or = [
        { DEP_DELAY: { $gte: parseInt(filters.retrasoMin) } },
        { ARR_DELAY: { $gte: parseInt(filters.retrasoMin) } }
      ];
    }

    return query;
  }
}

module.exports = new VueloService();
