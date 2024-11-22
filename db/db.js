const { Pool } = require('pg');

// Configure your PostgreSQL database connection
const pool = new Pool({
  user: 'sattwik',
  host: 'dpg-ct09dlq3esus7388egsg-a.singapore-postgres.render.com',
  database: 'users_ualo',
  password: 'LQvQoOj4l7h5Kd26G406NdEV8Z5H1X0I',
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Export the pool for use in other files
module.exports = pool;

//postgresql://sattwik:LQvQoOj4l7h5Kd26G406NdEV8Z5H1X0I@dpg-ct09dlq3esus7388egsg-a.singapore-postgres.render.com/users_ualo

/*
{
  "name": "Janu",
  "email": "jenin.doe@example.com",
  "password": "securepassword",
  "role": "admin"
}


*/