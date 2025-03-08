const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const BaseService = require('../BaseService');

class PlaylistSongService extends BaseService {
  constructor(playlistService, songService, userService) {
    super('playlist_songs');
    this._playlistService = playlistService;
    this._songService = songService;
    this._userService = userService;
  }

  async storeIfNotExists({ playlistId, songId }) {
    await this.checkSongAlreadyInPlaylist({ playlistId, songId });

    const rows = await this._insert({ playlistId, songId });

    if (!rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return rows[0][this._primaryKey];
  }

  async verifyPlaylistSongAccess(playlistId, owner) {
    await this._playlistService.verifyPlaylistOwner(playlistId, owner);

    // TODO: verify collaborator
  }

  async checkSongAlreadyInPlaylist({ playlistId, songId }) {
    const rows = await this._getBy({ playlistId, songId });

    if (rows.length) {
      throw new InvariantError('Lagu sudah ada di dalam playlist');
    }
  }

  async getSongsByPlaylistId(playlistId) {
    // playlist
    const playlist = await this._playlistService.find(playlistId);

    // user
    const user = await this._userService.find(playlist.owner);

    // playlist songs
    const playlistSongs = await this._getBy({ playlistId });

    // songs
    const songIds = [...new Set(playlistSongs.map(({ songId }) => songId))];
    const songMasters = await this._songService.getByIdIn(songIds);
    const songs = playlistSongs.map((playlistSong) => {
      const { id, title, performer } = songMasters.find((song) => song.id === playlistSong.songId);
      return { id, title, performer };
    });

    return {
      id: playlist.id,
      name: playlist.name,
      username: user.username,
      songs,
    };
  }

  async deleteByPlaylistIdAndSongId(playlistId, songId) {
    const rows = await this._deleteBy({ playlistId, songId });

    if (!rows.length) {
      throw new NotFoundError('Lagu di dalam playlist gagal dihapus. Lagu tidak ditemukan');
    }

    return rows[0][this._primaryKey];
  }
}

module.exports = PlaylistSongService;
