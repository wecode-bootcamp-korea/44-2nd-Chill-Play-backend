-- migrate:up
CREATE TABLE order_status
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(30) NOT NULL
);

-- migrate:down
DROP TABLE order_status;

