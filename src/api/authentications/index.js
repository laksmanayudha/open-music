const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    service,
    userService,
    validator,
    tokenizer,
  }) => {
    const authenticationHandler = new AuthenticationHandler({
      service,
      userService,
      validator,
      tokenizer,
    });
    server.route(routes(authenticationHandler));
  },
};
