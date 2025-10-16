# UbicAir API

## Archivos

### 1. Modelo de Datos
- **`models/Vuelo.js`**: Esquema de Mongoose para la colección de vuelos

### 2. Capa de Servicios
- **`services/vueloService.js`**: Lógica de negocio para todas las operaciones de vuelos
  - Obtener vuelos con paginación
  - Buscar por origen, destino, ruta
  - Buscar por aerolínea
  - Buscar vuelos retrasados
  - Obtener estadísticas
  - Obtener lista de aeropuertos y aerolíneas
  - Filtros dinámicos

### 3. Controladores
- **`controllers/vueloController.js`**: Maneja las peticiones HTTP y respuestas
  - 10 métodos para diferentes endpoints
  - Manejo de errores
  - Validación de parámetros

### 4. Rutas
- **`routes/vuelos.js`**: Define todos los endpoints de la API
  - 10 endpoints RESTful
  - Documentación inline

### 5. Configuración
- **`config/database.js`**: Configuración de conexión a MongoDB Atlas
- **`.env`**: Variables de entorno (incluye tu connection string)

### 6. Documentación
- **`API_DOCUMENTATION.md`**: Documentación completa de la API
  - Descripción de todos los endpoints
  - Ejemplos de uso con curl
  - Ejemplos con JavaScript/Fetch
  - Códigos de respuesta

---

## Endpoints Disponibles

### Base URL: `http://localhost:3000/api/vuelos`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los vuelos (con filtros) |
| GET | `/:id` | Obtener un vuelo por ID |
| GET | `/origen/:codigo` | Vuelos por aeropuerto origen |
| GET | `/destino/:codigo` | Vuelos por aeropuerto destino |
| GET | `/ruta/:origen/:destino` | Vuelos por ruta específica |
| GET | `/aerolinea/:nombre` | Vuelos por aerolínea |
| GET | `/retrasados` | Vuelos con retrasos |
| GET | `/estadisticas` | Estadísticas generales |
| GET | `/aeropuertos` | Lista de aeropuertos |
| GET | `/aerolineas` | Lista de aerolíneas |

---

## Estructura del Proyecto

```
UbicAirAPI/
├── config/
│   └── database.js           # Conexión MongoDB
├── controllers/
│   └── vueloController.js    # Controladores HTTP
├── models/
│   └── Vuelo.js              # Modelo Mongoose
├── routes/
│   ├── index.js              # Rutas principales
│   ├── users.js              # Rutas de usuarios
│   └── vuelos.js             # Rutas de vuelos
├── services/
│   └── vueloService.js       # Lógica de negocio
├── .env                      # Variables de entorno
├── app.js                    # App Express
├── package.json
```

---

## Cómo Usar

### 1. Configurar MongoDB Atlas
Editar `.env` con connection string:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ubicair?retryWrites=true&w=majority
```

### 2. Iniciar el Servidor
```bash
npm start
```