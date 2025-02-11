require('dotenv').config();
const process = require('process');
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const ServerError = require('./exceptions/ServerError');

// albums
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidaor = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/songs');

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

  // register app plugin
  await server.register([
    {
      plugin: albums,
      options: {
        service: new AlbumService(),
        validaor: AlbumValidaor,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validaor: SongValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }

      const serverError = new ServerError();
      return h.response({
        status: 'error',
        message: serverError.message,
      }).code(serverError.statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
