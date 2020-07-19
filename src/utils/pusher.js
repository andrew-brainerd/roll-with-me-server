const Pusher = require('pusher');

const appId = process.env.PUSHER_APP_ID;
const appKey = process.env.PUSHER_APP_KEY;
const appSecret = process.env.PUSHER_APP_SECRET;

const pusher = new Pusher({
  appId,
  key: appKey,
  secret: appSecret,
  cluster: 'us2',
  useTLS: true
});

module.exports = {
  pusher
};
