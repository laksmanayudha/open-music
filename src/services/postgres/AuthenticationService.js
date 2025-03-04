const InvariantError = require('../../exceptions/InvariantError');
const BaseService = require('../BaseService');

class AuthenticationService extends BaseService {
  constructor() {
    super('authentications');
    this._primaryKey = null;
  }

  async store({ token }) {
    await this._insert({ token });
  }

  async verifyRefreshToken(refreshToken) {
    const rows = await this._getBy({ token: refreshToken });

    if (!rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(refreshToken) {
    await this._deleteBy({ token: refreshToken });
  }
}

module.exports = AuthenticationService;
