document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Cargar información del perfil desde la API
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const datos = await res.json();

        if (res.ok) {
            infoDiv.innerHTML = `
                <div style="margin-top:10px;">
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
        console.error("Error:", error);
        infoDiv.innerHTML = "<p>Error al cargar perfil.</p>";
    }

    // 2. Lógica para AÑADIR JUEGOS (CRUD: Create)
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
                inputJuego.value = ''; // Limpiar input después de añadir
            }
        });
    }

    // 3. NUEVO: Lógica para FILTRAR JUEGOS (Operación de búsqueda)
    const inputFiltro = document.getElementById('filtro-juego');

    if (inputFiltro) {
        inputFiltro.addEventListener('input', () => {
            const texto = inputFiltro.value.toLowerCase();
            const items = listaJuegos.getElementsByTagName('li');

            Array.from(items).forEach(item => {
                const nombreItem = item.querySelector('span').innerText.toLowerCase();
                // Si el texto del filtro está incluido en el nombre del juego, lo mostramos
                if (nombreItem.includes(texto)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});

// 4. Lógica para CERRAR SESIÓN
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});