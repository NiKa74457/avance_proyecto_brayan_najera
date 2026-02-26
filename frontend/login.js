const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Guardamos el token para las páginas privadas
            localStorage.setItem('token', datos.token);
            alert("Acceso concedido. ¡Bienvenido de nuevo!");
            window.location.href = 'perfil.html'; 
        } else {
            alert("Credenciales incorrectas: " + (datos.mensaje || "Revisa tus datos"));
        }
    } catch (error) {
        console.error("Error en el login:", error);
    }
});