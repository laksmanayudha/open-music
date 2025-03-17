const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlist/{id}',
    handler: (request, h) => handler.exportPlaylist(request, h),
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = routes;
