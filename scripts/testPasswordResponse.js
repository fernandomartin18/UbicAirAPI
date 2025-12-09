/**
 * Test para verificar que el cambio de contraseña devuelve el usuario completo
 * Ejecutar con: node scripts/testPasswordResponse.js
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
    console.log(JSON.stringify({
      id: usuarioAntes._id,
      nombre: usuarioAntes.nombre,
      email: usuarioAntes.email,
      fotoPerfil: usuarioAntes.fotoPerfil
    }, null, 2));

    // Cambiar contraseña usando el servicio
    console.log('\n🔑 Cambiando contraseña...');
    const resultado = await userService.cambiarPassword(
      usuarioAntes._id.toString(),
      'finalPassword123',
      'nuevaPassword999'
    );

    console.log('\n📦 Respuesta del servicio cambiarPassword:');
    console.log(JSON.stringify({
      mensaje: resultado.mensaje,
      usuario: {
        id: resultado.usuario._id,
        nombre: resultado.usuario.nombre,
        email: resultado.usuario.email,
        fotoPerfil: resultado.usuario.fotoPerfil
      }
    }, null, 2));

    // Verificaciones
    console.log('\n✅ Verificaciones:');
    console.log('✓ Devuelve mensaje:', resultado.mensaje ? '✅' : '❌');
    console.log('✓ Devuelve usuario:', resultado.usuario ? '✅' : '❌');
    console.log('✓ Usuario tiene fotoPerfil:', resultado.usuario.fotoPerfil ? '✅' : '❌');
    console.log('✓ Foto se mantiene igual:', 
      resultado.usuario.fotoPerfil === usuarioAntes.fotoPerfil ? '✅' : '❌');
    console.log('✓ Usuario NO tiene password:', 
      resultado.usuario.password === undefined ? '✅' : '❌');

    if (resultado.usuario.fotoPerfil === usuarioAntes.fotoPerfil) {
      console.log('\n🎉 ¡PERFECTO! La foto de perfil se mantiene y se devuelve en la respuesta');
    } else {
      console.log('\n❌ ERROR: Hay un problema con la foto de perfil');
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completado. Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el test:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

test();
