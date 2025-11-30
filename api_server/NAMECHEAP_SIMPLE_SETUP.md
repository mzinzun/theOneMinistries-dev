# Namecheap Setup Guide - Simplified for DATABASE_URL

## 🎯 **Your Namecheap Configuration**

### **Environment Variable in Namecheap Node.js App:**
In your Namecheap cPanel Node.js app settings, add this single environment variable:

**Variable Name:** `DATABASE_URL`
**Variable Value:** `postgres://theocsju_tom_db_user:Yahweh3@tom@localhost:5432/theocsju_the-one-ministries-db`

That's it! No need for multiple DB_ variables.

---

## 📁 **Updated Files for cPanel:**

### **1. Create: `database/postgres-config.js`**
```javascript
// Namecheap PostgreSQL Configuration
// Uses DATABASE_URL environment variable set in Namecheap Node.js app settings

const { parse } = require('url');

// Parse the DATABASE_URL if provided, otherwise use individual components
const getDatabaseConfig = () => {
  // Namecheap uses DATABASE_URL format:
  // postgres://username:password@host:port/database
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const params = parse(databaseUrl);
    const auth = params.auth ? params.auth.split(':') : [];

    return {
      user: auth[0] || 'postgres',
      password: auth[1] || '',
      host: params.hostname || 'localhost',
      port: parseInt(params.port) || 5432,
      database: params.pathname ? params.pathname.split('/')[1] : 'postgres',
      ssl: {
        rejectUnauthorized: false // Required for Namecheap hosting
      },
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
```

### **2. Create: `database/postgres-connection.js`**
```javascript
const { Pool } = require('pg');
const config = require('./postgres-config');

// Create connection pool
const pool = new Pool(config);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection established successfully');
    console.log(`Connected to database: ${config.database} on ${config.host}:${config.port}`);
    client.release();
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    throw err;
  }
};

// Execute query with error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Query error:', { text, error: err.message });
    throw err;
  }
};

// Get a client from the pool (for transactions)
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error('The last executed query on this client was:', client.lastQuery);
  }, 5000);

  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };

  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.lastQuery = undefined;
    release();
  };

  return client;
};

// Transaction helper
const transaction = async (callback) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log('Closing PostgreSQL connection pool...');
  await pool.end();
  console.log('PostgreSQL connection pool closed.');
};

// Handle process termination
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
  shutdown
};
```

### **3. Create: `database/migrate.js`**
(Use the same 358-line migration script I provided earlier)

---

## 🚀 **Steps for Namecheap Setup:**

### **Step 1: In Namecheap cPanel**
1. Go to your Node.js app settings
2. Add environment variable:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgres://theocsju_tom_db_user:Yahweh3@tom@localhost:5432/theocsju_the-one-ministries-db`

### **Step 2: Upload Files**
Create the 3 database files in your `api_server/database/` folder using cPanel File Manager

### **Step 3: Install Dependencies**
In cPanel Terminal:
```bash
cd /path/to/your/api_server
npm install pg
```

### **Step 4: Run Migration**
```bash
npm run migrate
```

---

## 🔧 **What This Setup Does:**

1. **Parses your DATABASE_URL** automatically to extract:
   - User: `theocsju_tom_db_user`
   - Password: `Yahweh3@tom` (handles the @ symbol correctly)
   - Host: `localhost`
   - Port: `5432`
   - Database: `theocsju_the-one-ministries-db`

2. **Sets SSL settings** appropriate for Namecheap hosting

3. **Provides fallback** for local development if you ever need it

## ✅ **Benefits:**
- ✅ **Single environment variable** (cleaner)
- ✅ **Standard format** used by most hosting providers
- ✅ **No .env file needed** (Namecheap manages it)
- ✅ **Works with your exact credentials**

This is much simpler and follows Namecheap's preferred approach! 🚀
