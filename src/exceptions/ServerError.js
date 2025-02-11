class ServerError extends Error {
  constructor(message = 'Terjadi kendala pada server', statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
