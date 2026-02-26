document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');

    // 1. VERIFICACIÓN DE SESIÓN
    if (!token) {
        // Si no hay sesión, mandamos al login
        window.location.href = 'login.html';
        return;
    }

    // 2. OBTENER DATOS DEL ATLETA
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const datos = await res.json();

        if (res.ok && infoDiv) {
            infoDiv.innerHTML = `
                <div style="margin-top:20px;">
                    <p><strong>NOMBRE:</strong> ${datos.nombre}</p>
                    <p><strong>EMAIL:</strong> ${datos.email}</p>
                    <p><strong>ROL:</strong> <span style="color:var(--secondary); text-transform:uppercase;">${datos.rol}</span></p>
                    <p style="margin-top:20px; color:var(--text-dim);">Estatus: <span style="color:#4ade80;">● Online</span></p>
                </div>
            `;
            // Llamamos a la función de la API externa (Cripto/Premios)
            if (typeof cargarMercadoGamer === 'function') cargarMercadoGamer();
            
        } else {
            // Si el token no es válido o expiró
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        if (infoDiv) infoDiv.innerHTML = "<p>Error al conectar con la academia.</p>";
    }

    // 3. LÓGICA DE JUEGOS (CRUD FRONTEND)
    const btnAgregar = document.getElementById('btn-agregar-juego');
    const inputJuego = document.getElementById('nuevo-juego');
    const listaJuegos = document.getElementById('lista-juegos');

    if (btnAgregar && listaJuegos) {
        btnAgregar.addEventListener('click', () => {
            const nombreJuego = inputJuego.value.trim();
            if (nombreJuego !== "") {
                const li = document.createElement('li');
                li.className = "juego-item"; // Usar clases es más limpio que inline styles
                li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:8px; border-radius:6px; border: 1px solid #333; border-left:4px solid #4ade80;";
                
                li.innerHTML = `
                    <div class="content-area" style="flex: 1; display: flex; align-items: center;">
                        <span class="juego-texto" style="color: white;">🎮 ${nombreJuego}</span>
                    </div>
                    <div class="actions-area">
                        <button class="btn-edit-item" style="background:none; border:none; color:#4a90e2; cursor:pointer; margin-right:10px;">Editar</button>
                        <button class="btn-delete" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">X</button>
                    </div>
                `;

                // Configurar eventos de Editar y Eliminar (tu lógica actual es correcta)
                configurarEventosItem(li);
                listaJuegos.appendChild(li);
                inputJuego.value = '';
            }
        });
    }
});

// 4. CERRAR SESIÓN
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        // Redirigir al login para evitar bucles si index.html está protegido
        window.location.href = 'login.html'; 
    });
}