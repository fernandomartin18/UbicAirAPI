const mongoose = require('mongoose');

/**
 * Esquema de Telemetría para datos IoT de vuelos en tiempo real
 */
const telemetriaSchema = new mongoose.Schema({
  flightId: {
    type: String,
    required: [true, 'El ID del vuelo es obligatorio'],
    index: true
  },
  latitude: {
    type: Number,
    required: [true, 'La latitud es obligatoria'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'La longitud es obligatoria'],
    min: -180,
    max: 180
  },
  altitude: {
    type: Number,
    required: [true, 'La altitud es obligatoria'],
    min: 0
  },
  speed: {
    type: Number,
    required: [true, 'La velocidad es obligatoria'],
    min: 0
  },
  fuel: {
    type: Number,
    required: [true, 'El nivel de combustible es obligatorio'],
    min: 0
  },
  origin: {
    type: String,
    required: [true, 'El origen es obligatorio']
  },
  destination: {
    type: String,
    required: [true, 'El destino es obligatorio']
  },
  progress: {
    type: Number,
    required: [true, 'El progreso es obligatorio'],
    min: 0,
    max: 100
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Índice compuesto para búsquedas eficientes por vuelo y tiempo
telemetriaSchema.index({ flightId: 1, timestamp: -1 });

// Índice para búsquedas geoespaciales
telemetriaSchema.index({ latitude: 1, longitude: 1 });

// Método estático para obtener telemetría reciente de un vuelo
telemetriaSchema.statics.getRecentTelemetry = function(flightId, limit = 10) {
  return this.find({ flightId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Método estático para obtener todos los vuelos activos (últimos 5 minutos y progreso < 98%)
telemetriaSchema.statics.getActiveFlights = function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: fiveMinutesAgo },
        progress: { $lt: 98 } // Filtrar temprano para mayor eficiencia
      }
    },
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: '$flightId',
        latestData: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latestData' }
    }
  ]);
};

// Método estático para limpiar telemetría antigua (más de 24 horas)
telemetriaSchema.statics.cleanOldTelemetry = function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  return this.deleteMany({
    timestamp: { $lt: twentyFourHoursAgo }
  });
};

module.exports = mongoose.model('Telemetria', telemetriaSchema);
