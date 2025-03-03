const InvariantError = require('../../exceptions/InvariantError');
const {
  PostAuthenticationPayload,
  PutAuthenticationPayload,
  DeleteAuthenticationPayload,
} = require('./schema');

const validatePayload = (payload, payloadSchema) => {
  const validationResult = payloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = {
  validatePostPayload: (payload) => validatePayload(payload, PostAuthenticationPayload),
  validatePutPayload: (payload) => validatePayload(payload, PutAuthenticationPayload),
  validateDeletePayload: (payload) => validatePayload(payload, DeleteAuthenticationPayload),
};
