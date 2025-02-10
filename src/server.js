require('dotenv').config();
const process = require('process');
const Hapi = require('@hapi/hapi');

(async () => {
  const server = Hapi.server({
    port: process.env.APP_PORT,
    host: process.env.APP_HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
