const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService extends BaseService {
  constructor() {
    super('playlists');
  }

  async store({ name, owner }) {
    const rows = await this._insert({ name, owner });

    if (!rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async getByOwner(owner) {
    const rows = await this._getBy({ owner });
    return rows.map(({ id, name, owner }) => ({ id, name, username: owner }));
  }

  async deleteByOwner(owner) {
    const rows = await this._deleteBy({ owner });

    if (!rows.length) {
      throw new NotFoundError('Gagal menghapus playlist');
    }
  }
}

module.exports = PlaylistService;
