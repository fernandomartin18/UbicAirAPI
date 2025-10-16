const mongoose = require('mongoose');

// Ejemplo de modelo para vuelos
const vueloSchema = new mongoose.Schema({
  origen: {
    type: String,
    required: true,
    trim: true
  },
  destino: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  aerolinea: {
    type: String,
    required: true
  },
  numeroVuelo: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

const Vuelo = mongoose.model('Vuelo', vueloSchema);

module.exports = Vuelo;
