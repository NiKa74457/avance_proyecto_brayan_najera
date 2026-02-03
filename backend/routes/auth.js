const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- MIDDLEWARE DE VERIFICACIÓN ---
// Esto sirve para proteger rutas. Solo deja pasar a quien tenga un token válido.
const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. No hay sesión activa." });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = verificado; // Guardamos el ID del usuario en la petición
        next(); // Continuar a la ruta
    } catch (error) {
        res.status(400).json({ error: "Token no válido o expirado." });
    }
};

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body; // Añadimos 'rol' que viene del form

        const usuarioExistente = await mongoose.model('User').findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: "Este correo ya está en uso" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(password, salt);

        const UserModel = mongoose.model('User');
        const nuevoUsuario = new UserModel({
            nombre,
            email,
            password: passwordHasheada,
            rol: rol || 'estudiante' // Guardamos el rol
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "¡Usuario registrado con éxito!" });

    } catch (error) {
        console.error("ERROR REGISTRO:", error.message);
        res.status(500).json({ error: "Error en el servidor: " + error.message });
    }
});

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await mongoose.model('User').findOne({ email });
        
        if (!usuario) return res.status(400).json({ error: "Credenciales inválidas" });

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(400).json({ error: "Credenciales inválidas" });

        const token = jwt.sign(
            { id: usuario._id }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '2h' }
        );

        res.json({ token, mensaje: "Bienvenido" });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// --- RUTA DE PERFIL (NUEVA) ---
// Aquí es donde perfil.js pide los datos de Carlos
router.get('/perfil', verificarToken, async (req, res) => {
    try {
        // Buscamos al usuario por ID pero NO enviamos el password por seguridad
        const usuario = await mongoose.model('User').findById(req.user.id).select('-password');
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
});

module.exports = router;