export const environment = {
  production: false,
  // Ajusta estos valores a las URLs/puertos reales de tus microservicios
  apiAuthUrl: 'http://localhost:3000',           // auth-service
  apiBrigadasUrl: 'http://localhost:3001',       // brigadas-service
  apiConglomeradosUrl: 'http://localhost:3002',  // conglomerados-service
  apiBaseUrl: 'http://localhost:3000'            // opcional: gateway o base común
};
