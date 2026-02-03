document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Capturamos los datos de los inputs
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;
    const mensajeApi = document.getElementById('mensaje-api');

    try {
        // 2. Enviamos la petición POST al servidor de Node.js
        const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password, rol })
        });

        const datos = await respuesta.json();

        // 3. Manejamos la respuesta visualmente
        if (respuesta.ok) {
            mensajeApi.style.color = "var(--primary)"; 
            mensajeApi.innerText = "¡Registro exitoso! Ya eres parte de la academia.";
            document.getElementById('contact-form').reset(); // Limpia el formulario
        } else {
            mensajeApi.style.color = "#ff4444"; 
            mensajeApi.innerText = datos.error || "Error al registrar usuario";
        }

    } catch (error) {
        console.error("Error en la conexión:", error);
        mensajeApi.style.color = "var(--secondary)"; // 
        mensajeApi.innerText = "No se pudo conectar con el servidor. ¿Está encendido?";
    }
});