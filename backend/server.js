require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <-- AÑADIDO: Para manejar rutas de carpetas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// 1. Middlewares iniciales
app.use(cors());
app.use(express.json());

// --- AÑADIDO: Servidor de archivos estáticos ---
// Sirve los archivos de la carpeta frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. Conexión a Base de Datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.log('❌ Error de conexión:', err));

// 3. Rutas de la API 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 

// Ruta base (Modificada ligeramente para cargar tu index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 4. Middleware de manejo de errores personalizado 
app.use((err, req, res, next) => {
    console.error(err.stack);
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