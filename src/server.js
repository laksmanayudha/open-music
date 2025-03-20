const process = require('process');
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');
const ServerError = require('./exceptions/ServerError');
const AuthenticationError = require('./exceptions/AuthenticationError');
const BaseHandler = require('./api/BaseHandler');

// albums
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const StorageService = require('./services/s3/StorageService');
const UserAlbumLikeService = require('./services/postgres/UserAlbumLikeService');
const AlbumValidaor = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationService = require('./services/postgres/AuthenticationService');
const AuthenticationValidator = require('./validator/authentications');
const tokenizer = require('./utils/tokenizer');

// playlists
const playlists = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistSongService = require('./services/postgres/PlaylistSongService');
const PlaylistSongActivityService = require('./services/postgres/PlaylistSongActivityService');
const PlaylistValidator = require('./validator/playlists');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');

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

  // register external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // define auth strategy using jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // register app plugin
  const authenticationService = new AuthenticationService();
  const albumService = new AlbumService();
  const storageService = new StorageService();
  const userAlbumLikeService = new UserAlbumLikeService();
  const userService = new UserService();
  const playlistService = new PlaylistService();
  const playlistSongActivityService = new PlaylistSongActivityService();
  const songService = new SongService();
  const collaborationService = new CollaborationService();
  const playlistSongService = new PlaylistSongService({
    playlistService,
    songService,
    userService,
    collaborationService,
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        songService,
        storageService,
        userAlbumLikeService,
        validator: AlbumValidaor,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        service: authenticationService,
        userService,
        validator: AuthenticationValidator,
        tokenizer,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistService,
        playlistSongService,
        playlistSongActivityService,
        songService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationService,
        playlistService,
        userService,
        validator: CollaborationValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService,
        validator: ExportValidator,
      },
    },
  ]);

  // error handling
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      console.log(response.message);
      if (response.output.statusCode === (new AuthenticationError().statusCode)) {
        return h.response(BaseHandler.failResponse(null, response.message))
          .code(response.output.statusCode);
      }

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
