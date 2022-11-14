CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name TINYTEXT,
    email TINYTEXT,
    emailVerified TIMESTAMP,
    image MEDIUMTEXT
);

CREATE TABLE accounts (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    userId TINYTEXT,
    type TINYTEXT,
    provider TINYTEXT,
    providerAccountId TINYTEXT,
    refresh_token TINYTEXT,
    access_token TINYTEXT,
    expires_at INT,
    token_type TINYTEXT,
    scope TINYTEXT,
    id_token TINYTEXT,
    session_state TINYTEXT,
    oauth_token_secret TINYTEXT,
    oauth_token TINYTEXT
);

CREATE TABLE sessions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    expires TIMESTAMP,
    sessionToken TINYTEXT,
    userId TINYTEXT
);