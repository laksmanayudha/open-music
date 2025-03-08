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

  async store({ name, owner }) {
    const rows = await this._insert({ name, owner });

    if (!rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async getByOwnerOrCollaborator(userId) {
    const query = {
      text: `SELECT DISTINCT playlists.*, users.username FROM playlists
      INNER JOIN collaborations ON playlists.id = collaborations.playlist_id
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [userId],
    };

    const { rows } = await this._pool.query(query);
    return rows.map(({ id, name, username }) => ({ id, name, username }));
  }

  async delete(id) {
    const rows = await this._delete(id);

    if (!rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. Playlist tidak ditemukan.');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const rows = await this._find(id);

    if (!rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistService;
