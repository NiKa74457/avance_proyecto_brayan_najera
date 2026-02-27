document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7'; // Tu API Key de RAWG

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // --- 1. CARGAR DATOS DEL PERFIL ---
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
        console.error("Error al cargar perfil:", error);
    }

    // --- 2. AÑADIR JUEGOS CON API RAWG ---
    const btnAgregar = document.getElementById('btn-agregar-juego');
    const inputJuego = document.getElementById('nuevo-juego');
    const listaJuegos = document.getElementById('lista-juegos');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', async () => {
            const nombreJuego = inputJuego.value.trim();
            if (nombreJuego !== "") {
                let imagenUrl = 'https://via.placeholder.com/50';

                try {
                    const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nombreJuego)}`);
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        imagenUrl = data.results[0].background_image;
                    }
                } catch (err) {
                    console.error("Error en RAWG:", err);
                }

                const li = document.createElement('li');
                li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:8px; border-radius:6px; border: 1px solid #333; border-left:4px solid #4ade80;";
                li.innerHTML = `
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${imagenUrl}" style="width:50px; height:50px; border-radius:4px; object-fit:cover; border:1px solid #444;">
                        <span style="color: white; font-weight: bold;">${nombreJuego}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.2rem;">&times;</button>
                `;
                listaJuegos.appendChild(li);
                inputJuego.value = ''; 
            }
        });
    }

    // --- 3. FILTRO DE BÚSQUEDA ---
    const inputFiltro = document.getElementById('filtro-juego');
    if (inputFiltro) {
        inputFiltro.addEventListener('input', () => {
            const texto = inputFiltro.value.toLowerCase();
            const items = listaJuegos.getElementsByTagName('li');
            Array.from(items).forEach(item => {
                const nombreItem = item.querySelector('span').innerText.toLowerCase();
                item.style.display = nombreItem.includes(texto) ? "flex" : "none";
            });
        });
    }

    // --- 4. SECCIÓN DE ANIME (API Jikan) ---
    async function cargarAnimes() {
        const seccionAnime = document.getElementById('seccion-anime');
        if (!seccionAnime) return;

        try {
            // Buscamos animes populares
            const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=3');
            const data = await response.json();
            
            let html = '<h3 style="color:#00d2ff; margin: 20px 0 10px 0; font-size: 1rem; text-transform: uppercase;">Tendencias Anime</h3>';
            html += '<div style="display:flex; gap:10px;">';
            
            data.data.forEach(anime => {
                html += `
                    <div style="flex:1; background:#1a1a1a; padding:8px; border-radius:8px; border:1px solid #333; text-align:center;">
                        <img src="${anime.images.jpg.image_url}" style="width:100%; height:110px; object-fit:cover; border-radius:4px; margin-bottom:5px;">
                        <p style="font-size:0.65rem; color:#ccc; margin:0; height:30px; overflow:hidden;">${anime.title}</p>
                    </div>`;
            });
            
            html += '</div>';
            seccionAnime.innerHTML = html;
        } catch (err) {
            console.error("Error al conectar con Jikan API:", err);
            seccionAnime.innerHTML = "<p style='color:red; font-size:0.8rem;'>No se pudieron cargar las recomendaciones.</p>";
        }
    }
    
    // Ejecutamos la carga de animes
    await cargarAnimes();
});

// --- 5. LOGOUT ---
const btnLogout = document.getElementById('logout-btn');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
}