require("dotenv").config({ path: ".env.local" });
// server.js
const fastify = require("fastify")({ logger: true });
const routes = require("./routes");
// Run the server!
fastify.register(routes);

const PORT = process.env.PORT || 6000;
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
