const db = require('./postgres-connection');

/**
 * Simple PostgreSQL Migration Script - Memory Optimized
 * Creates tables one at a time to reduce memory usage
 */

// Simplified table creation (one table at a time)
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    username VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    gift_type VARCHAR(255),
    gift_amount VARCHAR(255),
    charities JSONB DEFAULT '[]'::jsonb,
    morals JSONB DEFAULT '[]'::jsonb,
    journal JSONB DEFAULT '[]'::jsonb,
    history JSONB DEFAULT '[]'::jsonb,
    password VARCHAR(255) NOT NULL,
    study_start_date VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const createEventsTable = `
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    description TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const createPrayersTable = `
  CREATE TABLE IF NOT EXISTS prayers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    subject VARCHAR(255),
    prayer TEXT,
    created_by VARCHAR(255),
    answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const createStudiesTable = `
  CREATE TABLE IF NOT EXISTS studies (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

const createQuestionsTable = `
  CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    created_by VARCHAR(255),
    answer TEXT DEFAULT '',
    scripture TEXT DEFAULT '',
    answered BOOLEAN DEFAULT FALSE,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * Simple migration function - creates tables step by step
 */
async function runSimpleMigration() {
  try {
    console.log('🚀 Starting simple PostgreSQL migration...');

    // Test connection first
    console.log('Testing database connection...');
    await db.testConnection();

    console.log('Creating users table...');
    await db.query(createUsersTable);

    console.log('Creating events table...');
    await db.query(createEventsTable);

    console.log('Creating prayers table...');
    await db.query(createPrayersTable);

    console.log('Creating studies table...');
    await db.query(createStudiesTable);

    console.log('Creating questions table...');
    await db.query(createQuestionsTable);

    console.log('✅ Migration completed successfully!');
    console.log('📊 Created tables: users, events, prayers, studies, questions');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

// If this file is run directly, execute migration
if (require.main === module) {
  runSimpleMigration()
    .then(() => {
      console.log('Migration finished. Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration error:', error.message);
      process.exit(1);
    });
}

module.exports = { runSimpleMigration };
