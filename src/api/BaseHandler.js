class BaseHandler {
  constructor({ service, validator }) {
    this._service = service;
    this._validator = validator;
  }

  static successResponse(data, message) {
    return this.generateResponse('success', message, data);
  }

  static failResponse(data, message) {
    return this.generateResponse('fail', message, data);
  }

  static errorResponse(data, message) {
    return this.generateResponse('error', message, data);
  }

  static generateResponse(status, message, data) {
    let response = { status };

    if (message) {
      response = { ...response, message };
    }

    if (data) {
      response = { ...response, data };
    }

    return response;
  }
}

module.exports = BaseHandler;
