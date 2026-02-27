document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const datos = await res.json();

        if (res.ok) {
            infoDiv.innerHTML = `
                <div style="margin-top:20px;">
                    <p><strong>NOMBRE:</strong> ${datos.nombre}</p>
                    <p><strong>EMAIL:</strong> ${datos.email}</p>
                    <p><strong>ROL:</strong> <span style="color:#4ade80; text-transform:uppercase;">${datos.rol}</span></p>
                </div>
            `;
        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        infoDiv.innerHTML = "<p>Error al cargar perfil.</p>";
    }

    // Lógica de Juegos (CRUD)
    const btnAgregar = document.getElementById('btn-agregar-juego');
    const inputJuego = document.getElementById('nuevo-juego');
    const listaJuegos = document.getElementById('lista-juegos');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            const nombreJuego = inputJuego.value.trim();
            if (nombreJuego !== "") {
                const li = document.createElement('li');
                li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:8px; border-radius:6px; border: 1px solid #333; border-left:4px solid #4ade80;";
                li.innerHTML = `
                    <span style="color: white;">🎮 ${nombreJuego}</span>
                    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">X</button>
                `;
                listaJuegos.appendChild(li);
                inputJuego.value = '';
            }
        });
    }
});

// Cerrar Sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});