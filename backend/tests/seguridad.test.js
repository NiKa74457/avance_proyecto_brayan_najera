const request = require('supertest');
const app = require('../server');

describe('Pruebas de Seguridad y Robustez', () => {
    
    // 1. Prueba de Seguridad: Sin token
    it('Debería denegar acceso sin un token (Seguridad)', async () => {
        const res = await request(app).get('/api/auth/perfil');
        expect(res.statusCode).toBe(401);
    });

    // 2. Prueba de Seguridad: Token malformado
    it('Debería rechazar un token mal escrito', async () => {
        const res = await request(app)
            .get('/api/auth/perfil')
            .set('Authorization', 'Bearer tokenInvalido');
        // Tu servidor responde 400 cuando el token no tiene el formato correcto
        expect(res.statusCode).toBe(400); 
    });

    // 3. Prueba de Robustez con Token (Simulado)
    it('Debería proteger la ruta de juegos incluso si el formato es incorrecto', async () => {
        const res = await request(app)
            .post('/api/users/juegos')
            .send({ nombre: "Ab" });
        // Sigue siendo 401 porque no enviamos un token válido de atleta
        expect(res.statusCode).toBe(401);
    });
});