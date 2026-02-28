import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    // Mantenemos la lógica de captura de datos pero mediante estados de React
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mensajeTexto, setMensajeTexto] = useState('');
    const [mensajeColor, setMensajeColor] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Tu URL y lógica de fetch original sin cambios
            const respuesta = await fetch('https://avance-proyecto-brayan-najera.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem('token', datos.token);
                setMensajeColor("#4ade80");
                setMensajeTexto("¡Acceso concedido! Entrando...");
                
                setTimeout(() => {
                    // Navegación propia de React Router a tu perfil
                    navigate('/perfil');
                    window.location.reload(); 
                }, 1500);
            } else {
                setMensajeColor("#ff4d4d");
                setMensajeTexto("Credenciales incorrectas");
            }
        } catch (error) {
            setMensajeTexto("Error al conectar con el servidor");
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo">
                        <span className="logo-icon">🎮</span> eSports Mentor
                    </div>
                    {/* Link reemplaza al <a> para evitar recargar la página */}
                    <Link to="/" className="btn-login">Volver al Inicio</Link>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
                <section id="contacto" style={{ width: '100%', maxWidth: '500px' }}>
                    <form id="login-form" onSubmit={handleSubmit}>
                        <h2 style={{ marginBottom: '20px' }}>Iniciar Sesión</h2>
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="tu@correo.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-submit">ENTRAR AL SISTEMA</button>
                        
                        <p id="mensaje-api" style={{ 
                            textAlign: 'center', 
                            marginTop: '20px', 
                            fontWeight: 'bold', 
                            color: mensajeColor 
                        }}>
                            {mensajeTexto}
                        </p>

                        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
                            ¿No tienes cuenta? <Link to="/" style={{ color: 'var(--primary)' }}>Regístrate aquí</Link>
                        </p>
                    </form>
                </section>
            </div>
        </>
    );
};

export default Login;