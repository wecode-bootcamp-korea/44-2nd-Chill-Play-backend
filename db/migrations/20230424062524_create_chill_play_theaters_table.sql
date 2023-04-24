-- migrate:up
CREATE TABLE theaters
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL,
    city_id INT NOT NULL,
    FOREIGN KEY(city_id) REFERENCES cities(id)
);

-- migrate:down
DROP TABLE theaters;

