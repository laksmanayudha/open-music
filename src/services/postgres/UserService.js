const bcrypt = require('bcrypt');
const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UserService extends BaseService {
  constructor() {
    super('users');
  }

  async store({ username, password, fullname }) {
    await this.verifyUniqueUsername(username);

    const user = {
      username,
      fullname,
      password: await bcrypt.hash(password, 10),
    };

    const rows = await this._insert(user);

    if (!rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async verifyUniqueUsername(username) {
    const rows = await this._getBy({ username });

    if (rows.length > 0) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyCredential(username, password) {
    // check username
    const rows = await this._getBy({ username });
    if (!rows.length) {
      throw new AuthenticationError('Kredensial tidak valid');
    }

    // check password
    const { id, password: hashedPassword } = rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial tidak valid');
    }

    return id;
  }
}

module.exports = UserService;
