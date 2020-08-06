const Joi = require('joi');

const postGameBody = Joi.object({
  type: Joi.string().required(),
  createdBy: Joi.string().required()
});

const defaultGameParams = Joi.object({
  gameId: Joi.string().required()
});

const patchGameBody = Joi.object({
  game: Joi.object().required()
});

const getPlayerGamesQuery = Joi.object({
  pageNum: Joi.number(),
  pageSize: Joi.number(),
  playerId: Joi.string().required()
});

const getGamePlayersParams = Joi.object({
  gameId: Joi.string().required()
});

const patchPlayersBody = Joi.object({
  playerId: Joi.string().required()
});

module.exports = {
  postGameBody,
  defaultGameParams,
  patchGameBody,
  getPlayerGamesQuery,
  getGamePlayersParams,
  patchPlayersBody
};
