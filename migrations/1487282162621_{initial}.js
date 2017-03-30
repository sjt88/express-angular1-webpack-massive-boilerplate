const fs = require('fs');
const path = require('path');

exports.up = function(pgm) {
  pgm.sql(fs.readFileSync(path.resolve(__dirname, './sql/initial/session-table.sql')));
  pgm.sql(fs.readFileSync(path.resolve(__dirname, './sql/initial/users-table.sql')));
  pgm.sql(fs.readFileSync(path.resolve(__dirname, './sql/initial/authorization_scopes.sql')));
  pgm.sql(fs.readFileSync(path.resolve(__dirname, './sql/initial/authorization_user_allowed_scopes.sql')));
  // create admin user
  pgm.sql(`INSERT INTO users VALUES (99999, 'admin', 'admin@localhost.com', 'admin');`);
  pgm.sql(`INSERT INTO authorization_scopes VALUES (1, 'adminAuthScopesWrite', 'Allows write access to authorization scopes');`);
  pgm.sql(`INSERT INTO authorization_scopes VALUES (2, 'adminAuthScopesRead',  'Allows read access to authorization scopes');`);
  pgm.sql(`INSERT INTO authorization_scopes VALUES (3, 'adminUsersRead',       'Allows read access to user management');`);
  pgm.sql(`INSERT INTO authorization_scopes VALUES (4, 'adminUsersWrite',      'Allows write access to user management');`);
  pgm.sql(`INSERT INTO authorization_user_allowed_scopes VALUES (99999, '{1,2,3,4}');`);
};

exports.down = function(pgm) {
  pgm.sql('drop table session');
  pgm.sql('drop table users');
  pgm.sql('drop table authorization_user_allowed_scopes');
  pgm.sql('drop table authorization_scopes');
};
