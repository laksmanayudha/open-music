const {
  PlaylistPostPayloadSchema,
  PlaylistSongPostPayloadSchema,
  PlaylistSongDeletePayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const validatePayload = (payload, payloadSchema) => {
  const validationResult = payloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = {
  validatePostPayload: (payload) => validatePayload(payload, PlaylistPostPayloadSchema),
  validatePostSongPayload: (payload) => validatePayload(payload, PlaylistSongPostPayloadSchema),
  validateDeleteSongPayload: (payload) => validatePayload(payload, PlaylistSongDeletePayloadSchema),
};
