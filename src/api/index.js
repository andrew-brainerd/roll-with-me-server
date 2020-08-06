const router = require('express').Router();
const appInfo = require('../../package.json');

router.get('/', (req, res) => {
  res.send({
    message: `Welcome to the Roll With Me API v${appInfo.version}!`
  });
});

router.use('/games', require('./games'));
router.use('/messaging', require('./messaging'));
router.use('/users', require('./players'));

module.exports = router;
