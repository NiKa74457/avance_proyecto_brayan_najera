
const validarjuego = (req, res, next) => {
    const { nombre } = req.body;

    // Validación: que el nombre exista y no sean solo espacios
    if (!nombre || nombre.trim() === "") {
        res.status(400); // Código de error: Bad Request
        return next(new Error("El nombre del juego es obligatorio para el registro."));
    }

    // Validación: longitud mínima para evitar nombres basura
    if (nombre.trim().length < 2) {
        res.status(400);
        return next(new Error("El nombre del juego debe tener al menos 2 caracteres."));
    }

    // Si todo está bien, permitimos que continúe a la ruta
    next();
};

module.exports = validarjuego;