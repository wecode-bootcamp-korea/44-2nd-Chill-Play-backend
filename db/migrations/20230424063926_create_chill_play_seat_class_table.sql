-- migrate:up
CREATE TABLE seat_class
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    price DECIMAL(11,3) NOT NULL
);


-- migrate:down
DROP TABLE seat_class;

