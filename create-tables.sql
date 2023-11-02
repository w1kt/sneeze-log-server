SELECT 'CREATE DATABASE loggable_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'loggable_db')\gexec
\connect loggable_db

CREATE TABLE IF NOT EXISTS
    users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    backup(
      id UUID PRIMARY KEY,      
      owner_id UUID UNIQUE NOT NULL,
      store JSONB NOT NULL,
      created_date TIMESTAMP,
      modified_date TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS
    community(
        id UUID PRIMARY KEY,
        category TEXT NOT NULL,
        count NUMERIC NOT NULL,
        avg_per_day NUMERIC NOT NULL,
        avg_per_day_nominal NUMERIC NOT NULL,
        avg_mode NUMERIC NOT NULL,
        avg_hours_between_logs NUMERIC NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS
    password_recovery(
        email VARCHAR(128) PRIMARY KEY REFERENCES users (email) ON DELETE CASCADE,
        vcode_jwt TEXT NOT NULL
    );
