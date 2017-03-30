const massive = require('massive');
const cwd = process.cwd();
const datasources = require('../cfg/datasources.json');
const config = require('../cfg/config.json');
const Log = require('log');
const logger = new Log(config.logLevel);

console.log(cwd + '/cfg/datasources.json');
console.log(datasources);

var username = datasources.postgres.username;
var password = datasources.postgres.password;
var host     = datasources.postgres.host;
var port     = datasources.postgres.port;
var database = datasources.postgres.database;

const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

logger.info(`Connecting to: ${connectionString}`);

const db = massive.connectSync({
  connectionString: connectionString
});

logger.info(`Connected to: ${connectionString}`);

module.exports = db;
