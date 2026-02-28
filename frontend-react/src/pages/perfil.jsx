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

    // 1. Cargar información del perfil al montar el componente
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
        window.location.reload();
    };

    // 2. Lógica para AÑADIR JUEGOS con API RAWG
    const agregarJuego = async () => {
        if (nuevoJuego.trim() === "") return;

        let imagenUrl = 'https://via.placeholder.com/50';

        try {
            const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nuevoJuego)}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                imagenUrl = data.results[0].background_image;
            }
        } catch (err) {
            console.error("Fallo en la conexión con RAWG:", err);
        }

        const juegoNuevo = {
            id: Date.now(),
            nombre: nuevoJuego,
            imagen: imagenUrl
        };

        setJuegos([...juegos, juegoNuevo]);
        setNuevoJuego('');
    };

    const eliminarJuego = (id) => {
        setJuegos(juegos.filter(juego => juego.id !== id));
    };

    // 3. Lógica para FILTRAR JUEGOS
    const juegosFiltrados = juegos.filter(juego => 
        juego.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white' }}>
            <nav className="navbar">
                <div className="container nav-content">
                    <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                        <span className="logo-icon">🎮</span> eSports Mentor
                    </Link>
                    
                    <div className="nav-actions">
                        <Link to="/" className="btn-link" style={{ marginRight: '20px', color: 'white', textDecoration: 'none' }}>Inicio</Link>
                        <button onClick={handleLogout} className="btn-login" style={{ cursor: 'pointer', background: 'transparent', border: '1px solid var(--primary)' }}>Cerrar Sesión</button>
                    </div>
                </div>
            </nav>

            <main className="container" style={{ marginTop: '50px' }}>
                <div className="card" style={{ max_width: '600px', margin: '0 auto', borderColor: 'var(--primary)', padding: '20px', background: '#121212', borderRadius: '8px', border: '1px solid #444' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Panel de Control</h2>
                    
                    <div id="perfil-info">
                        {!datos ? (
                            <p className="tagline">Cargando datos del atleta...</p>
                        ) : (
                            <div style={{ marginTop: '10px' }}>
                                <p><strong>NOMBRE:</strong> {datos.nombre}</p>
                                <p><strong>EMAIL:</strong> {datos.email}</p>
                                <p><strong>ROL:</strong> <span style={{ color: '#4ade80', textTransform: 'uppercase' }}>{datos.rol}</span></p>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '30px', borderTop: '1px solid #444', paddingTop: '20px' }}>
                        <h4 style={{ color: '#4ade80', marginBottom: '15px' }}>🎮 Mis Juegos de Especialización</h4>
                        
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input 
                                type="text" 
                                placeholder="Ej: Valorant, LoL, CS2..."
                                value={nuevoJuego}
                                onChange={(e) => setNuevoJuego(e.target.value)}
                                style={{ flex: 1, padding: '10px', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px', outline: none }}
                            />
                            <button onClick={agregarJuego} className="btn-explore" style={{ padding: '10px 20px', cursor: 'pointer' }}>Añadir</button>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <input 
                                type="text" 
                                placeholder="🔍 Buscar en mis especialidades..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #444', color: '#4ade80', borderRadius: '6px', outline: none }}
                            />
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {juegosFiltrados.map(juego => (
                                <li key={juego.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#1a1a1a', marginBottom: '8px', borderRadius: '6px', border: '1px solid #333', borderLeft: '4px solid #4ade80' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={juego.imagen} alt={juego.nombre} style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #444' }} />
                                        <span style={{ color: 'white', fontWeight: 'bold' }}>{juego.nombre}</span>
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