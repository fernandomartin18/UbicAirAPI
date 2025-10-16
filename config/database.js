const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado');
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    process.exit(1);
  }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

module.exports = connectDB;
