// Manejo del formulario de registro original
const formulario = document.getElementById('contact-form');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Captura de datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    // 2. MIDDLEWARE DE VALIDACIÓN (Capa de seguridad frontend)
    // Validamos que el nombre no sea demasiado corto
    if (nombre.length < 3) {
        alert("⚠️ El nombre debe tener al menos 3 caracteres.");
        return; // Detiene la ejecución para no enviar datos basura
    }

    // Validamos el formato del correo con una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("⚠️ Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Validamos la seguridad de la contraseña
    if (password.length < 6) {
        alert("⚠️ La contraseña debe tener al menos 6 caracteres por seguridad.");
        return;
    }

    // 3. PETICIÓN AL SERVIDOR (Si pasó las validaciones de arriba)
    try {
        const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password, rol })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Registro exitoso! Ya eres parte de la academia");
            window.location.href = 'login.html'; 
        } else {
            // Si el servidor (backend) tiene sus propias validaciones, aquí las muestra
            alert("Error: " + (datos.mensaje || "No se pudo completar el registro"));
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con la academia. Intenta más tarde.");
    }
});