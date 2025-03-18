const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: (request, h) => handler.exportPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
