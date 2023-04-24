-- migrate:up
CREATE TABLE boarding_status
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(200) NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE boarding_status;

