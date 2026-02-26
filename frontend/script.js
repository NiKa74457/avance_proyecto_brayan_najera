// Manejo del formulario de registro
const formulario = document.getElementById('registro-form');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura de datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    try {
        // Petición a tu API en Render
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
            window.location.href = 'login.html'; // Te manda a loguearte
        } else {
            alert("Error: " + datos.mensaje);
        }
    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con la academia. Intenta más tarde.");
    }
});