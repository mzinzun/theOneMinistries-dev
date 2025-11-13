# PostgreSQL Migration Guide

## Overview
This guide walks you through migrating your TheOneMinistries API from MongoDB to PostgreSQL for Namecheap hosting.

## Prerequisites
- Node.js installed
- PostgreSQL database available (local or Namecheap hosting)
- Access to your database credentials

## Step 1: Install Dependencies

```bash
cd api_server
npm install pg
```

The `pg` package has already been added to your `package.json`.

## Step 2: Environment Configuration

1. Copy the environment template:
```bash
cp .env.template .env
```

2. Edit `.env` with your actual database credentials:
```bash
# For local development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=theoneministries_dev
DB_USER=postgres
DB_PASSWORD=your_password

# For Namecheap hosting
DB_HOST=your_namecheap_db_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=true
```

## Step 3: Run Database Migration

Create all PostgreSQL tables:
```bash
npm run migrate
```

This will:
- ✅ Test database connection
- 🏗️ Create all tables with proper schemas
- ⚡ Set up triggers for automatic `updated_at` timestamps
- 📊 Show table summary

### Alternative Commands:
```bash
# Drop all tables first (use with caution!)
npm run migrate:drop

# Same as migrate
npm run db:setup
```

## Step 4: Database Schema Created

The migration creates these tables:

### Core Tables:
- **users** - User accounts with authentication
- **events** - Ministry events
- **prayers** - Prayer requests
- **studies** - Bible studies with rich content
- **questions** - Q&A system
- **charities** - Charity information
- **charity_donations** - Individual donations
- **contributions** - User contributions
- **encouragements** - Inspirational content
- **scriptures** - Bible verses

### Key Features:
- 🔐 **Password hashing** with bcrypt
- 📅 **Automatic timestamps** (created_at, updated_at)
- 🔍 **Database indexes** for performance
- 📊 **JSON fields** for complex data (arrays, objects)
- 🔗 **Foreign keys** for data integrity

## Step 5: Controller Migration

### Example Usage
A PostgreSQL version of the user controller has been created:
- `controllers/user_controller_pg.js` - New PostgreSQL version
- `controllers/user_controller.js` - Original MongoDB version

### Key Differences:
```javascript
// MongoDB/Mongoose (old)
const user = await User.findOne({ username });

// PostgreSQL (new)
const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
const user = result.rows[0];
```

### Migration Pattern:
1. Replace `require('../models/Model')` with `require('../database/postgres-connection')`
2. Convert Mongoose queries to SQL
3. Handle JSON fields with `JSON.stringify()` and `JSON.parse()`
4. Use parameterized queries ($1, $2, etc.) for SQL injection protection

## Step 6: Update Your Server

Replace the mongoose connection in your main server file:

```javascript
// Old MongoDB connection
// const mongoose = require('./database/mongoose-connection');

// New PostgreSQL connection
const db = require('./database/postgres-connection');

// Test connection on startup
db.testConnection()
  .then(() => console.log('Database connected'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
```

## Step 7: Controller Conversion

To convert other controllers:

1. Copy the pattern from `user_controller_pg.js`
2. Replace Mongoose model calls with SQL queries
3. Handle field name mapping (camelCase ↔ snake_case)
4. Convert embedded documents to separate tables or JSON fields
5. Use transactions for complex operations

### Field Naming Convention:
- **JavaScript**: `firstName`, `createdAt` (camelCase)
- **PostgreSQL**: `first_name`, `created_at` (snake_case)

## Step 8: Data Migration (Optional)

If you have existing MongoDB data to migrate:

1. Export data from MongoDB
2. Create a data migration script
3. Transform and insert into PostgreSQL

## Step 9: Testing

Test your migration:

```bash
# Start your server
npm start

# Test API endpoints
curl http://localhost:3001/api/users
```

## Troubleshooting

### Connection Issues:
- Verify database credentials
- Check network connectivity
- Ensure PostgreSQL is running
- For Namecheap: verify SSL settings

### Table Creation Issues:
- Check PostgreSQL permissions
- Verify database exists
- Review error logs

### Query Issues:
- Check parameter count in SQL queries
- Verify column names match schema
- Ensure proper data types

## Production Deployment

For Namecheap hosting:

1. Set production environment variables
2. Enable SSL connection
3. Run migration on production database
4. Deploy your updated Node.js application

## Files Created/Modified

### New Files:
- `database/postgres-config.js` - Database configuration
- `database/postgres-connection.js` - Connection pool and utilities
- `database/migrate.js` - Database migration script
- `controllers/user_controller_pg.js` - Example PostgreSQL controller
- `.env.template` - Environment template

### Modified Files:
- `package.json` - Added pg dependency and migration scripts

## Next Steps

1. ✅ Test the migration locally
2. 🔄 Convert remaining controllers one by one
3. 🧪 Test all API endpoints
4. 🚀 Deploy to Namecheap hosting
5. 📊 Monitor performance and optimize queries

Happy migrating! 🚀
