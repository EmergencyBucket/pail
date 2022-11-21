CREATE TABLE teams (
    id INT NOT NULL PRIMARY KEY,
    teamname TINYTEXT,
    leader_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (leader_id) REFERENCES users(id)
);