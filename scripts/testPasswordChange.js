/**
 * Script de prueba específico para el cambio de contraseña
 * Ejecutar con: node scripts/testPasswordChange.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function test() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar el usuario de prueba
    let usuario = await User.findOne({ email: 'test@ubicair.com' });
    
    if (!usuario) {
      console.log('❌ Usuario de prueba no encontrado. Ejecuta primero: npm run test:users');
      process.exit(1);
    }

    console.log('\n📋 Usuario ANTES del cambio de contraseña:');
    console.log({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      fotoPerfil: usuario.fotoPerfil,
      __v: usuario.__v
    });

    // Cambiar solo la contraseña
    console.log('\n🔑 Cambiando contraseña...');
    usuario.password = 'otraPassword789';
    await usuario.save();

    // Recargar usuario desde la BD
    usuario = await User.findById(usuario._id);

    console.log('\n📋 Usuario DESPUÉS del cambio de contraseña:');
    console.log({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      fotoPerfil: usuario.fotoPerfil,
      __v: usuario.__v
    });

    if (usuario.fotoPerfil) {
      console.log('\n✅ La foto de perfil se mantiene correctamente');
    } else {
      console.log('\n❌ ERROR: La foto de perfil se perdió');
    }

    await mongoose.connection.close();
    console.log('\n✅ Prueba completada. Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

test();
