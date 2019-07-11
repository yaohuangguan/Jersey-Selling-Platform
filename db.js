const { Pool } = require('pg');

const pool = new Pool({ ssl: true });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
