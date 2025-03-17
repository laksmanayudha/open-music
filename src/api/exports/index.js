const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: (server, { validator, service, playlistService }) => {
    const exportHandler = new ExportHandler({ validator, service, playlistService });
    server.route(routes(exportHandler));
  },
};
