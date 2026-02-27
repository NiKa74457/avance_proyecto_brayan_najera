// backend/middleware/validarjuego.js
const validarjuego = (req, res, next) => {
    const { nombre } = req.body;

    // Si no hay nombre o solo son espacios
    if (!nombre || nombre.trim() === "") {
        res.status(400);
        return next(new Error("El nombre del juego no puede estar vacío."));
    }

    // Si el nombre es demasiado corto (como esa 'j')
    if (nombre.trim().length < 3) {
        res.status(400);
        return next(new Error("El nombre debe tener al menos 3 caracteres (ej: LoL, CS2)."));
    }

    next(); // Si pasa las pruebas, continúa
};

module.exports = validarjuego;