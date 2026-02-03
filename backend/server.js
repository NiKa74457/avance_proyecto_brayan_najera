require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// 1. Middlewares iniciales
// CORS permite que el frontend se comunique con el backend 
app.use(cors());
app.use(express.json());

// 2. Conexión a Base de Datos (MongoDB Atlas con variables de entorno)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.log('❌ Error de conexión:', err));

// 3. Rutas de la API 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 

// Ruta base de prueba
app.get('/', (req, res) => {
    res.send('API de eSports Mentor Academy lista 🚀');
});

// 4. Middleware de manejo de errores personalizado 
app.use((err, req, res, next) => {
    console.error(err.stack); // Muestra el rastro del error en la terminal
    res.status(500).json({
        success: false,
        error: "Algo salió mal en el servidor de la Academia",
        mensaje: err.message
    });
});

// 5. Configuración del Puerto y Encendido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
    console.log(`🎮 Academia de eSports lista para el despliegue preliminar`);
});