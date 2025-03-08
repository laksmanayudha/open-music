const BaseHandler = require('../BaseHandler');

class AlbumHandler extends BaseHandler {
  constructor({ service, songService, validator }) {
    super({ service, validator });
    this._songService = songService;
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
    await this._service.deleteById(id);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus album'));
  }
}

module.exports = AlbumHandler;
