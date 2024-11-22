const { Pool } = require('pg');

// Configure your PostgreSQL database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'voltana',
  password: 'Sattwik@2002',
  port: 5432, // Default PostgreSQL port
});

// Export the pool for use in other files
module.exports = pool;
