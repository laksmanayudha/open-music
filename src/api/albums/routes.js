const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.store(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.detail(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request, h) => handler.update(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request, h) => handler.delete(request, h),
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => handler.uploadCover(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
];

module.exports = routes;
