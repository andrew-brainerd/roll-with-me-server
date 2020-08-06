const games = require('express').Router();
const gamesData = require('../data/games');
const status = require('../utils/statusMessages');
const { validator } = require('../utils/validator');
const {
  postGameBody,
  defaultGameParams,
  patchGameBody,
  getPlayerGamesQuery,
  getGamePlayersParams,
  patchPlayersBody
} = require('./validation/games');

games.post('/', validator.body(postGameBody), async (req, res) => {
  const { body: { type, createdBy} } = req;

  const newGame = await gamesData.createGame(type, createdBy);
  if (!newGame) return status.serverError(res, 'Failed', `Failed to create ${type} game for ${createdBy}`);

  return status.created(res, { ...newGame });
});

games.get('/', validator.query(getPlayerGamesQuery), async (req, res) => {
  const { query: { pageNum, pageSize, playerId } } = req;
  const page = parseInt(pageNum) || 1;
  const size = parseInt(pageSize) || 50;

  const { items, totalItems, totalPages } = await gamesData.getGames(page, size, playerId);

  if (!items) return status.serverError(res, 'Failed', 'Failed to get player games');

  return status.success(res, {
    items,
    pageNum: page,
    pageSize: size,
    totalItems,
    totalPages
  });
});

games.get('/:gameId', validator.params(defaultGameParams), async (req, res) => {
  const { params: { gameId } } = req;

  const game = await gamesData.getGame(gameId);
  return status.success(res, { ...game });
});

games.patch('/:gameId',
  validator.params(defaultGameParams),
  validator.body(patchGameBody),
  async (req, res) => {
    const { params: { gameId }, body: { game } } = req;

    const savedGame = await gamesData.saveGame(gameId, game);
    return status.success(res, { ...savedGame });
  });

games.delete('/:gameId', validator.params(defaultGameParams), async (req, res) => {
  const { params: { gameId } } = req;

  await gamesData.deleteGame(gameId);

  return status.success(res, { message: `Deleted game ${gameId}` });
});

games.get('/:gameId/players', validator.params(getGamePlayersParams), async (req, res) => {
  const { params: { gameId } } = req;

  const players = await gamesData.getPlayers(gameId);

  return status.success(res, { ...players });
});

games.patch('/:gameId/players',
  validator.params(defaultGameParams),
  validator.body(patchPlayersBody), async (req, res) => {
    const { params: { gameId }, body: { playerId } } = req;

    const addedPlayer = await gamesData.addPlayer(gameId, playerId);

    return status.success(res, { ...addedPlayer });
  }
);

module.exports = games;
