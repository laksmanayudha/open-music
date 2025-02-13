const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService extends BaseService {
  constructor() {
    super('albums');
  }

  async store({ name, year }) {
    const rows = await this._insert({ name, year });
    if (!rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async findById(id) {
    const rows = await this._find(id);
    if (!rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return rows[0];
  }

  async updateById(id, { name, year }) {
    const rows = await this._update(id, { name, year });
    if (!rows.length) {
      throw new NotFoundError('Album gagal diperbarui. Album tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }

  async deleteById(id) {
    const rows = await this._delete(id);
    if (!rows.length) {
      throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }
}

module.exports = AlbumService;
