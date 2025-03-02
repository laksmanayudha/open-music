const { UserPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

module.exports = {
  validatePayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
