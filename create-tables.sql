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

INSERT INTO level (title, lp_required) VALUES ('Log Leaf', 50);
INSERT INTO level (title, lp_required) VALUES ('Log Lemon', 60);
INSERT INTO level (title, lp_required) VALUES ('Log Lobster', 72);
INSERT INTO level (title, lp_required) VALUES ('Log Lamb', 86);
INSERT INTO level (title, lp_required) VALUES ('Log Lizard', 103);
INSERT INTO level (title, lp_required) VALUES ('Log Leprechaun', 124);
INSERT INTO level (title, lp_required) VALUES ('Log Lover', 149);
INSERT INTO level (title, lp_required) VALUES ('Log Lumberjack', 179);
INSERT INTO level (title, lp_required) VALUES ('Log Llama', 214);
INSERT INTO level (title, lp_required) VALUES ('Log Leopard', 257);
INSERT INTO level (title, lp_required) VALUES ('Log Lion',  309);
INSERT INTO level (title, lp_required) VALUES ('Log Lurker', 371);
INSERT INTO level (title, lp_required) VALUES ('Log Lunatic', 445);
INSERT INTO level (title, lp_required) VALUES ('Log Legionnaire', 534);
INSERT INTO level (title, lp_required) VALUES ('Log Lieutenant', 641);
INSERT INTO level (title, lp_required) VALUES ('Log Linchpin', 770);
INSERT INTO level (title, lp_required) VALUES ('Log Loremaster', 924);
INSERT INTO level (title, lp_required) VALUES ('Log Leader', 1109);
INSERT INTO level (title, lp_required) VALUES ('Log Lord', 1331);
INSERT INTO level (title, lp_required) VALUES ('Log Legend', 1597);

ALTER TABLE users ADD "level" INTEGER DEFAULT 1
CONSTRAINT users_level_fk_level REFERENCES level (id);

ALTER TABLE users ADD "log_points" INTEGER DEFAULT 0;

ALTER TABLE users ADD "username" TEXT UNIQUE;