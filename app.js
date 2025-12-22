require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const connectDB = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vuelosRouter = require('./routes/vuelos');
var telemetriaRouter = require('./routes/telemetria');

var app = express();

// Conectar a MongoDB Atlas
connectDB();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/vuelos', vuelosRouter);
app.use('/api/telemetry', telemetriaRouter);

// Ruta directa para login (alias de /api/users/login)
// Para compatibilidad con el simulador IoT
const userController = require('./controllers/userController');
app.post('/api/login', userController.loginUsuario.bind(userController));

module.exports = app;
