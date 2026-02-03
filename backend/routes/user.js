const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // El que protege la ruta
const User = require('../models/User');

// AQUÍ ES DONDE EXISTE EL /PERFIL
router.get('/perfil', auth, async (req, res) => {
    try {
        // Buscamos al usuario por el ID que viene en el token (sin la contraseña)
        const usuario = await User.findById(req.user.id).select('-password');
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

module.exports = router;