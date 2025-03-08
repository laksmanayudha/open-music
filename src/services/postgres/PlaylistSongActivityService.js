const InvariantError = require('../../exceptions/InvariantError');
const BaseService = require('../BaseService');

class PlaylistSongActivityService extends BaseService {
  constructor() {
    super('playlist_song_activities');
  }

  async store({
    playlistId,
    songId,
    userId,
    action,
  }) {
    const rows = await this._insert({
      playlistId,
      songId,
      userId,
      action,
      time: new Date().toISOString(),
    });

    if (!rows.length) {
      throw new InvariantError('Gagal menambahkan activity');
    }

    return rows[0][this._primaryKey];
  }

  async getByPlaylistId(playlistId) {
    const query = {
      text: `SELECT
        playlist_song_activities.action,
        playlist_song_activities.time,
        songs.title,
        users.username
      FROM playlist_song_activities
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id
      INNER JOIN users ON playlist_song_activities.user_id = users.id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const { rows } = result;

    return rows;
  }
}

module.exports = PlaylistSongActivityService;
