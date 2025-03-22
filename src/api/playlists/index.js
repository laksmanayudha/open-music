const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    service,
    playlistSongService,
    playlistSongActivityService,
    songService,
    cacheService,
    validator,
  }) => {
    const playlistHandler = new PlaylistHandler({
      service,
      playlistSongService,
      playlistSongActivityService,
      songService,
      cacheService,
      validator,
    });
    server.route(routes(playlistHandler));
  },
};
