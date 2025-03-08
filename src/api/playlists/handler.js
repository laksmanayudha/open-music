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

  async store(request, h) {
    this._validator.validatePostPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.store({ name, owner: credentialId });

    return h.response(BaseHandler.successResponse({ playlistId })).code(201);
  }

  async getAll(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getByOwner(credentialId);

    return h.response(BaseHandler.successResponse({ playlists }));
  }

  async delete(request, h) {
    const { id: credentialId } = request.auth.credentials;
    await this._service.deleteByOwner(credentialId);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus playlist'));
  }

  async addSongToPlaylist(request, h) {
    this._validator.validatePostSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    await this._playlistSongService.storeIfNotExists({ playlistId, songId });

    // TODO: insert ke activity

    return h.response(BaseHandler.successResponse(null, 'Berhasil menambahkan lagu ke playlist')).code(201);
  }

  async getSongsInPlaylist(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    const playlist = await this._playlistSongService.getByPlaylistId(playlistId);
    console.log(playlist);

    return h.response(BaseHandler.successResponse({ playlist }));
  }
}

module.exports = PlaylistHandler;
