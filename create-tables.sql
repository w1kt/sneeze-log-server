SELECT 'CREATE DATABASE reflection_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'reflection_db')\gexec
\connect reflection_db

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

CREATE TABLE IF NOT EXISTS
    level(
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        lp_required INTEGER NOT NULL
    );

INSERT INTO level (title, lp_required) VALUES ('Log Laughingstock', 50);
INSERT INTO level (title, lp_required) VALUES ('Log Leaf', 65);
INSERT INTO level (title, lp_required) VALUES ('Log Lemon', 85);
INSERT INTO level (title, lp_required) VALUES ('Log Lobster', 111);
INSERT INTO level (title, lp_required) VALUES ('Log Lamb', 144);
INSERT INTO level (title, lp_required) VALUES ('Log Lizard', 187);
INSERT INTO level (title, lp_required) VALUES ('Log Leprechaun', 243);
INSERT INTO level (title, lp_required) VALUES ('Log Layman', 316);
INSERT INTO level (title, lp_required) VALUES ('Log Lover', 411);
INSERT INTO level (title, lp_required) VALUES ('Log Lumberjack', 534);
INSERT INTO level (title, lp_required) VALUES ('Log Llama',  694);
INSERT INTO level (title, lp_required) VALUES ('Log Leopard', 902);
INSERT INTO level (title, lp_required) VALUES ('Log Lion', 1173);
INSERT INTO level (title, lp_required) VALUES ('Log Lunatic', 1525);
INSERT INTO level (title, lp_required) VALUES ('Log Legionnaire', 1983);
INSERT INTO level (title, lp_required) VALUES ('Log Lieutenant', 2578);
INSERT INTO level (title, lp_required) VALUES ('Log Leader', 3351);
INSERT INTO level (title, lp_required) VALUES ('Log Linchpin', 4356);
INSERT INTO level (title, lp_required) VALUES ('Log Lord', 5663);
INSERT INTO level (title, lp_required) VALUES ('Log Legend', 7362);

ALTER TABLE users ADD "level" INTEGER DEFAULT 1
CONSTRAINT users_level_fk_level REFERENCES level (id);

ALTER TABLE users ADD "log_points" INTEGER DEFAULT 0;

ALTER TABLE users ADD "username" TEXT UNIQUE;