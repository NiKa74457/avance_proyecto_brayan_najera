import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/inicio'; // <--- Nuevo import
import Login from './pages/login';
import Perfil from './pages/perfil';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Ruta principal ahora carga Inicio */}
        <Route path="/" element={<Inicio />} />
        
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/perfil" />} 
        />
        
        <Route 
          path="/perfil" 
          element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;