const mongoose = require('mongoose');

const vueloSchema = new mongoose.Schema({
  FL_DATE: {
    type: String,
    required: true,
    description: 'Fecha del vuelo en formato YYYY-MM-DD'
  },
  DEP_DELAY: {
    type: Number,
    required: true,
    description: 'Retraso en la salida (minutos)'
  },
  ARR_DELAY: {
    type: Number,
    required: true,
    description: 'Retraso en la llegada (minutos)'
  },
  AIR_TIME: {
    type: Number,
    required: true,
    description: 'Tiempo en el aire (minutos)'
  },
  DISTANCE: {
    type: Number,
    required: true,
    description: 'Distancia del vuelo (millas)'
  },
  DEP_TIME: {
    type: Number,
    required: true,
    description: 'Hora de salida en formato decimal'
  },
  ARR_TIME: {
    type: Number,
    required: true,
    description: 'Hora de llegada en formato decimal'
  },
  ORIGIN: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    description: 'Código del aeropuerto de origen (ej: JFK)'
  },
  DEST: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    description: 'Código del aeropuerto de destino (ej: LAX)'
  },
  AIRLINE: {
    type: String,
    required: true,
    trim: true,
    description: 'Nombre de la aerolínea'
  }
}, {
  collection: 'vuelos',
  timestamps: false
});

// Índices para mejorar las búsquedas
vueloSchema.index({ ORIGIN: 1 });
vueloSchema.index({ DEST: 1 });
vueloSchema.index({ FL_DATE: 1 });
vueloSchema.index({ AIRLINE: 1 });

// Método para obtener el retraso total
vueloSchema.methods.getTotalDelay = function() {
  return this.DEP_DELAY + this.ARR_DELAY;
};

// Método para formatear la información del vuelo
vueloSchema.methods.getFlightInfo = function() {
  return `${this.AIRLINE}: ${this.ORIGIN} → ${this.DEST} (${this.FL_DATE})`;
};

const Vuelo = mongoose.model('Vuelo', vueloSchema);

module.exports = Vuelo;
