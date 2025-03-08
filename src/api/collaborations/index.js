const CollaborationtHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    playlistService,
    userService,
  }) => {
    const collaborationHandler = new CollaborationtHandler({
      service,
      validator,
      playlistService,
      userService,
    });
    server.route(routes(collaborationHandler));
  },
};
