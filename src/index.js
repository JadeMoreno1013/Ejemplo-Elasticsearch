const { loadConfig } = require('./config');
const { createClient } = require('./client');
const { loadMovies, recreateIndex, indexMovies } = require('./indexer');
const { searchByText, countByGenre } = require('./search');

async function runSetup(client, indexName) {
  const movies = await loadMovies();
  await recreateIndex(client, indexName);
  const total = await indexMovies(client, indexName, movies);
  console.log(`Indexed ${total} movies in "${indexName}"`);
}

async function runSearch(client, indexName, text) {
  const results = await searchByText(client, indexName, text);

  if (results.length === 0) {
    console.log('No results found');
    return;
  }

  results.forEach((result) => {
    console.log(`${result.title} (${result.year}) [${result.genre}] score: ${result.score.toFixed(2)}`);
  });
}

async function runGenres(client, indexName) {
  const genres = await countByGenre(client, indexName);
  genres.forEach(({ genre, total }) => console.log(`${genre}: ${total}`));
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const config = loadConfig();
  const client = createClient(config);

  try {
    switch (command) {
      case 'setup':
        await runSetup(client, config.indexName);
        break;
      case 'search':
        await runSearch(client, config.indexName, args.join(' '));
        break;
      case 'genres':
        await runGenres(client, config.indexName);
        break;
      default:
        throw new Error('Unknown command. Use: setup, search <text> or genres');
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
