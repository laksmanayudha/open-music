const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.login(request, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.refreshAccessToken(request, h),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteRefreshToken(request, h),
  },
];

module.exports = routes;
