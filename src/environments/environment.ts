export const environment = {
  production: false,
  // Ajusta estos valores a las URLs/puertos reales de tus microservicios
  apiAuthUrl: 'http://localhost:3001/api/auth',   // auth-service
  apiBrigadasUrl: 'http://localhost:4001',        // brigadas-service
  apiConglomeradosUrl: 'http://localhost:4002/api', // conglomerados-service (server.js escucha 4002 con prefijo /api)
  apiBaseUrl: 'http://localhost:3000'             // opcional: gateway o base común
};
