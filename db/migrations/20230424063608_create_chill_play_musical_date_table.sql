-- migrate:up
CREATE TABLE musical_date
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL
);

-- migrate:down
DROP TABLE musical_date;

