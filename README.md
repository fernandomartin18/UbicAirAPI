Perfecto ✅ Aquí tienes tu **README.md** actualizado, con la nueva sección de **API de Usuarios** integrada de forma coherente, estructurada y visualmente uniforme con el estilo original:

---

# UbicAir API

API RESTful para la gestión de **vuelos** y **usuarios** dentro del ecosistema **UbicAir**.
Construida con **Node.js**, **Express** y **MongoDB (Mongoose)**.

---

## Archivos

### 1. Modelo de Datos

* **`models/Vuelo.js`**: Esquema de Mongoose para la colección de vuelos
* **`models/Usuario.js`**: Esquema de Mongoose para la colección de usuarios

### 2. Capa de Servicios

* **`services/vueloService.js`**: Lógica de negocio para las operaciones de vuelos

  * Obtener vuelos con paginación
  * Buscar por origen, destino, ruta
  * Buscar por aerolínea
  * Buscar vuelos retrasados
  * Obtener estadísticas
  * Obtener lista de aeropuertos y aerolíneas
  * Filtros dinámicos
* **`services/userService.js`**: Lógica de negocio para operaciones de usuarios

  * Registro, login, actualización y eliminación
  * Paginación y validación de datos

### 3. Controladores

* **`controllers/vueloController.js`**: Maneja las peticiones HTTP de vuelos
* **`controllers/userController.js`**: Maneja las peticiones HTTP de usuarios

  * Validación de credenciales
  * Encriptación de contraseñas
  * Manejo de errores

### 4. Rutas

* **`routes/vuelos.js`**: Endpoints de la API de vuelos
* **`routes/users.js`**: Endpoints de la API de usuarios

### 5. Configuración

* **`config/database.js`**: Conexión a MongoDB Atlas
* **`.env`**: Variables de entorno

### 6. Documentación

* **`API_DOCUMENTATION.md`**: Documentación completa de endpoints de vuelos y usuarios

---

## Endpoints Disponibles

### ✈️ Vuelos

**Base URL:** `http://localhost:3000/api/vuelos`

| Método | Endpoint                 | Descripción                            |
| ------ | ------------------------ | -------------------------------------- |
| GET    | `/`                      | Obtener todos los vuelos (con filtros) |
| GET    | `/:id`                   | Obtener un vuelo por ID                |
| GET    | `/origen/:codigo`        | Vuelos por aeropuerto origen           |
| GET    | `/destino/:codigo`       | Vuelos por aeropuerto destino          |
| GET    | `/ruta/:origen/:destino` | Vuelos por ruta específica             |
| GET    | `/aerolinea/:nombre`     | Vuelos por aerolínea                   |
| GET    | `/retrasados`            | Vuelos con retrasos                    |
| GET    | `/estadisticas`          | Estadísticas generales                 |
| GET    | `/aeropuertos`           | Lista de aeropuertos                   |
| GET    | `/aerolineas`            | Lista de aerolíneas                    |

---

### 👤 Usuarios

**Base URL:** `http://localhost:3000/api/users`

| Método | Endpoint    | Descripción                |
| ------ | ----------- | -------------------------- |
| POST   | `/register` | Registrar un nuevo usuario |
| POST   | `/login`    | Iniciar sesión             |
| GET    | `/`         | Obtener todos los usuarios |
| GET    | `/:id`      | Obtener usuario por ID     |
| PUT    | `/:id`      | Actualizar usuario         |
| DELETE | `/:id`      | Eliminar usuario           |

---

## Estructura del Proyecto

```
UbicAirAPI/
├── config/
│   └── database.js
├── controllers/
│   ├── vueloController.js
│   └── userController.js
├── models/
│   ├── Vuelo.js
│   └── Usuario.js
├── routes/
│   ├── index.js
│   ├── users.js
│   └── vuelos.js
├── services/
│   ├── vueloService.js
│   └── userService.js
├── .env
├── app.js
├── package.json
```

---

## Cómo Usar

### 1. Configurar MongoDB Atlas

Edita el archivo `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ubicair?retryWrites=true&w=majority
```

### 2. Iniciar el Servidor

```bash
npm start
```

---

# 🧩 API de Usuarios - UbicAir

API para la gestión de usuarios: registro, autenticación y mantenimiento.

---

## Endpoints Disponibles

### 1. Registrar Usuario

**POST** `/api/users/register`

Registra un nuevo usuario en el sistema.

**Body (JSON):**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Respuesta (201):**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "fechaRegistro": "2025-11-06T10:00:00.000Z"
  }
}
```

**Errores:**

* `400`: Faltan campos requeridos
* `409`: El email ya está registrado

---

### 2. Iniciar Sesión

**POST** `/api/users/login`

Valida las credenciales del usuario.

**Body (JSON):**

```json
{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Respuesta (200):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "fechaRegistro": "2025-11-06T10:00:00.000Z"
  }
}
```

---

### 3. Obtener Todos los Usuarios

**GET** `/api/users`

Obtiene una lista paginada de usuarios.

**Query Params:**
`page` (default: 1), `limit` (default: 10)

**Ejemplo:** `/api/users?page=1&limit=10`

---

### 4. Obtener Usuario por ID

**GET** `/api/users/:id`

Obtiene un usuario específico.

**Ejemplo:** `/api/users/507f1f77bcf86cd799439011`

---

### 5. Actualizar Usuario

**PUT** `/api/users/:id`

Actualiza los datos del usuario.

**Body (JSON):**

```json
{
  "nombre": "Juan Carlos Pérez",
  "email": "juancarlos@example.com"
}
```

---

### 6. Eliminar Usuario

**DELETE** `/api/users/:id`

Elimina un usuario del sistema.

---

## 🔒 Seguridad

* Contraseñas encriptadas con **bcrypt**
* Las contraseñas nunca se devuelven en las respuestas
* Validación estricta de formato de email

---

## 💾 Modelo de Datos - Usuario

```javascript
{
  nombre: String (requerido, mínimo 2 caracteres),
  email: String (requerido, único, formato válido),
  password: String (requerido, mínimo 6 caracteres, encriptado),
  fechaRegistro: Date (automático),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

---

## 🧠 Ejemplos de Uso con cURL

### Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "miPassword123"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "miPassword123"
  }'
```