const users = {};

function usernameExists(username, db) {
  return new Promise((resolve, reject) => {
    db.users.count({ username: username }, function(err, count) {
      if (err) return reject(err);
      if (count > 0) return resolve(true);

      return resolve(false);
    });
  });
}

function userIDExists (userID, db) {
  return new Promise((resolve, reject) => {
    db.users.count({ id: userID }, function(err, count) {
      if (err) return reject(err);
      if (count > 0) return resolve(true);

      return resolve(false);
    });
  });
}

function emailExists(email, db) {
  return new Promise((resolve, reject) => {
    db.users.count({ email: email }, function(err, count) {
      if (err) return reject(err);
      if (count > 0) return resolve(true);

      return resolve(false);
    });
  });
}

function destroyUserAuthorizedScopesRecord(userID, db) {
  return new Promise((resolve, reject) => {
    db.authorization_user_allowed_scopes.destroy({ user_id: userID }, function(err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function destroyUserRecord(userID, db) {
  return new Promise((resolve, reject) => {
    db.users.destroy({ id: userID }, function(err, res) {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function findByName(username, db) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ username: username }, function(err, result) {
      if (err) return reject(err);

      return resolve(result);
    });
  });
}

function create(user, db) {
  let errors = {};
  if (!user.email) errors.email = 'You must enter a valid email';
  if (!user.username) errors.username = 'You must enter a valid username';
  if (!user.password) errors.password = 'You must enter a valid password';

  if (Object.keys(errors).length > 0) {
    return new Promise((resolve, reject) => resolve({ errors: errors }));
  }

  return Promise.all([
    usernameExists(user.username, db),
    emailExists(user.email, db)
  ]).then(result => {
    let [usernameExists, emailExists] = result;
    let errors = {};

    if (usernameExists) errors.username = `The username ${user.username} has already been taken`;
    if (emailExists) errors.email = `An account for ${user.email} already exists`;
    if (Object.keys(errors).length > 0) return { errors: errors };

    return new Promise((resolve, reject) => {
      db.users.insert({
        username: user.username,
        password: user.password,
        email: user.email
      }, function(err, result) {
        if (err) return reject(err);

        return resolve(result);
      });
    });
  });
}

function list(db) {
  return new Promise((resolve, reject) => {
    db.run(`
      SELECT 
        users.id,
        users.username,
        users.email,
        authorization_user_allowed_scopes.authorized_scopes
      FROM users
      LEFT JOIN
        authorization_user_allowed_scopes
      ON users.id=authorization_user_allowed_scopes.user_id`,
      function(err, users) {
        if (err) return reject(err);

        return resolve(users);
      });
  });
}

function destroy(userID, db) {
  return userIDExists(userID, db).then(exists => {
    if (exists) return Promise.all([destroyUserAuthorizedScopesRecord(userID, db), destroyUserRecord(userID, db)]);
    else return {error: 'invalid user ID'};
  }).then(result => {
    if (result.error) return result;

    if (Array.isArray(result)) {
      console.log('result is an array:');
      console.log(result);
    }
    return result;
  });
};

module.exports = {
  usernameExists,
  emailExists,
  create,
  list,
  findByName,
  destroy
};
