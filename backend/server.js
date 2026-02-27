require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// 1. Middlewares iniciales
app.use(cors());
app.use(express.json());

// --- Servidor de archivos estáticos ---
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Conexión a Base de Datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.log('❌ Error de conexión:', err));

// 3. Rutas de la API 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 

// Ruta base
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 4. Middleware de manejo de errores personalizado (Ajustado)
// Este bloque ahora detecta si el error es una validación fallida (400)
app.use((err, req, res, next) => {
    // Si res.statusCode ya fue marcado (ej. por validarjuego), lo usamos. 
    // Si no, usamos 500 para errores internos.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[Error]: ${err.message}`); 

    res.status(statusCode).json({
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