const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.store(request, h),
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.all(request, h),
  },
  {
    method: 'DELETE',
    path: '/playlists',
    handler: (request, h) => handler.delete(request, h),
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.addSongToPlaylist(request, h),
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getSongsInPlaylist(request, h),
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deleteSongInPlaylist(request, h),
  },
];

module.exports = routes;
