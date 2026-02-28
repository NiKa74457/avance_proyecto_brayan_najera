import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Inicio = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('estudiante');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // VALIDACIÓN (Tu lógica original de script.js)
        if (nombre.length < 3) {
            alert("⚠️ El nombre debe tener al menos 3 caracteres.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("⚠️ Por favor, ingresa un correo electrónico válido.");
            return;
        }

        if (password.length < 6) {
            alert("⚠️ La contraseña debe tener al menos 6 caracteres por seguridad.");
            return;
        }

        // PETICIÓN AL SERVIDOR
        try {
            const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, rol })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                alert("¡Registro exitoso! Ya eres parte de la academia");
                navigate('/login'); 
            } else {
                alert("Error: " + (datos.mensaje || "No se pudo completar el registro"));
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("No se pudo conectar con la academia. Intenta más tarde.");
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo">
                        <span className="logo-icon">🎮</span> eSports Mentor
                    </div>
                    <ul className="nav-links">
                        <li><a href="#proyectos">Servicios</a></li>
                        <li><a href="#contacto">Inscripción</a></li>
                        <li><a href="#">Mentores</a></li>
                    </ul>
                    <div className="nav-actions">
                        {isLoggedIn ? (
                            <>
                                <Link to="/perfil" className="btn-explore" style={{ marginRight: '10px' }}>Mi Perfil</Link>
                                <button onClick={cerrarSesion} className="btn-login" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-login">Login</Link>
                                <a href="#contacto" className="btn-explore">Explorar Mentores</a>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <header>
                <div className="container">
                    <h1>eSports Mentor Academy</h1>
                    <p className="tagline">Transformando jugadores en atletas digitales profesionales.</p>
                    <div className="header-info">
                        <div className="card">
                            <h3>Nuestra Misión</h3>
                            <p>Potenciar el talento de los jugadores mediante análisis de datos, táctica avanzada y enfoque profesional.</p>
                        </div>
                        <div className="card">
                            <h3>Nuestra Visión</h3>
                            <p>Ser la academia líder en formación de eSports, reconocida por profesionalizar el ecosistema competitivo.</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container">
                <section id="proyectos">
                    <h2>Actividades Destacadas</h2>
                    <div className="grid-proyectos">
                        <article className="proyecto-card">
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500" alt="Sesión de coaching" />
                            <h3>Análisis de Replays Pro</h3>
                            <p>Sesiones 1 a 1 donde revisamos tus partidas para identificar errores tácticos específicos.</p>
                            <a href="#" className="btn-link">Saber más</a>
                        </article>

                        <article className="proyecto-card">
                            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500" alt="Liga eSports" />
                            <h3>Liga Universitaria Mentorship</h3>
                            <p>Organización de torneos competitivos con seguimiento cercano de scouts profesionales.</p>
                            <a href="#" className="btn-link">Saber más</a>
                        </article>

                        <article className="proyecto-card">
                            <img src="https://images.unsplash.com/photo-1600880210819-3506c64c23ba?q=80&w=500" alt="Psicología" />
                            <h3>Programa de Psicología Deportiva</h3>
                            <p>Talleres enfocados en el manejo del estrés y mejora de la concentración bajo presión.</p>
                            <a href="#" className="btn-link">Saber más</a>
                        </article>
                    </div>
                </section>

                <section id="contacto">
                    <h2>Únete a la Academia</h2>
                    <form id="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre Completo</label>
                            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@ejemplo.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña segura" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rol">¿Cuál es tu rol?</label>
                            <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)} style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #444', color: 'white', borderRadius: '8px', outline: 'none' }}>
                                <option value="estudiante">Estudiante</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-submit">Enviar Solicitud</button>
                    </form>
                </section>
            </main>

            <footer className="main-footer">
                <div className="container footer-content">
                    <div className="footer-brand">
                        <div className="logo">🎮 eSports Mentor</div>
                        <p>Tu fuente confiable para encontrar mentores y profesionales de la industria altamente verificados para impulsar tu carrera.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Plataforma</h4>
                        <ul>
                            <li><a href="#">Explorar Mentores</a></li>
                            <li><a href="#">Reservar Sesión</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Empresa</h4>
                        <ul>
                            <li><a href="#">Sobre Nosotros</a></li>
                            <li><a href="#">Privacidad</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 eSports Mentor Academy. Todos los derechos reservados.</p>
                </div>
            </footer>
        </>
    );
};

export default Inicio;