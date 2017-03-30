const express = require('express');
const bodyParser = require('body-parser');
const OAuth2Strategy = require('passport-oauth2');
const request = require('request');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const datasources = require('../cfg/datasources.json');

const db = require('./db.js');
const app = express();
const routes = require('./routes.js');

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.url);
  return next();
});
app.use(bodyParser.json());
app.use(session({
  store: new pgSession({
    conString: {
      user: datasources.postgres.username,
      password: datasources.postgres.password,
      host: datasources.postgres.host,
      port: datasources.postgres.port,
      database: datasources.postgres.database
    }
  }),
  secret: 'blah',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days 
}));
app.set('postgres', db);

if (process.env.NODE_ENV === 'development' || process.env.NODE_SERVE_STATIC) {
  app.use(express.static('client/dist'));
  app.get('/', express.static('client/dist'));
}

app.get('/ping', (req, res, next) => {
  res.send('pong');
  return next();
});

app.use(routes);

app.listen(3000);
