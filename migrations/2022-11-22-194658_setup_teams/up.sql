CREATE TABLE teams (
    id int NOT NULL PRIMARY KEY,
    teamname text,
    leader_id int NOT NULL,
    CONSTRAINT FK_userid FOREIGN KEY (leader_id) REFERENCES users(id)
);