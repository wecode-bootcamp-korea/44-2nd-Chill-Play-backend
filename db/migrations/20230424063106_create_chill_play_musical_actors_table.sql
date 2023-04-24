-- migrate:up
CREATE TABLE musical_actors
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    musical_id INT NOT NULL ,
    actors JSON NOT NULL,
    CONSTRAINT FK_musical_actors_musical_id FOREIGN KEY(musical_id) REFERENCES musicals(id)
);


-- migrate:down
DROP TABLE musical_actors;

