CREATE TABLE invites (
    id int NOT NULL PRIMARY KEY,
    team_id int NOT NULL,
    user_id int NOT NULL,
    CONSTRAINT FK_teamid FOREIGN KEY (team_id) REFERENCES teams(id),
    CONSTRAINT FK_userid FOREIGN KEY (user_id) REFERENCES users(id)
)