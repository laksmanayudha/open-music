const BaseService = require('../BaseService');
const InVariantError = require('../../exceptions/InvariantError');

class AlbumService extends BaseService {
  constructor() {
    super('albums');
  }

  async store({ name, year }) {
    const rows = await this._insert({ name, year });
    if (!rows.length) {
      throw new InVariantError('Album gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }
}

module.exports = AlbumService;
