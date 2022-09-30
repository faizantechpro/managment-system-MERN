'use strict';
const axios = require('axios');
const moment = require('moment');

module.exports.run = async (event, context) => {
  const date = moment().format('YYYY-MM-DD HH:mm');
  const data = JSON.stringify({ date });

  const config = {
    method: 'post',
    url: `${process.env.apiUrl}/api/notifications/reminder`,
    auth: {
      username: process.env.apiUser,
      password: process.env.apiPassword,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  return await axios(config);
};
