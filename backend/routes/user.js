const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // El que protege la ruta
const User = require('../models/User');
const validarjuego = require('../middleware/validarjuego'); // El nuevo validador que creamos

// 1. OBTENER PERFIL
// Actualizado para usar 'next' y conectar con tu errorMiddleware
router.get('/perfil', auth, async (req, res, next) => {
    try {
        const usuario = await User.findById(req.user.id).select('-password');
        if (!usuario) {
            res.status(404);
            throw new Error("Usuario no encontrado");
        }
        res.json(usuario);
    } catch (error) {
        next(error); // Envía el fallo a tu middleware de gestión de errores
    }
});

// 2. AÑADIR JUEGOS (Ruta con Validación Adicional)
// Cumple con: Middleware de validación y robustez de la API
router.post('/juegos', auth, validarjuego, async (req, res, next) => {
    try {
        const { nombre } = req.body;
        const usuario = await User.findById(req.user.id);

        if (!usuario) {
            res.status(404);
            throw new Error("Usuario no encontrado para añadir juegos");
        }

        // Añadimos el juego al array (asumiendo que tu modelo User tiene el campo 'juegos')
        usuario.juegos.push({ nombre });
        await usuario.save();

        res.status(201).json({
            success: true,
            message: "Juego añadido con éxito",
            juegos: usuario.juegos
        });
    } catch (error) {
        next(error); // Gestión de errores centralizada
    }
});

module.exports = router;