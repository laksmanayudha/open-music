const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService extends BaseService {
  constructor() {
    super('albums');
  }

  async store({ name, year }) {
    const createdAt = new Date().toISOString();
    const album = {
      name,
      year,
      createdAt,
      updatedAt: createdAt,
    };

    const rows = await this._insert(album);
    if (!rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async find(id) {
    const rows = await this._find(id);
    if (!rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return rows.map(({ id, name, year }) => ({ id, name, year }))[0];
  }

  async update(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const album = {
      name,
      year,
      updatedAt,
    };

    const rows = await this._update(id, album);
    if (!rows.length) {
      throw new NotFoundError('Album gagal diperbarui. Album tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }

  async delete(id) {
    const rows = await this._delete(id);
    if (!rows.length) {
      throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }
}

module.exports = AlbumService;
