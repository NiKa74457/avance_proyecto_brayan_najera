const formulario = document.getElementById('contact-form');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        rol: document.getElementById('rol').value
    };

    try {
        const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Registro exitoso! Ya eres parte de la academia");
            window.location.href = 'login.html';
        } else {
            alert("Error: " + resultado.mensaje);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
    }
});