/**
 * Script de migración para agregar el campo fotoPerfil a usuarios existentes
 * Ejecutar con: node scripts/migrateUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function migrate() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Actualizar todos los usuarios que no tengan el campo fotoPerfil
    const result = await User.updateMany(
      { fotoPerfil: { $exists: false } },
      { $set: { fotoPerfil: null } }
    );

    console.log(`✅ Migración completada. Usuarios actualizados: ${result.modifiedCount}`);

    // Mostrar un usuario de ejemplo
    const usuarioEjemplo = await User.findOne().select('-password');
    console.log('\n📋 Ejemplo de usuario actualizado:');
    console.log(usuarioEjemplo);

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    process.exit(1);
  }
}

migrate();
