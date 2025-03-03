const BaseService = require('../BaseService');

class AuthenticationService extends BaseService {
  constructor() {
    super('authentications');
    this._primaryKey = null;
  }

  async store({ token }) {
    await this._insert({ token });
  }
}

module.exports = AuthenticationService;
