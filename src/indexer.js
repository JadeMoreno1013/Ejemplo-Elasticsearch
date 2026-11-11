const fs = require('node:fs/promises');
const path = require('node:path');

const MOVIES_FILE = path.join(__dirname, '..', 'data', 'movies.json');

const MOVIE_MAPPING = {
  properties: {
    title: { type: 'text' },
    synopsis: { type: 'text', analyzer: 'spanish' },
    genre: { type: 'keyword' },
    year: { type: 'integer' },
    rating: { type: 'float' },
  },
};

async function loadMovies() {
  const content = await fs.readFile(MOVIES_FILE, 'utf-8');
  return JSON.parse(content);
}

async function recreateIndex(client, indexName) {
  const indexExists = await client.indices.exists({ index: indexName });

  if (indexExists) {
    await client.indices.delete({ index: indexName });
  }

  await client.indices.create({ index: indexName, mappings: MOVIE_MAPPING });
}

async function indexMovies(client, indexName, movies) {
  const operations = movies.flatMap(({ id, ...document }) => [
    { index: { _index: indexName, _id: String(id) } },
    document,
  ]);

  const response = await client.bulk({ refresh: true, operations });

  if (response.errors) {
    const failedCount = response.items.filter((item) => item.index.error).length;
    throw new Error(`${failedCount} documents could not be indexed`);
  }

  return movies.length;
}

module.exports = { loadMovies, recreateIndex, indexMovies };
