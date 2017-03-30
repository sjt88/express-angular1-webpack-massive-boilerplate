
function save(id, scopes, db) {
	console.log('userScopes.update()');
	console.log(id);
	console.log(scopes);
	return new Promise((resolve, reject) => {
		exists(id, db).then(exists => {
			console.log('record exists: ' + exists);
			if (exists) return update(id, scopes, db);
			else return create(id, scopes, db);
		}).then(result => {
			return resolve(result);
		}).catch(err => {
			return reject(err);
		});
	});
};

function update(id, scopes, db) {
	console.log('updating user scopes record: ', id, scopes);
	return new Promise((resolve, reject) => {
		db.authorization_user_allowed_scopes.update({
			user_id: id,
			authorized_scopes: scopes
		}, function(err, result) {
			if (err) return reject(err);
			return resolve(result);
		});
	});
};

function create(id, scopes, db) {
	console.log('creating user scopes record: ', id, scopes);
	return new Promise((resolve, reject) => {
		db.authorization_user_allowed_scopes.insert({
			user_id: id,
			authorized_scopes: scopes
		}, function(err, result) {
			if (err) return reject(err);
			return resolve(result);
		});
	});
};

function exists(id, db) {
	return new Promise((resolve, reject) => {
		db.authorization_user_allowed_scopes.count({user_id: id}, function(err, result) {
			console.log('existing records for id: ' + id + ' - ', result);
			if (err) return reject(err);
			if (result > 0) return resolve(true);
			return resolve(false);			
		});
	});
};

function list(id, db) {
	return new Promise((resolve, reject) => {
		db.authorization_user_allowed_scopes.findOne({user_id: id}, function (err, result) {
			if (err) return reject(err);
			resolve(result);
		});
	});
};

const userScopes = {
	save: save,
  update: update,
  create: create,
  exists: exists,
  list: list
};

module.exports = userScopes;
