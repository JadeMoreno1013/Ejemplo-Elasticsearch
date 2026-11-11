const REQUIRED_VARIABLES = ['ELASTIC_NODE', 'ELASTIC_API_KEY', 'INDEX_NAME'];

function loadConfig() {
  const missing = REQUIRED_VARIABLES.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return {
    node: process.env.ELASTIC_NODE,
    apiKey: process.env.ELASTIC_API_KEY,
    indexName: process.env.INDEX_NAME,
  };
}

module.exports = { loadConfig };
