CREATE TABLE teams (
    id int NOT NULL PRIMARY KEY,
    teamname text,
    leader_id int NOT NULL,
    FOREIGN KEY (leader_id) REFERENCES users(id)
);