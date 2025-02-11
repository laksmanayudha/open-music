const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().require(),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };
