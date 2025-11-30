// Namecheap PostgreSQL Configuration
// Uses DATABASE_URL environment variable set in Namecheap Node.js app settings

// Parse the DATABASE_URL if provided, otherwise use individual components
const getDatabaseConfig = () => {
  // Namecheap uses DATABASE_URL format:
  // postgres://username:password@host:port/database
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Use modern URL constructor (built into Node.js, no imports needed)
    const url = new URL(databaseUrl);

    return {
      user: url.username || 'postgres',
      password: url.password || '',
      host: url.hostname || 'localhost',
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1) || 'postgres', // Remove leading slash
      ssl: false, // Disable SSL for Namecheap shared hosting
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  // Fallback to individual environment variables (for local development)
  return {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
};

module.exports = getDatabaseConfig();
