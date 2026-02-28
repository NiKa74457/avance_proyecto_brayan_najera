import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Perfil = () => {
    const [datos, setDatos] = useState(null);
    const [juegos, setJuegos] = useState([]);
    const [nuevoJuego, setNuevoJuego] = useState('');
    const [filtro, setFiltro] = useState('');
    const navigate = useNavigate();
    
    const RAWG_API_KEY = '5baabed7dc0a48b5a514f8ce881211f7';
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const cargarPerfil = async () => {
            try {
                const res = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/perfil', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                if (res.ok) {
                    setDatos(data);
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error("Error al cargar perfil:", error);
            }
        };

        cargarPerfil();
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const agregarJuego = async () => {
        if (nuevoJuego.trim() === "") return;
        let imagenUrl = 'https://via.placeholder.com/50';
        let plataformas = 'No especificada'; // Variable nueva para las consolas

        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nuevoJuego)}`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const juegoInfo = data.results[0];
                imagenUrl = juegoInfo.background_image;
                
                // Extraemos los nombres de las plataformas (ej: PC, PlayStation 5)
                if (juegoInfo.platforms) {
                    plataformas = juegoInfo.platforms
                        .map(p => p.platform.name)
                        .slice(0, 3) // Limitamos a 3 para mantener el orden
                        .join(', ');
                }
            }
        } catch (err) {
            console.error("Fallo en la conexión con RAWG:", err);
        }

        const juegoNuevo = {
            id: Date.now(),
            nombre: nuevoJuego,
            imagen: imagenUrl,
            plataformas: plataformas // Agregado al objeto del juego
        };

        setJuegos([...juegos, juegoNuevo]);
        setNuevoJuego('');
    };

    const eliminarJuego = (id) => {
        setJuegos(juegos.filter(juego => juego.id !== id));
    };

    const juegosFiltrados = juegos.filter(juego => 
        juego.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <nav style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#4ade80', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    🎮 eSports Mentor
                </Link>
                <div>
                    <Link to="/" style={{ marginRight: '20px', color: 'white', textDecoration: 'none' }}>Inicio</Link>
                    <button onClick={handleLogout} style={{ cursor: 'pointer', background: 'transparent', border: '1px solid #4ade80', color: 'white', padding: '5px 10px' }}>Cerrar Sesión</button>
                </div>
            </nav>

            <main style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '600px', background: '#121212', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
                    <h2 style={{ color: '#4ade80', marginBottom: '20px' }}>Panel de Control</h2>
                    
                    <div id="perfil-info">
                        {!datos ? (
                            <p style={{ color: '#888' }}>Cargando datos del atleta...</p>
                        ) : (
                            <div style={{ lineHeight: '1.6' }}>
                                <p><strong>NOMBRE:</strong> {datos.nombre}</p>
                                <p><strong>EMAIL:</strong> {datos.email}</p>
                                <p><strong>ROL:</strong> <span style={{ color: '#4ade80' }}>{datos.rol}</span></p>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                        <h4 style={{ color: '#4ade80', marginBottom: '15px' }}>🎮 Mis Juegos de Especialización</h4>
                        
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input 
                                type="text" 
                                placeholder="Ej: Valorant, LoL..."
                                value={nuevoJuego}
                                onChange={(e) => setNuevoJuego(e.target.value)}
                                style={{ flex: 1, padding: '10px', background: '#1a1a1a', border: '1px solid #444', color: 'white', borderRadius: '6px', outline: 'none' }}
                            />
                            <button onClick={agregarJuego} style={{ padding: '10px 20px', background: '#4ade80', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Añadir</button>
                        </div>

                        <input 
                            type="text" 
                            placeholder="🔍 Buscar en mis especialidades..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #444', color: '#4ade80', borderRadius: '6px', outline: 'none', marginBottom: '15px', boxSizing: 'border-box' }}
                        />

                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {juegosFiltrados.map(juego => (
                                <li key={juego.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#1a1a1a', marginBottom: '8px', borderRadius: '6px', borderLeft: '4px solid #4ade80' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={juego.imagen} alt={juego.nombre} style={{ width: '45px', height: '45px', borderRadius: '4px', objectFit: 'cover' }} />
                                        <div>
                                            <span style={{ fontWeight: 'bold', display: 'block' }}>{juego.nombre}</span>
                                            <small style={{ color: '#888', fontSize: '0.75rem' }}>{juego.plataformas}</small>
                                        </div>
                                    </div>
                                    <button onClick={() => eliminarJuego(juego.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Perfil;