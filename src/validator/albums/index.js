const { AlbumPayloadSchema, AlbumPostCoverPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeaders: (payload) => {
    const validationResult = AlbumPostCoverPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
