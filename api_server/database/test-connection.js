// Simple database connection test - minimal dependencies
const { Client } = require('pg');

async function testDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable not set');
  }

  console.log('Testing connection to PostgreSQL...');
  console.log('Database URL exists:', !!databaseUrl);

  const url = new URL(databaseUrl);
  const config = {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    ssl: false
  };

  console.log('Connection config:', {
    user: config.user,
    host: config.host,
    port: config.port,
    database: config.database,
    ssl: config.ssl
  });

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Connection successful!');

    // Test simple query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query test successful:', result.rows[0]);

    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    await client.end();
    throw error;
  }
}

if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { testDatabaseConnection };
