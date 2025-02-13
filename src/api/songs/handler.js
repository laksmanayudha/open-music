const BaseHandler = require('../BaseHandler');

class SongHandler extends BaseHandler {
  async store(request, h) {
    this._validator.validatePayload(request.payload);

    const songId = this._service.store(request.payload);
    return h.response(this.successResponse({ songId })).code(201);
  }

  async all(request, h) {
    const songs = this._service.getAll();
    return h.response(this.successResponse({ songs }));
  }

  async detail(request, h) {
    const { id } = request.params;
    const song = this._service.findById(id);
    return h.response(this.successResponse({ song }));
  }

  async update(request, h) {
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    this._service.updateById(id, request.payload);

    return h.response(this.successResponse(null, 'Berhasil memperbarui lagu'));
  }

  async delete(request, h) {
    this._validator.validatePayload(request.payload);
    const { id } = request.params;
    this._service.deleteById(id);

    return h.response(this.successResponse(null, 'Berhasil menghapus lagu'));
  }
}

module.exports = SongHandler;
