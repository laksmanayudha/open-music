const BaseHandler = require('../BaseHandler');

class PlaylistHandler extends BaseHandler {
  constructor({
    service,
    playlistSongService,
    playlistSongActivityService,
    songService,
    validator,
  }) {
    super({ service, validator });
    this._playlistSongService = playlistSongService;
    this._playlistSongActivityService = playlistSongActivityService;
    this._songService = songService;
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
    const playlists = await this._service.getByOwnerOrCollaborator(credentialId);

    return h.response(BaseHandler.successResponse({ playlists }));
  }

  async delete(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.delete(playlistId);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus playlist'));
  }

  async getActivities(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    const activities = await this._playlistSongActivityService.getByPlaylistId(playlistId);

    return h.response(BaseHandler.successResponse({ playlistId, activities }));
  }

  async addSongToPlaylist(request, h) {
    this._validator.validatePostSongPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    await this._songService.find(songId);

    // store to playlist
    await this._playlistSongService.storeIfNotExists({ playlistId, songId });

    // insert ke activity
    await this._playlistSongActivityService.store({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
    });

    return h.response(BaseHandler.successResponse(null, 'Berhasil menambahkan lagu ke playlist')).code(201);
  }

  async getSongsInPlaylist(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    const playlist = await this._playlistSongService.getSongsByPlaylistId(playlistId);

    return h.response(BaseHandler.successResponse({ playlist }));
  }

  async deleteSongInPlaylist(request, h) {
    this._validator.validateDeleteSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    await this._playlistSongService.deleteByPlaylistIdAndSongId(playlistId, songId);

    // insert ke activity
    await this._playlistSongActivityService.store({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus lagi di dalam playlist'));
  }
}

module.exports = PlaylistHandler;
