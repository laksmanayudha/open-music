const Joi = require('joi');

const PlaylistPostPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistSongPostPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPostPayloadSchema, PlaylistSongPostPayloadSchema };
