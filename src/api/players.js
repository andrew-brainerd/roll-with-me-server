const players = require('express').Router();
const playersData = require('../data/players');
const status = require('../utils/statusMessages');
const { validator } = require('../utils/validator');
const { postPlayerBody, getPlayerByEmailQuery } = require('./validation/players');

players.post('/', validator.body(postPlayerBody), async (req, res) => {
  const { body: { name, email } } = req;

  const newPlayer = await playersData.createPlayer({ name, email });
  if (!newPlayer) return status.serverError(res, 'Failed', `Failed to create player [${name}]`);

  return status.created(res, { ...newPlayer });
});

players.get('/email', validator.query(getPlayerByEmailQuery), async (req, res) => {
  const { query: { email } } = req;

  const player = await playersData.getPlayerByEmail(email);

  return status.success(res, { doesNotExist: !player, ...player });
});

module.exports = players;
