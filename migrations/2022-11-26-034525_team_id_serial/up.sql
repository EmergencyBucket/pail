CREATE SEQUENCE teams_id_seq AS int START 1 OWNED BY teams.id;
ALTER TABLE teams ALTER COLUMN id SET DEFAULT nextval('teams_id_seq');