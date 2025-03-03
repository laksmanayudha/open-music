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
    const refreshToken = this._tokenizer.generateAccessToken({ id });

    await this._service.store({ token: refreshToken });

    return h.response(BaseHandler.successResponse({ accessToken, refreshToken })).code(201);
  }
}

module.exports = AuthenticationHandler;
