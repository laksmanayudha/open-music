const BaseHandler = require('../BaseHandler');

class AuthenticationHandler extends BaseHandler {
  constructor({
    service,
    userService,
    validator,
    tokenizer,
  }) {
    super({ service, validator });
    this._tokenizer = tokenizer;
    this._userService = userService;
  }

  async login(request, h) {
    this._validator.validatePostPayload(request.payload);
    const { username, password } = request.payload;

    const id = await this._userService.verifyCredential(username, password);
    const accessToken = this._tokenizer.generateAccessToken({ id });
    const refreshToken = this._tokenizer.generateRefreshToken({ id });

    await this._service.store({ token: refreshToken });

    return h.response(BaseHandler.successResponse({ accessToken, refreshToken })).code(201);
  }

  async refreshAccessToken(request, h) {
    this._validator.validatePutPayload(request.payload);
    const { refreshToken } = request.payload;

    await this._service.verifyRefreshToken(refreshToken);
    const { id } = this._tokenizer.verifyRefreshToken(refreshToken);
    const accessToken = this._tokenizer.generateAccessToken({ id });

    return h.response(BaseHandler.successResponse({ accessToken }));
  }

  async deleteRefreshToken(request, h) {
    this._validator.validateDeletePayload(request.payload);
    const { refreshToken } = request.payload;

    await this._service.verifyRefreshToken(refreshToken);
    await this._service.deleteRefreshToken(refreshToken);

    return h.response(BaseHandler.successResponse(null, 'Berhasil menghapus refresh token'));
  }
}

module.exports = AuthenticationHandler;
