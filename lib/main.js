const fetch = require('node-fetch');

// Node-fetch: PERFORM HTTP REQUESTS
// Fastify: SERVE HTML and MAP ROUTES

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

fastify.get('/', async () => {

  // Proof of concept
  return { hello: 'world' }
})

fastify.get('/status', async () => {

  // Returns status of elasticsearch cluster
  const request = await fetch('http://localhost:9200');
  const body = await request.json();

  return body
})

fastify.get('/search', async () => {

  // Returns default match_all search for index
  const request = await fetch('http://localhost:9200/eik_search/_search');
  const body = await request.json();

  return body
})

fastify.get('/search2', async (req, reply) => {
  // Returns search on author name, name, org or scope for one or more strings passed into the query string parameter
  // Example usage 1: http://localhost:3000/search2?q="jane,some"
  // Example usage 2: http://localhost:3000/search2?q=some-package,example.com,under_score,123numeric,thingy

  const request = await fetch('http://localhost:9200/eik_search/_search', { 
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      {
        "_source": ["author.name", "author.user", "name", "org", "scope"],
        "query": {
          "match": {
            "name": req.query.q
          }
        }
      }
    )
  });
  const body = await request.json();
  return body
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()