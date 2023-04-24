-- migrate:up
CREATE TABLE reviews
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    score INT NOT NULL,
    user_id  INT NOT NULL,
    musical_id INT NOT NULL,
    order_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(musical_id) REFERENCES musicals(id),
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- migrate:down
DROP TABLE reviews;

