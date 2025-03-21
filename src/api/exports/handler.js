const config = require('../../utils/config');
const BaseHandler = require('../BaseHandler');

class ExportHandler extends BaseHandler {
  constructor({ validator, service, playlistService }) {
    super({ service, validator });
    this._playlistService = playlistService;
  }

  async exportPlaylist(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { id: playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const message = { playlistId, targetEmail };

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.sendMessage(config.rabbitMq.queues.exportPlaylist, JSON.stringify(message));

    return h.response(BaseHandler.successResponse(null, 'Permintaan Anda sedang kami proses')).code(201);
  }
}

module.exports = ExportHandler;
