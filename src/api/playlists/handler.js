const BaseHandler = require('../BaseHandler');

class PlaylistHandler extends BaseHandler {
  constructor({
    service,
    playlistSongService,
    validator,
  }) {
    super({ service, validator });
    this._playlistSongService = playlistSongService;
  }
}

module.exports = PlaylistHandler;
