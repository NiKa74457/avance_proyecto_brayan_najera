document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensajeApi = document.getElementById('mensaje-api');

    try {
        const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            // Guardamos el token para que el navegador lo recuerde
            localStorage.setItem('token', datos.token);
            
            mensajeApi.style.color = "var(--primary)";
            mensajeApi.innerText = "¡Acceso concedido! Entrando...";

            // Redirigir a una página de perfil o inicio
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);
        } else {
            mensajeApi.style.color = "#ff4444";
            mensajeApi.innerText = datos.error || "Email o contraseña incorrectos";
        }
    } catch (error) {
        mensajeApi.innerText = "Error: El servidor no responde";
    }
});