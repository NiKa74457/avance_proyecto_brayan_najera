document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7';

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Cargar Datos del Perfil desde Render
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const datos = await res.json();
        if (res.ok) {
            infoDiv.innerHTML = `
                <p><strong>NOMBRE:</strong> ${datos.nombre}</p>
                <p><strong>EMAIL:</strong> ${datos.email}</p>
                <p><strong>ROL:</strong> <span style="color:#4ade80;">${datos.rol}</span></p>`;
        }
    } catch (e) { console.error("Error al cargar perfil:", e); }

    // 2. Lógica del Botón Añadir con Imágenes de RAWG
    const btnAdd = document.getElementById('btn-agregar-juego');
    if (btnAdd) {
        btnAdd.addEventListener('click', async () => {
            const nombre = document.getElementById('nuevo-juego').value.trim();
            if (!nombre) return;

            let img = 'https://via.placeholder.com/50';
            try {
                const r = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${nombre}`);
                const d = await r.json();
                if (d.results && d.results.length > 0) {
                    img = d.results[0].background_image;
                }
            } catch (e) { console.error("Error RAWG:", e); }

            const li = document.createElement('li');
            li.innerHTML = `
                <div style="background:#1a1a1a; padding:12px; margin-bottom:10px; border-radius:10px; border:1px solid #333; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${img}" style="width:45px; height:45px; border-radius:5px; object-fit:cover;">
                        <span style="color:white; font-weight:bold;">${nombre}</span>
                    </div>
                    <span style="color:#ff4d4d; cursor:pointer; font-weight:bold;" onclick="this.parentElement.remove()">×</span>
                </div>`;
            document.getElementById('lista-juegos').appendChild(li);
            document.getElementById('nuevo-juego').value = '';
        });
    }

    // 3. Botón Cerrar Sesión
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
});