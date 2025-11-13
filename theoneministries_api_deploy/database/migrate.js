const db = require('./postgres-connection');

/**
 * PostgreSQL Migration Script
 * Creates all tables based on MongoDB schemas
 * Run this script to set up your PostgreSQL database
 */

const createTablesSQL = {
  // Users table - equivalent to User model
  users: `
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

    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `,

  // Events table - equivalent to Event model
  events: `
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      city VARCHAR(255),
      description TEXT,
      created_by VARCHAR(255), -- Can store username or user ID
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
    CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
  `,

  // Prayers table - equivalent to Prayer model
  prayers: `
    CREATE TABLE IF NOT EXISTS prayers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      subject VARCHAR(255),
      prayer TEXT,
      created_by VARCHAR(255), -- Can store username or user ID
      answered BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_prayers_created_by ON prayers(created_by);
    CREATE INDEX IF NOT EXISTS idx_prayers_answered ON prayers(answered);
    CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayers(created_at);
  `,

  // Studies table - equivalent to Study model
  studies: `
    CREATE TABLE IF NOT EXISTS studies (
      id SERIAL PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content JSONB DEFAULT '{}'::jsonb, -- Store Quill Delta object
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_studies_category ON studies(category);
    CREATE INDEX IF NOT EXISTS idx_studies_title ON studies(title);
    CREATE INDEX IF NOT EXISTS idx_studies_created_at ON studies(created_at);
  `,

  // Questions table - equivalent to Question model
  questions: `
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      created_by VARCHAR(255), -- Can store username or user ID
      answer TEXT DEFAULT '',
      scripture TEXT DEFAULT '',
      answered BOOLEAN DEFAULT FALSE,
      tags JSONB DEFAULT '[]'::jsonb, -- Array of strings
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);
    CREATE INDEX IF NOT EXISTS idx_questions_answered ON questions(answered);
    CREATE INDEX IF NOT EXISTS idx_questions_tags ON questions USING GIN(tags);
    CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);
  `,

  // Charities table - equivalent to Charity model
  charities: `
    CREATE TABLE IF NOT EXISTS charities (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      goal DECIMAL(10, 2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_charities_title ON charities(title);
  `,

  // Charity Donations table - separate table for donations (was embedded array in MongoDB)
  charity_donations: `
    CREATE TABLE IF NOT EXISTS charity_donations (
      id SERIAL PRIMARY KEY,
      charity_id INTEGER REFERENCES charities(id) ON DELETE CASCADE,
      user_id VARCHAR(255), -- Can store username or user ID
      amount DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_charity_donations_charity_id ON charity_donations(charity_id);
    CREATE INDEX IF NOT EXISTS idx_charity_donations_user_id ON charity_donations(user_id);
  `,

  // Contributions table - equivalent to Contribution model
  contributions: `
    CREATE TABLE IF NOT EXISTS contributions (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255), -- Store as string to match current usage
      payment_type VARCHAR(255),
      charity VARCHAR(255),
      amount DECIMAL(10, 2),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
    CREATE INDEX IF NOT EXISTS idx_contributions_charity ON contributions(charity);
  `,

  // Encouragements table - equivalent to Encourage model
  encouragements: `
    CREATE TABLE IF NOT EXISTS encouragements (
      id SERIAL PRIMARY KEY,
      text TEXT,
      scripture TEXT,
      quote TEXT,
      prayer TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `,

  // Scriptures table - equivalent to Script model
  scriptures: `
    CREATE TABLE IF NOT EXISTS scriptures (
      id SERIAL PRIMARY KEY,
      quote TEXT,
      scripture TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_scriptures_scripture ON scriptures(scripture);
  `
};

/**
 * Create updated_at trigger function
 */
const createUpdatedAtFunction = `
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';
`;

/**
 * Create triggers for updated_at columns
 */
const createTriggers = {
  users: `
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  events: `
    DROP TRIGGER IF EXISTS update_events_updated_at ON events;
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  prayers: `
    DROP TRIGGER IF EXISTS update_prayers_updated_at ON prayers;
    CREATE TRIGGER update_prayers_updated_at
      BEFORE UPDATE ON prayers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  studies: `
    DROP TRIGGER IF EXISTS update_studies_updated_at ON studies;
    CREATE TRIGGER update_studies_updated_at
      BEFORE UPDATE ON studies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  questions: `
    DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
    CREATE TRIGGER update_questions_updated_at
      BEFORE UPDATE ON questions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  charities: `
    DROP TRIGGER IF EXISTS update_charities_updated_at ON charities;
    CREATE TRIGGER update_charities_updated_at
      BEFORE UPDATE ON charities
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  contributions: `
    DROP TRIGGER IF EXISTS update_contributions_updated_at ON contributions;
    CREATE TRIGGER update_contributions_updated_at
      BEFORE UPDATE ON contributions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  encouragements: `
    DROP TRIGGER IF EXISTS update_encouragements_updated_at ON encouragements;
    CREATE TRIGGER update_encouragements_updated_at
      BEFORE UPDATE ON encouragements
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `,
  scriptures: `
    DROP TRIGGER IF EXISTS update_scriptures_updated_at ON scriptures;
    CREATE TRIGGER update_scriptures_updated_at
      BEFORE UPDATE ON scriptures
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `
};

/**
 * Main migration function
 */
async function runMigration() {
  try {
    console.log('🚀 Starting PostgreSQL migration...');

    // Test connection
    await db.testConnection();

    console.log('📝 Creating updated_at function...');
    await db.query(createUpdatedAtFunction);

    console.log('🏗️  Creating tables...');
    for (const [tableName, sql] of Object.entries(createTablesSQL)) {
      console.log(`   Creating ${tableName} table...`);
      await db.query(sql);
    }

    console.log('⚡ Creating triggers...');
    for (const [tableName, sql] of Object.entries(createTriggers)) {
      console.log(`   Creating trigger for ${tableName}...`);
      await db.query(sql);
    }

    console.log('✅ Migration completed successfully!');
    console.log('📊 Database structure:');

    // Show table info
    const tables = await db.query(`
      SELECT table_name,
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    tables.rows.forEach(table => {
      console.log(`   📋 ${table.table_name} (${table.column_count} columns)`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Drop all tables (use with caution!)
 */
async function dropAllTables() {
  try {
    console.log('⚠️  Dropping all tables...');

    const dropSQL = `
      DROP TABLE IF EXISTS charity_donations CASCADE;
      DROP TABLE IF EXISTS contributions CASCADE;
      DROP TABLE IF EXISTS questions CASCADE;
      DROP TABLE IF EXISTS studies CASCADE;
      DROP TABLE IF EXISTS prayers CASCADE;
      DROP TABLE IF EXISTS events CASCADE;
      DROP TABLE IF EXISTS charities CASCADE;
      DROP TABLE IF EXISTS encouragements CASCADE;
      DROP TABLE IF EXISTS scriptures CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    `;

    await db.query(dropSQL);
    console.log('✅ All tables dropped successfully!');

  } catch (error) {
    console.error('❌ Failed to drop tables:', error);
    throw error;
  }
}

// Export functions for use in other files
module.exports = {
  runMigration,
  dropAllTables,
  createTablesSQL,
  createTriggers
};

// If this file is run directly, execute migration
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--drop')) {
    dropAllTables()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    runMigration()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}
