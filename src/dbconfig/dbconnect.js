const { Pool } = require("pg");
exports.pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 30, // Adjust based on testing, 20-30 is a good starting point
  idleTimeoutMillis: 10000, // Release idle clients after 10 seconds
  connectionTimeoutMillis: 2000,
});
