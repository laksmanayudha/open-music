const config = require('../../utils/config');
const BaseHandler = require('../BaseHandler');

class AlbumHandler extends BaseHandler {
  constructor({
    service,
    songService,
    storageService,
    validator,
    userAlbumLikeService,
    cacheService,
  }) {
    super({ service, validator });
    this._songService = songService;
    this._storageService = storageService;
    this._userAlbumLikeService = userAlbumLikeService;
    this._cacheService = cacheService;
  }

  async store(request, h) {
    this._validator.validatePayload(request.payload);

    const albumId = await this._service.store(request.payload);
    return h.response(BaseHandler.successResponse({ albumId })).code(201);
  }

  async detail(request, h) {
    const { id } = request.params;
    const album = await this._service.find(id);
    const songs = await this._songService.getByAlbumId(id);

    return h.response(BaseHandler.successResponse({
      album: {
        ...album,
        songs,
      },
    }));
  }

  async update(request, h) {
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    await this._service.update(id, request.payload);

    return h.response(BaseHandler.successResponse(null, 'Berhasil memperbarui album'));
  }

  async delete(request, h) {
    const { id } = request.params;
    await this._service.delete(id);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus album'));
  }

  async uploadCover(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const coverUrl = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.updateCoverUrlById(albumId, coverUrl);

    return h.response(BaseHandler.successResponse({ cover_url: coverUrl }, 'Sampul berhasil diunggah')).code(201);
  }

  async likeAlbum(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.find(albumId);
    await this._userAlbumLikeService.store({ userId, albumId });
    await this._cacheService.forget(config.redis.caches.albumLikes(albumId));

    return h.response(BaseHandler.successResponse(null, 'Menyukai album berhasil')).code(201);
  }

  async unlikeAlbum(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.find(albumId);
    await this._userAlbumLikeService.delete({ userId, albumId });
    await this._cacheService.forget(config.redis.caches.albumLikes(albumId));

    return h.response(BaseHandler.successResponse(null, 'Menyukai album dibatalkan'));
  }

  async getAlbumLikes(request, h) {
    const { id: albumId } = request.params;

    const result = await this._cacheService.remember(
      config.redis.caches.albumLikes(albumId),
      async () => {
        const likeCount = await this._userAlbumLikeService.getLikeCount(albumId);
        return likeCount;
      },
    );

    const { fromCache, data: likes } = result;
    const response = h.response(BaseHandler.successResponse({ likes }));

    if (fromCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumHandler;
