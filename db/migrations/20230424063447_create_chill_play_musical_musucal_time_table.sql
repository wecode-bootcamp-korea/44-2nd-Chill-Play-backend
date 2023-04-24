-- migrate:up
CREATE TABLE musical_time
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    time TIME NOT NULL
);
-- migrate:down
DROP TABLE musical_time;

