const BaseHandler = require('../BaseHandler');

class UserHandler extends BaseHandler {
  async store(request, h) {
    this._validator.validatePayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.store({ username, password, fullname });

    return h.response(BaseHandler.successResponse({ userId })).code(201);
  }
}

module.exports = UserHandler;
