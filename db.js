const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  database: 'reflection_db'
});

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Reflection Table
 */
const createReflectionTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      reflections(
        id UUID PRIMARY KEY,
        success TEXT NOT NULL,
        low_point TEXT NOT NULL,
        take_away TEXT NOT NULL,
        owner_id UUID NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
      )`;

  pool
    .query(queryText)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

/**
 * Create Backup table
 */
const createBackupTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    backup(
      id UUID PRIMARY KEY,      
      owner_id UUID UNIQUE NOT NULL,
      store JSONB NOT NULL,
      created_date TIMESTAMP,
      modified_date TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;
  pool
    .query(queryText)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
};

const dropTable = tableName => {
  const queryText = `DROP TABLE IF EXISTS ${tableName} CASCADE`;
  pool
    .query(queryText)
    .then(res => {
      console.log(res);
      pool.end();
    })
    .catch(err => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createReflectionTable();
  createBackupTable();
};
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropTable('users');
  dropTable('reflections');
  dropTable('backup');
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createReflectionTable,
  createUserTable,
  createAllTables,
  createBackupTable,
  dropTable,
  dropAllTables
};

require('make-runnable');
