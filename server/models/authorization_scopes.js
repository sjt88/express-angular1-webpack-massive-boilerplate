const scopes = {};

scopes.create = (data, db) => {
	return new Promise((resolve, reject) => {
		db.authorization_scopes.save({
			name: data.name,
			description: data.description || ''
		}, function(err, result) {
			if (err) return reject(err);

			return resolve(result);
		});
	});
};

scopes.get = (id, db) => {
	let ids;
	if (Array.isArray(id)) ids = id;
	else ids = [id];

	if (ids.length === 0) return Promise.resolve([]);

	return new Promise((resolve, reject) => {
		db.authorization_scopes.find({id: ids}, function(err, scopes) {
			if (err) return reject(err);

			if (scopes.length < 1) return reject('no scope found matching id: ' + id);
			else return resolve(scopes);
		});
	});
};

scopes.delete = (id, db) => {
	return new Promise((resolve, reject) => {
		db.authorization_scopes.destroy({id: id}, function(err, scope) {
			if (err) return reject(err);

			return resolve(scope);
		});
	});
};

scopes.deleteMultiple = (ids, db) => {
	return Promise.all(ids.forEach(id => scopes.delete(id, db)));
};

scopes.list = (db) => {
	return new Promise((resolve, reject) => {
		db.run('SELECT * FROM authorization_scopes', function(err, result) {
			if (err) return reject(err);

			console.log(result);
			return resolve(result);
		});
	});
};

module.exports = scopes;
