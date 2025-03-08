const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const BaseService = require('../BaseService');

class CollaborationService extends BaseService {
  constructor() {
    super('collaborations');
  }

  async storeIfNotExists({ playlistId, userId }) {
    await this.checkCollaborationAlreadyExist({ playlistId, userId });

    const rows = await this._insert({ playlistId, userId });

    if (!rows.length) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }

    return rows[0][this._primaryKey];
  }

  async checkCollaborationAlreadyExist({ playlistId, userId }) {
    const rows = await this._getBy({ playlistId, userId });

    if (rows.length) {
      throw new InvariantError('User sudah ada di dalam kolaborasi');
    }
  }

  async deleteByPlaylistIdAndUserId({ playlistId, userId }) {
    const rows = await this._deleteBy({ playlistId, userId });

    if (!rows.length) {
      throw NotFoundError('Gagal menghapus kolaborasi. Kolaborasi tidak ditemukan');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const rows = await this._getBy({ playlistId, userId });

    if (!rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini.');
    }
  }
}

module.exports = CollaborationService;
