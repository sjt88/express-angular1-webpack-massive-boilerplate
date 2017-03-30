const auth = require('express').Router();

const users = require('../models/users.js');
const authorization_scopes = require('../models/authorization_scopes.js');
const authorization_user_scopes = require('../models/authorization_user_scopes.js');

const middleware = require('../middleware.js');

auth.get('/', (req, res, next) => {
  res.redirect('/login');
  return next();
});

auth.get('/loggedin', (req, res, next) => {
  if (req.session.userID) {
    res.send({
      loggedin: true,
      username: req.session.username,
      scopes: req.session.authorized_scopes_names
    });

    return next();
  }
  res.send({ loggedin: false });
  return next();
});

auth.post('/login', middleware.isNotAuthenticated, function(req, res, next) {
  let errors = {};
  if (!req.body.username) errors.username = 'You must provide a username';
  if (!req.body.password) errors.password = 'You must provide a password';
  if (Object.keys(errors).length > 0) {
    return res.send(403, { errors: errors, data: req.body });
  }

  let db = req.app.get('postgres');

  users.findByName(req.body.username, db).then(result => {
    if (result == undefined || req.body.password !== result.password) {
      return Promise.reject({
        status: 403,
        response: { data: req.body, errors: { msg: 'Incorrect username or password' }}
      });
    }
    return Promise.all([result, authorization_user_scopes.list(result.id, db)]);
  })
  .then(result => {
    let user = result[0];
    let userScopes = result[1] || {authorized_scopes: []};

    req.session.authenticated = true;
    req.session.username = user.username;
    req.session.userID = user.id;
    req.session.authorized_scopes = userScopes.authorized_scopes || [];

    return authorization_scopes.get(req.session.authorized_scopes, db);
  })
  .then(scopes => {
    req.session.authorized_scopes_names = scopes.map(scope => scope.name);
    console.log(req.session);
    return res.send({
      username: req.session.username,
      scopes: req.session.authorized_scopes_names
    });
  })
  .catch(err => {
    console.log(err);
    if (err.status) {
      console.log(err.status);
      if (err.response) return res.send(err.status, err.response);
      return res.status(err.status);
    }
    console.log('returning status');
    res.status(500);
  });
});

auth.get('/logout', middleware.isAuthenticated, function(req, res) {
  console.log('destroying session');
  console.log(req);
  req.session.destroy(function(err) {

    return res.send({ ok: true });
  });
});

auth.post('/register', function(req, res, next) {
  let db = req.app.get('postgres');
  users.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }, db).then(result => {
    console.log(result);
    if (result.errors) {
      return res.send(400, { errors: errors });
    } else {
      req.session.authenticated = true;
      req.session.username = result.username;
      req.session.userID = result.id;

      res.status(200).send({
        username: result.username,
        email: result.email,
        id: result.id
      });
    }
  }).then(next).catch(err => {
    console.log('err');
    console.log(JSON.stringify(err));
    res.send(500);
  });
});

auth.get('/scopes', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminAuthScopesRead'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  authorization_scopes.list(db).then(scopes => {
    res.send(scopes);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

auth.post('/scopes', [
    middleware.isAuthenticated,
    middleware.requiresScopes(['adminAuthScopesWrite'])
  ], (req, res, next) => {

  let db = req.app.get('postgres');
  authorization_scopes.create({
    name: req.body.name,
    description: req.body.description
  }, db).then(scope => {
    res.send(scope);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

auth.get('/scopes/:pk', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminAuthScopesRead'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  authorization_scopes.get(req.body.id, db).then(scope => {
    res.send(scope);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

auth.delete('/scopes/:id', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminAuthScopesWrite'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  authorization_scopes.delete(req.params.id, db).then(deleted => {
    console.log('deleted ', JSON.stringify(deleted));
    res.send(deleted);
  }).catch(err => {
    console.error(err);
    res.send(500);
  });
});

auth.get('/users', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminUsersRead'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  users.list(db).then(users => {
    console.log('users:', JSON.stringify(users));
    res.send(users);
  }).catch(err => {
    console.log('err');
    console.log(err);
    res.send(500);
  });
});

auth.post('/users', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminUsersWrite'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  console.log(req.body);
  users.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email    
  }, db)
  .then(result => {
    console.log(result);
    if (result.errors) {
      console.log('bad user input');
      return res.send(400, { errors: errors });
    }
    res.status(200).send({
      username: result.username,
      email: result.email,
      id: result.id
    });
  })
  .then(next)
  .catch(err => {
    console.log('err');
    console.log(JSON.stringify(err));
    res.send(500);
  });
});

auth.delete('/users/:id', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminUsersWrite'])
], (req, res, next) => {
  console.log('deleting user: ' + req.params.id);
  let db = req.app.get('postgres');
  users.destroy(req.params.id, db).then(result => {
    console.log('destroyed record:');
    console.log(result);
    res.send(result);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

auth.get('/users/:id/scopes', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminUsersRead'])
], (req, res, next) => {
  let db = req.app.get('postgres');
  authorization_user_scopes.list(req.params.id, db).then(result => {
    console.log(result);
    res.send(result);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

auth.post('/users/:id/scopes', [
  middleware.isAuthenticated,
  middleware.requiresScopes(['adminUsersWrite'])
], (req, res, next) => {
  console.log('scopes request');
  let db = req.app.get('postgres');
  let id = req.params.id;
  let scopes = req.body.authorized_scopes;
  console.log('id: ', id);
  console.log('scopes: ', scopes);
  authorization_user_scopes.save(id, scopes, db).then(userScopes => {
    console.log(userScopes);
    res.send(userScopes);
  }).catch(err => {
    console.log(err);
    res.send(500);
  });
});

module.exports = auth;
