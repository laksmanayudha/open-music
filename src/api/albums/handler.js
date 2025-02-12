const BaseHandler = require('../BaseHandler');

class AlbumHandler extends BaseHandler {
  async store(request, h) {
    this._validator.validatePayload(request.payload);

    const albumId = this._service.store(request.payload);
    return h.response(this.successResponse({ albumId })).code(201);
  }

  async detail(request, h) {
    const { id } = request.params;
    const album = this._service.findById(id);
    return h.response(this.successResponse({ album }));
  }

  async update(request, h) {
    this._validator.validatePayload(request.payload);

    const { id } = request.params;
    this._service.updateById(id, request.payload);

    return h.response(this.successResponse(null, 'Berhasil memperbarui album'));
  }

  async delete(request, h) {
    this._validator.validatePayload(request.payload);
    const { id } = request.params;
    this._service.deleteById(id);

    return h.response(this.successResponse(null, 'Berhasil menghapus album'));
  }
}

module.exports = AlbumHandler;
