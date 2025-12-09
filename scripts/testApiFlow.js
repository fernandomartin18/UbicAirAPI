/**
 * Test simulando el flujo completo de la API
 * Ejecutar con: node scripts/testApiFlow.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const userService = require('../services/userService');

async function test() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener el usuario de prueba
    const usuarioAntes = await userService.obtenerUsuarioPorEmail('test@ubicair.com');
    
    console.log('\n📋 Usuario ANTES del cambio de contraseña:');
    console.log({
      id: usuarioAntes._id,
      nombre: usuarioAntes.nombre,
      email: usuarioAntes.email,
      fotoPerfil: usuarioAntes.fotoPerfil
    });

    // Cambiar contraseña usando el servicio (como lo haría el controlador)
    console.log('\n🔑 Llamando a userService.cambiarPassword...');
    await userService.cambiarPassword(
      usuarioAntes._id.toString(),
      'otraPassword789',
      'finalPassword123'
    );

    // Obtener el usuario después del cambio
    const usuarioDespues = await userService.obtenerUsuarioPorId(usuarioAntes._id.toString());

    console.log('\n📋 Usuario DESPUÉS del cambio de contraseña:');
    console.log({
      id: usuarioDespues._id,
      nombre: usuarioDespues.nombre,
      email: usuarioDespues.email,
      fotoPerfil: usuarioDespues.fotoPerfil
    });

    console.log('\n📊 Comparación:');
    console.log('Foto ANTES:', usuarioAntes.fotoPerfil);
    console.log('Foto DESPUÉS:', usuarioDespues.fotoPerfil);

    if (usuarioDespues.fotoPerfil === usuarioAntes.fotoPerfil) {
      console.log('\n✅ La foto de perfil se mantiene correctamente');
    } else {
      console.log('\n❌ ERROR: La foto de perfil cambió o se perdió');
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completado. Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

test();
