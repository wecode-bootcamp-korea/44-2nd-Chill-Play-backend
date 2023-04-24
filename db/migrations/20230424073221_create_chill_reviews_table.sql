-- migrate:up
CREATE TABLE reviews
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    score INT NOT NULL,
    user_id  INT NOT NULL,
    musical_id INT NOT NULL,
    order_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_reviews_user_id FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT FK_reviews_musical_id  FOREIGN KEY(musical_id) REFERENCES musicals(id),
    CONSTRAINT FK_reviews_order_id FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- migrate:down
DROP TABLE reviews;

