const BaseHandler = require('../BaseHandler');

class AlbumHandler extends BaseHandler {
  constructor({
    service, songService, storageService, validator,
  }) {
    super({ service, validator });
    this._songService = songService;
    this._storageService = storageService;
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
}

module.exports = AlbumHandler;
