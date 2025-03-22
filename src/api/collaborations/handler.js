const BaseHandler = require('../BaseHandler');

class CollaborationtHandler extends BaseHandler {
  constructor({
    service,
    validator,
    playlistService,
    cacheService,
    userService,
  }) {
    super({ service, validator });
    this._playlistService = playlistService;
    this._userService = userService;
    this._cacheService = cacheService;
  }

  async store(request, h) {
    this._validator.validatePayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._userService.find(userId);

    const collaborationId = await this._service.storeIfNotExists({ playlistId, userId });

    return h.response(BaseHandler.successResponse({ collaborationId })).code(201);
  }

  async delete(request, h) {
    this._validator.validatePayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteByPlaylistIdAndUserId({ playlistId, userId });

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus kolaborasi'));
  }
}

module.exports = CollaborationtHandler;
