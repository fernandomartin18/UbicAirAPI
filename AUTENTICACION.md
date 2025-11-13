# Autenticación JWT - UbicAir API

## Resumen
La API ahora está protegida con tokens JWT (JSON Web Tokens). Las rutas públicas como login y register no requieren autenticación, pero las rutas protegidas requieren un token válido.

## Flujo de Autenticación

### 1. Registro de Usuario
**Endpoint:** `POST /api/users/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "_id": "..."
  }
}
```

### 2. Login
**Endpoint:** `POST /api/users/login`

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

⚠️ **Importante:** Guarda el token recibido, lo necesitarás para acceder a las rutas protegidas.

### 3. Usar Rutas Protegidas

Para acceder a rutas protegidas, incluye el token en el header `Authorization`:

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rutas de la API

### Rutas Públicas (No requieren token)
- `POST /api/users/register` - Registrar usuario
- `POST /api/users/login` - Iniciar sesión
- `GET /api/vuelos/*` - Todas las rutas de vuelos son públicas

### Rutas Protegidas (Requieren token)
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'
```

### Obtener usuarios (con token)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Ejemplos con JavaScript (Fetch)

### Login
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'juan@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  const token = data.data.token;
  
  // Guardar token en localStorage
  localStorage.setItem('token', token);
  
  return token;
};
```

### Usar rutas protegidas
```javascript
const obtenerUsuarios = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  return data;
};
```

## Respuestas de Error

### Token no proporcionado (401)
```json
{
  "success": false,
  "error": "No se proporcionó token de autenticación"
}
```

### Token inválido (401)
```json
{
  "success": false,
  "error": "Token inválido"
}
```

### Token expirado (401)
```json
{
  "success": false,
  "error": "Token expirado"
}
```

## Configuración

El token JWT expira en **24 horas** por defecto. Esto se puede configurar en el archivo `services/userService.js`:

```javascript
const token = jwt.sign(
  { id: usuario._id, email: usuario.email, nombre: usuario.nombre },
  process.env.JWT_SECRET,
  { expiresIn: '24h' } // Cambiar aquí: '1h', '7d', '30d', etc.
);
```

## Variables de Entorno

Asegúrate de tener configurada la variable `JWT_SECRET` en tu archivo `.env`:

```
JWT_SECRET=tu_clave_secreta_muy_segura_y_larga_para_jwt_2024
```

⚠️ **Seguridad:** En producción, usa una clave secreta fuerte y única. Nunca compartas tu JWT_SECRET.
