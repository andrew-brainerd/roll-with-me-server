const { events } = require('gm-common');
const data = require('../utils/data');
const log = require('../utils/log');
const { pusher } = require('../utils/pusher');
const { GAMES_COLLECTION } = require('../constants/collections');
const { getPlayerById } = require('./players');

const createGame = async (type, createdBy) => {
  const newGame = await data.insertOne(
    GAMES_COLLECTION, {
    type,
    createdBy,
    currentPlayer: 'player1',
    players: {
      player1: createdBy
    }
  });

  log.success(`Created new ${type} game (${newGame._id})`);

  return newGame;
};

const getGames = async (page, size, playerId) => {
  return await data.getSome(GAMES_COLLECTION, page, size, 'createdBy', playerId);
};

const getGame = async gameId => {
  return await data.getById(GAMES_COLLECTION, gameId);
};

const deleteGame = async gameId => {
  return await data.deleteOne(GAMES_COLLECTION, gameId);
};

const getPlayers = async gameId => {
  const { players } = await getGame(gameId);
  
  return Promise.all((players || []).map(
    playerId => getPlayerById(playerId)
  ));
};

const addPlayer = async (gameId, playerId) => {
  const addedPlayer = await data.addToSet(GAMES_COLLECTION, gameId, { 'players': playerId });

  pusher.trigger(gameId, events.PLAYER_ADDED, { addedPlayer });
};

const saveGame = async (gameId, game) => {
  const currentGame = await data.getById(GAMES_COLLECTION, gameId);

  return await data.saveObject(GAMES_COLLECTION, { ...currentGame, ...game });
};

module.exports = {
  createGame,
  getGames,
  getGame,
  deleteGame,
  getPlayers,
  addPlayer,
  saveGame
};
