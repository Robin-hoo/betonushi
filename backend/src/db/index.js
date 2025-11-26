require('dotenv').config();
const { Pool } = require('pg');

/**
 * A single connection pool that can be reused across the app.
 * Uses DATABASE_URL if provided, otherwise falls back to discrete env vars.
 */
const useConnString = Boolean(process.env.DATABASE_URL);

const baseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
};

const pool = new Pool(
  useConnString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: baseConfig.ssl,
      }
    : baseConfig
);

module.exports = {
  /**
   * Run a parametrized query using the shared pool.
   * @param {string} text - SQL text.
   * @param {Array} params - Query parameters.
   */
  query: (text, params) => pool.query(text, params),
};


