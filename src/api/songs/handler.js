const BaseHandler = require('../BaseHandler');

class SongHandler extends BaseHandler {
  async store(request, h) {
    this._validator.validatePayload(request.payload);

    const songId = await this._service.store(request.payload);
    return h.response(BaseHandler.successResponse({ songId })).code(201);
  }

  async all(request, h) {
    const songs = await this._service.getAll(request.query);
    return h.response(BaseHandler.successResponse({ songs }));
  }

  async detail(request, h) {
    const { id } = request.params;
    const song = await this._service.find(id);
    return h.response(BaseHandler.successResponse({ song }));
  }

  async update(request, h) {
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    await this._service.update(id, request.payload);

    return h.response(BaseHandler.successResponse(null, 'Berhasil memperbarui lagu'));
  }

  async delete(request, h) {
    const { id } = request.params;
    await this._service.deleteById(id);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus lagu'));
  }
}

module.exports = SongHandler;
