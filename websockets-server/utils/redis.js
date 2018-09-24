const util = require('util');
const client = require('redis').createClient();

module.exports = {
  redisKeys: util.promisify(client.keys).bind(client),
  redisGet: util.promisify(client.get).bind(client),
  redisSet: util.promisify(client.set).bind(client),
  redisDel: util.promisify(client.del).bind(client),
};
