const { Client } = require('@elastic/elasticsearch');

function createClient(config) {
  return new Client({
    node: config.node,
    auth: { apiKey: config.apiKey },
  });
}

module.exports = { createClient };
