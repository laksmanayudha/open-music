const BaseService = require('../BaseService');

class PlaylistSongService extends BaseService {
  constructor() {
    super('playlist_songs');
  }
}

module.exports = PlaylistSongService;
