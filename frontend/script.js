document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const infoDiv = document.getElementById('perfil-info');

    // 1. VERIFICACIÓN DE SESIÓN (Protección de ruta)
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // 2. OBTENER DATOS DEL ATLETA DESDE EL BACKEND
    try {
        const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const datos = await res.json();

        if (res.ok) {
            infoDiv.innerHTML = `
                <div style="margin-top:20px;">
                    <p><strong>NOMBRE:</strong> ${datos.nombre}</p>
                    <p><strong>EMAIL:</strong> ${datos.email}</p>
                    <p><strong>ROL:</strong> <span style="color:var(--secondary); text-transform:uppercase;">${datos.rol}</span></p>
                    <p style="margin-top:20px; color:var(--text-dim);">Estatus: <span style="color:#4ade80;">● Online</span></p>
                </div>
            `;
            
            // --- LLAMADA A LA API EXTERNA ---
            // Se ejecuta solo si el perfil cargó correctamente
            cargarMercadoGamer(); 

        } else {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        infoDiv.innerHTML = "<p>Error al conectar con la academia.</p>";
    }

    // 3. LÓGICA DINÁMICA (AGREGAR / EDITAR INLINE / ELIMINAR) 
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
                    <div class="content-area" style="flex: 1; display: flex; align-items: center;">
                        <span class="juego-texto" style="color: white;">🎮 ${nombreJuego}</span>
                    </div>
                    <div class="actions-area">
                        <button class="btn-edit-item" style="background:none; border:none; color:#4a90e2; cursor:pointer; margin-right:10px;">Editar</button>
                        <button class="btn-delete" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-weight:bold;">X</button>
                    </div>
                `;

                const btnEditItem = li.querySelector('.btn-edit-item');
                const contentArea = li.querySelector('.content-area');

                btnEditItem.addEventListener('click', function handleEdit() {
                    const spanActual = contentArea.querySelector('.juego-texto');
                    if (this.innerText === "Editar") {
                        const textoActual = spanActual.innerText.replace('🎮 ', '');
                        contentArea.innerHTML = `
                            <input type="text" class="edit-input" value="${textoActual}" 
                                   style="background:#000; border:1px solid #4ade80; color:white; padding:5px; border-radius:4px; width:85%; outline:none;">
                        `;
                        this.innerText = "OK";
                        this.style.color = "#4ade80";
                        contentArea.querySelector('.edit-input').focus();
                    } else {
                        const nuevoNombre = contentArea.querySelector('.edit-input').value.trim();
                        if (nuevoNombre) {
                            contentArea.innerHTML = `<span class="juego-texto" style="color: white;">🎮 ${nuevoNombre}</span>`;
                            this.innerText = "Editar";
                            this.style.color = "#4a90e2";
                        }
                    }
                });

                li.querySelector('.btn-delete').addEventListener('click', () => li.remove());
                listaJuegos.appendChild(li);
                inputJuego.value = '';
                inputJuego.focus();
            }
        });
    }
});

// 4. CERRAR SESIÓN
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// --- FUNCIONALIDAD: CONSUMO DE API EXTERNA (REQUERIMIENTO PROYECTO) ---
async function cargarMercadoGamer() {
    const infoDiv = document.getElementById('perfil-info');
    const mercadoDiv = document.createElement('div');
    mercadoDiv.style = "margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.4); border-radius: 8px; border: 1px solid #333;";
    
    try {
        // Fetch a la API de CoinGecko para precios en tiempo real
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const precios = await res.json();

        mercadoDiv.innerHTML = `
            <h4 style="color: var(--secondary); margin-bottom: 10px; font-size: 0.8rem; letter-spacing: 1px;">📊 VALOR DE PREMIOS (USD)</h4>
            <div style="display: flex; gap: 25px;">
                <p style="margin:0; font-size: 0.9rem;">BTC: <span style="color: #4ade80; font-family: monospace;">$${precios.bitcoin.usd.toLocaleString()}</span></p>
                <p style="margin:0; font-size: 0.9rem;">ETH: <span style="color: #4ade80; font-family: monospace;">$${precios.ethereum.usd.toLocaleString()}</span></p>
            </div>
        `;
    } catch (error) {
        console.error("Error al consumir la API externa:", error);
        mercadoDiv.innerHTML = "<p style='color: gray; font-size: 0.8rem;'>Mercado temporalmente no disponible.</p>";
    }

    if (infoDiv) infoDiv.appendChild(mercadoDiv);
}