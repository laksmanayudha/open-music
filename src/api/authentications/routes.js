const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.login(request, h),
  },
];

module.exports = routes;
