document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7';

    // Redirigir si no hay token
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. CARGAR DATOS DEL USUARIO (Corregido para tu backend)
    try {
        const response = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            infoDiv.innerHTML = `
                <p><strong>NOMBRE:</strong> ${data.nombre}</p>
                <p><strong>EMAIL:</strong> ${data.email}</p>
                <p><strong>ROL:</strong> <span style="color:#4ade80; font-weight:bold;">${data.rol.toUpperCase()}</span></p>
            `;
        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        infoDiv.innerHTML = "<p style='color:red;'>Error al conectar con el servidor.</p>";
    }

    // 2. AÑADIR JUEGO (Con RAWG)
    const btnAdd = document.getElementById('btn-agregar-juego');
    const inputJuego = document.getElementById('nuevo-juego');
    const listaJuegos = document.getElementById('lista-juegos');

    if (btnAdd) {
        btnAdd.addEventListener('click', async () => {
            const nombre = inputJuego.value.trim();
            if (!nombre) return;

            let img = 'https://via.placeholder.com/50';
            try {
                const res = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${nombre}`);
                const d = await res.json();
                if (d.results && d.results.length > 0) img = d.results[0].background_image;
            } catch (e) { console.error(e); }

            const li = document.createElement('li');
            li.style = "background:#1a1a1a; padding:15px; margin-bottom:10px; border-radius:12px; border:1px solid #333; display:flex; align-items:center; justify-content:space-between; border-left: 4px solid #00d2ff;";
            li.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${img}" style="width:45px; height:45px; border-radius:5px; object-fit:cover;">
                    <span style="font-weight:bold;">${nombre}</span>
                </div>
                <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.5rem;">&times;</button>
            `;
            listaJuegos.appendChild(li);
            inputJuego.value = '';
        });
    }

    // 3. CERRAR SESIÓN
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // 4. API ANIME (Opcional, cargada al final)
    async function cargarAnime() {
        try {
            const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=3');
            const data = await res.json();
            let html = '<p style="color:#00d2ff; font-size:0.8rem; font-weight:bold;">RECOMENDACIONES ANIME</p><div style="display:flex; gap:10px;">';
            data.data.forEach(a => {
                html += `<div style="flex:1; text-align:center;"><img src="${a.images.jpg.image_url}" style="width:100%; height:70px; object-fit:cover; border-radius:5px;"><p style="font-size:9px; margin-top:5px;">${a.title}</p></div>`;
            });
            document.getElementById('seccion-anime').innerHTML = html + '</div>';
        } catch (e) { console.log("Anime no cargado"); }
    }
    cargarAnime();
});