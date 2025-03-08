const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistService extends BaseService {
  constructor() {
    super('playlists');
  }

  async find(id) {
    const rows = await this._find(id);

    if (!rows.length) {
      throw new InvariantError('Playlist tidak ditemukan');
    }

    return rows[0];
  }

  async storeIfNotExists({ name, owner }) {
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

  async verifyPlaylistOwner(id, owner) {
    const rows = await this._find(id);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakes resource ini');
    }
  }
}

module.exports = PlaylistService;
