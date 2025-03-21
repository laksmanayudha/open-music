const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.store(request, h),
  },
];

module.exports = routes;
