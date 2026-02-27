document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7'; // Tu API Key integrada

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Cargar información del perfil (Debugging incluido)
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const datos = await res.json();
        console.log("Datos del perfil recibidos:", datos); // Debugging

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
        infoDiv.innerHTML = "<p>Error al cargar perfil.</p>";
    }

    // 2. Lógica para AÑADIR JUEGOS con API EXTERNA (RAWG)
    const btnAgregar = document.getElementById('btn-agregar-juego');
    const inputJuego = document.getElementById('nuevo-juego');
    const listaJuegos = document.getElementById('lista-juegos');

    if (btnAgregar) {
        btnAgregar.addEventListener('click', async () => {
            const nombreJuego = inputJuego.value.trim();
            
            if (nombreJuego !== "") {
                let imagenUrl = 'https://via.placeholder.com/50'; // Imagen de respaldo

                try {
                    // Consulta asíncrona a la API externa
                    const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nombreJuego)}`);
                    const data = await response.json();
                    
                    if (data.results && data.results.length > 0) {
                        imagenUrl = data.results[0].background_image;
                    }
                } catch (err) {
                    console.error("Fallo en la conexión con RAWG:", err);
                }

                const li = document.createElement('li');
                li.style = "display:flex; justify-content:space-between; align-items:center; padding:10px; background:#1a1a1a; margin-bottom:8px; border-radius:6px; border: 1px solid #333; border-left:4px solid #4ade80;";
                
                li.innerHTML = `
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${imagenUrl}" alt="${nombreJuego}" style="width:50px; height:50px; border-radius:4px; object-fit:cover; border:1px solid #444;">
                        <span style="color: white; font-weight: bold;">${nombreJuego}</span>
                    </div>
                    <button onclick="this.parentElement.remove()" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.2rem;">&times;</button>
                `;
                
                listaJuegos.appendChild(li);
                inputJuego.value = ''; 
            }
        });
    }

    // 3. Lógica para FILTRAR JUEGOS (CRUD: Read con filtros)
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
});

// 4. Cerrar Sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});