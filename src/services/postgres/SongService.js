const BaseService = require('../BaseService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { camelToSnakeCase } = require('../../utils');

class SongService extends BaseService {
  constructor() {
    super('songs');
  }

  async store({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const rows = await this._insert(camelToSnakeCase({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    }));

    if (!rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async getAll(params = {}) {
    let rows = [];

    if (params.title) {
      rows = await this._all();
    } else if (params.performer) {
      rows = await this._all();
    } else {
      rows = await this._all();
    }

    return rows.map(({ id, title, performer }) => ({ id, title, performer }));
  }

  async findById(id) {
    const rows = await this._find(id);
    if (!rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return rows[0];
  }

  async updateById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const rows = await this._update(id, camelToSnakeCase({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    }));

    if (!rows.length) {
      throw new NotFoundError('Lagu gagal diperbarui. Lagu tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }

  async deleteById(id) {
    const rows = await this._delete(id);
    if (!rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Lagu tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }
}

module.exports = SongService;
