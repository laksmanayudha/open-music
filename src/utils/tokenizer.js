const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const config = require('./config');

module.exports = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.jwt.accessTokenKey),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.jwt.refreshTokenKey),
  verifyRefreshToken: (token) => {
    try {
      const artifacts = Jwt.token.decode(token);
      Jwt.token.verifySignature(artifacts, config.jwt.refreshTokenKey);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError(`Refresh token tidak valid: ${error.message}`);
    }
  },
};
