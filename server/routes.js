const api = require('express').Router();
const auth = require('./controllers/auth.js');

api.use('/auth', auth);

module.exports = api;
