const MAX_RESULTS = 5;
const TITLE_BOOST = 2;

function validateSearchText(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('The search text must be a non-empty string');
  }

  return text.trim();
}

async function searchByText(client, indexName, text) {
  const searchText = validateSearchText(text);

  const response = await client.search({
    index: indexName,
    size: MAX_RESULTS,
    query: {
      multi_match: {
        query: searchText,
        fields: [`title^${TITLE_BOOST}`, 'synopsis'],
        fuzziness: 'AUTO',
      },
    },
  });

  return response.hits.hits.map((hit) => ({
    title: hit._source.title,
    genre: hit._source.genre,
    year: hit._source.year,
    score: hit._score,
  }));
}

async function countByGenre(client, indexName) {
  const response = await client.search({
    index: indexName,
    size: 0,
    aggs: {
      movies_per_genre: { terms: { field: 'genre' } },
    },
  });

  return response.aggregations.movies_per_genre.buckets.map((bucket) => ({
    genre: bucket.key,
    total: bucket.doc_count,
  }));
}

module.exports = { searchByText, countByGenre };
