-- migrate:up
CREATE TABLE age_rated
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  rated VARCHAR(50) NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE age_rated;

