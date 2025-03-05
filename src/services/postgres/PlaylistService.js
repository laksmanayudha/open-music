const BaseService = require('../BaseService');

class PlaylistService extends BaseService {
  constructor() {
    super('playlists');
  }
}

module.exports = PlaylistService;
