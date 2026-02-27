document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7';

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Cargar datos (Restaurado)
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const datos = await res.json();
        if (res.ok) {
            infoDiv.innerHTML = `
                <p><strong>NOMBRE:</strong> ${datos.nombre}</p>
                <p><strong>EMAIL:</strong> ${datos.email}</p>
                <p><strong>ROL:</strong> <span style="color:#4ade80;">${datos.rol}</span></p>
            `;
        }
    } catch (error) { console.error(error); }

    // 2. Botón Añadir (Restaurado)
    document.getElementById('btn-agregar-juego').addEventListener('click', async () => {
        const nombreJuego = document.getElementById('nuevo-juego').value;
        if (nombreJuego) {
            let img = 'https://via.placeholder.com/50';
            const resRawg = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${nombreJuego}`);
            const data = await resRawg.json();
            if(data.results.length > 0) img = data.results[0].background_image;

            const li = document.createElement('li');
            li.innerHTML = `
                <div style="background:#1a1a1a; padding:15px; margin-bottom:10px; border-radius:10px; border:1px solid #333; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <img src="${img}" style="width:50px; height:50px; border-radius:5px; object-fit:cover;">
                        <span style="color:white; font-weight:bold;">${nombreJuego}</span>
                    </div>
                    <span style="color:#ff4d4d; cursor:pointer;" onclick="this.parentElement.remove()">×</span>
                </div>`;
            document.getElementById('lista-juegos').appendChild(li);
            document.getElementById('nuevo-juego').value = '';
        }
    });

    // 3. API de Anime (Solo este bloque es nuevo)
    async function cargarAnime() {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=3');
        const data = await res.json();
        let html = '<h4 style="color:#00d2ff; margin-bottom:10px;">Recomendaciones Anime</h4><div style="display:flex; gap:10px;">';
        data.data.forEach(a => {
            html += `<div style="flex:1; text-align:center;"><img src="${a.images.jpg.image_url}" style="width:100%; height:80px; object-fit:cover; border-radius:5px;"><p style="font-size:10px; color:white;">${a.title}</p></div>`;
        });
        document.getElementById('seccion-anime').innerHTML = html + '</div>';
    }
    cargarAnime();

    // 4. Cerrar Sesión (Restaurado)
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});