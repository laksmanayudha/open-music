const config = require('../../utils/config');
const BaseHandler = require('../BaseHandler');

class PlaylistHandler extends BaseHandler {
  constructor({
    service,
    playlistSongService,
    playlistSongActivityService,
    songService,
    cacheService,
    validator,
  }) {
    super({ service, validator });
    this._playlistSongService = playlistSongService;
    this._playlistSongActivityService = playlistSongActivityService;
    this._songService = songService;
    this._cacheService = cacheService;
  }

  async store(request, h) {
    this._validator.validatePostPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.store({ name, owner: credentialId });
    await this._cacheService.forget(config.redis.caches.userPlaylists(credentialId));

    return h.response(BaseHandler.successResponse({ playlistId })).code(201);
  }

  async getAll(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const result = await this._cacheService.remember(
      config.redis.caches.userPlaylists(credentialId),
      async () => {
        const data = await this._service.getByOwnerOrCollaborator(credentialId);
        return data;
      },
    );

    const { fromCache, data: playlists } = result;
    const response = h.response(BaseHandler.successResponse({ playlists }));

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async delete(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.delete(playlistId);
    await this._cacheService.forget(config.redis.caches.userPlaylists(credentialId));

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

    // insert to activity
    await this._playlistSongActivityService.store({
      playlistId,
      songId,
      userId: credentialId,
      action: 'add',
    });

    await this._cacheService.forget(config.redis.caches.playlistSongs(playlistId));

    return h.response(BaseHandler.successResponse(null, 'Berhasil menambahkan lagu ke playlist')).code(201);
  }

  async getSongsInPlaylist(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    const result = await this._cacheService.remember(
      config.redis.caches.playlistSongs(playlistId),
      async () => {
        const data = await this._playlistSongService.getSongsByPlaylistId(playlistId);
        return data;
      },
    );

    const { fromCache, data: playlist } = result;
    const response = h.response(BaseHandler.successResponse({ playlist }));

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteSongInPlaylist(request, h) {
    this._validator.validateDeleteSongPayload(request.payload);
    const { songId } = request.payload;

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistSongService.verifyPlaylistSongAccess(playlistId, credentialId);
    await this._playlistSongService.deleteByPlaylistIdAndSongId(playlistId, songId);

    // insert to activity
    await this._playlistSongActivityService.store({
      playlistId,
      songId,
      userId: credentialId,
      action: 'delete',
    });

    await this._cacheService.forget(config.redis.caches.playlistSongs(playlistId));

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus lagi di dalam playlist'));
  }
}

module.exports = PlaylistHandler;
