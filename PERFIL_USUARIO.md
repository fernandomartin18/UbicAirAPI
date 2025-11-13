# Gestión de Perfil de Usuario

## Descripción
Esta funcionalidad permite a los usuarios cambiar su contraseña y actualizar su foto de perfil.

## ✅ Verificación

He ejecutado las pruebas y confirmado que:
- ✅ El campo `fotoPerfil` se ha agregado correctamente al modelo User
- ✅ Todos los usuarios existentes tienen el campo `fotoPerfil` (migración completada)
- ✅ El cambio de contraseña funciona correctamente (la contraseña se encripta)
- ✅ La actualización de foto de perfil funciona correctamente

## 📋 Endpoints Disponibles

### 1. Cambiar Contraseña
**Endpoint:** `PUT /api/users/:id/password`  
**Autenticación:** Requerida (Bearer Token)  
**Restricción:** Los usuarios solo pueden cambiar su propia contraseña

**Request Body:**
```json
{
  "passwordActual": "contraseña_actual",
  "passwordNueva": "nueva_contraseña_minimo_6_caracteres"
}
```

**Response Exitoso (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada correctamente"
}
```

**Errores Posibles:**
- `400`: Campos faltantes o contraseña nueva muy corta
- `401`: Contraseña actual incorrecta
- `403`: Intento de cambiar contraseña de otro usuario
- `404`: Usuario no encontrado

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "passwordActual": "oldPassword123",
    "passwordNueva": "newPassword456"
  }'
```

---

### 2. Actualizar Foto de Perfil
**Endpoint:** `PUT /api/users/:id/foto-perfil`  
**Autenticación:** Requerida (Bearer Token)  
**Restricción:** Los usuarios solo pueden cambiar su propia foto

**Request Body:**
```json
{
  "fotoPerfil": "https://ejemplo.com/mi-foto.jpg"
}
```

**Response Exitoso (200):**
```json
{
  "success": true,
  "message": "Foto de perfil actualizada correctamente",
  "data": {
    "_id": "USER_ID",
    "nombre": "Nombre Usuario",
    "email": "email@ejemplo.com",
    "fotoPerfil": "https://ejemplo.com/mi-foto.jpg",
    "fechaRegistro": "2025-11-06T15:10:12.374Z",
    "createdAt": "2025-11-06T15:10:12.377Z",
    "updatedAt": "2025-11-13T16:00:00.000Z"
  }
}
```

**Errores Posibles:**
- `400`: URL de foto no proporcionada o inválida
- `403`: Intento de cambiar foto de otro usuario
- `404`: Usuario no encontrado

**Ejemplo con cURL:**
```bash
curl -X PUT http://localhost:3000/api/users/USER_ID/foto-perfil \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "fotoPerfil": "https://i.pravatar.cc/300"
  }'
```

---

## 🔒 Seguridad

### Validaciones de Contraseña
- La contraseña actual debe ser correcta
- La nueva contraseña debe tener al menos 6 caracteres
- La nueva contraseña debe ser diferente a la actual
- Las contraseñas se encriptan automáticamente con bcrypt antes de guardar

### Control de Acceso
- Los usuarios solo pueden modificar su propia información
- Se verifica el token JWT en cada petición
- El ID del usuario en el token debe coincidir con el ID en la URL

---

## 🛠️ Scripts de Utilidad

### Migrar Usuarios Existentes
Ejecuta este script si agregaste usuarios antes de implementar esta funcionalidad:

```bash
npm run migrate:users
```

Este script agrega el campo `fotoPerfil` a todos los usuarios que no lo tienen.

### Probar Funcionalidades
Ejecuta este script para verificar que todo funciona correctamente:

```bash
npm run test:users
```

Este script:
1. Crea un usuario de prueba (si no existe)
2. Actualiza su foto de perfil
3. Cambia su contraseña
4. Verifica que el login funcione con la nueva contraseña

---

## 📝 Modelo de Usuario Actualizado

```javascript
{
  nombre: String,           // Requerido
  email: String,           // Requerido, único
  password: String,        // Requerido, encriptado
  fotoPerfil: String,      // Opcional, URL de la foto
  fechaRegistro: Date,     // Auto-generado
  createdAt: Date,         // Auto-generado
  updatedAt: Date          // Auto-actualizado
}
```

---

## 🧪 Ejemplo de Flujo Completo

### 1. Login
```javascript
POST /api/users/login
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}

// Response incluye token
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    // ... datos del usuario
  }
}
```

### 2. Actualizar Foto de Perfil
```javascript
PUT /api/users/USER_ID/foto-perfil
Headers: { Authorization: "Bearer TOKEN" }
{
  "fotoPerfil": "https://mi-cdn.com/foto.jpg"
}
```

### 3. Cambiar Contraseña
```javascript
PUT /api/users/USER_ID/password
Headers: { Authorization: "Bearer TOKEN" }
{
  "passwordActual": "password123",
  "passwordNueva": "newSecurePassword456"
}
```

### 4. Login con Nueva Contraseña
```javascript
POST /api/users/login
{
  "email": "usuario@ejemplo.com",
  "password": "newSecurePassword456"
}
```

---

## ⚠️ Notas Importantes

1. **Almacenamiento de Fotos**: Actualmente la API solo guarda la URL de la foto. Necesitarás implementar el upload de archivos por separado (puede ser a un servicio como Cloudinary, AWS S3, etc.)

2. **Tokens**: Los tokens JWT expiran en 24 horas. Después de ese tiempo, el usuario deberá hacer login nuevamente.

3. **Validación de URLs**: La API valida que se proporcione una string, pero no valida que sea una URL accesible. Considera agregar validación adicional en el frontend.

4. **Contraseñas**: Se encriptan automáticamente usando bcrypt con salt de factor 10.
