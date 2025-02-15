const process = require('process');
require('dotenv').config();

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
const BaseHandler = require('./api/BaseHandler');

(async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
        songService: new SongService(),
        validator: AlbumValidaor,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongService(),
        validator: SongValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h.response(BaseHandler.failResponse(null, response.message))
          .code(response.statusCode);
      }

      // mempertahankan penanganan client error oleh hapi sercara native, misalnya 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      const serverError = new ServerError();
      return h.response(BaseHandler.errorResponse(null, serverError.message))
        .code(serverError.statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
