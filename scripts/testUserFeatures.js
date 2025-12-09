/**
 * Script de prueba para verificar el cambio de contraseña y foto de perfil
 * Ejecutar con: node scripts/testUserFeatures.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function test() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar un usuario de prueba o crear uno
    let usuario = await User.findOne({ email: 'test@ubicair.com' });
    
    if (!usuario) {
      console.log('\n📝 Creando usuario de prueba...');
      usuario = new User({
        nombre: 'Usuario Test',
        email: 'test@ubicair.com',
        password: 'password123'
      });
      await usuario.save();
      console.log('✅ Usuario de prueba creado');
    }

    console.log('\n📋 Usuario antes de las actualizaciones:');
    console.log({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      fotoPerfil: usuario.fotoPerfil
    });

    // Probar actualización de foto de perfil
    console.log('\n🖼️  Actualizando foto de perfil...');
    usuario.fotoPerfil = 'https://ejemplo.com/foto-prueba.jpg';
    await usuario.save();
    console.log('✅ Foto de perfil actualizada');

    // Recargar usuario
    usuario = await User.findById(usuario._id);
    console.log('\n📋 Usuario después de actualizar foto:');
    console.log({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      fotoPerfil: usuario.fotoPerfil
    });

    // Probar cambio de contraseña
    console.log('\n🔑 Probando cambio de contraseña...');
    const passwordAnterior = usuario.password;
    usuario.password = 'nuevaPassword456';
    await usuario.save();
    
    // Recargar usuario
    usuario = await User.findById(usuario._id);
    const passwordNueva = usuario.password;
    
    console.log('\n📊 Comparación de contraseñas (hasheadas):');
    console.log('Anterior:', passwordAnterior.substring(0, 20) + '...');
    console.log('Nueva:   ', passwordNueva.substring(0, 20) + '...');
    console.log('¿Son diferentes?', passwordAnterior !== passwordNueva ? '✅ SÍ' : '❌ NO');

    // Probar login con la nueva contraseña
    console.log('\n🔐 Probando login con la nueva contraseña...');
    const passwordValida = await usuario.compararPassword('nuevaPassword456');
    console.log(passwordValida ? '✅ Login exitoso' : '❌ Login fallido');

    await mongoose.connection.close();
    console.log('\n✅ Pruebas completadas. Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

test();
