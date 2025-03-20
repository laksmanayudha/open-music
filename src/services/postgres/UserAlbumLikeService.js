const InvariantError = require('../../exceptions/InvariantError');
const BaseService = require('../BaseService');

class UserAlbumLikeService extends BaseService {
  constructor() {
    super('user_album_likes');
  }

  async store({ userId, albumId }) {
    const likes = await this._getBy({ userId, albumId });
    if (likes.length) {
      throw new InvariantError('Album telah disukai');
    }

    const rows = await this._insert({ userId, albumId });

    if (!rows.length) {
      throw new InvariantError('Gagal menyukai album');
    }

    return rows[0][this._primaryKey];
  }

  async delete({ userId, albumId }) {
    const likes = await this._getBy({ userId, albumId });
    if (!likes.length) {
      throw new InvariantError('User belum menyukai album');
    }

    await this._deleteBy({ userId, albumId });
  }

  async getLikeCount(albumId) {
    const query = {
      text: `SELECT COUNT(*) AS like_count FROM ${this._table} WHERE album_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return parseInt(result.rows[0].like_count, 10);
  }
}

module.exports = UserAlbumLikeService;
