const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

module.exports.reminderApiUser = process.env.BASIC_USER;
module.exports.reminderApiPassword = process.env.BASIC_PASSWORD;
module.exports.reminderApiUrl = process.env.PUBLIC_URL;
