require('dotenv').config();
const process = require('process');
const Hapi = require('@hapi/hapi');

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

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
})();
