const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service,
    songService,
    storageService,
    validator,
    cacheService,
    userAlbumLikeService,
  }) => {
    server.route(routes(new AlbumHandler({
      service,
      songService,
      storageService,
      validator,
      userAlbumLikeService,
      cacheService,
    })));
  },
};
