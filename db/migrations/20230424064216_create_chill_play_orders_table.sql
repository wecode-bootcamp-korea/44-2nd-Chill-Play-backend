-- migrate:up
CREATE TABLE orders
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    personnel INT NOT NULL,
    order_number VARCHAR(36) DEFAULT(UUID()) ,
    total_amount Decimal(13,3) NOT NULL,
    user_id INT NOT NULL,
    musical_id  INT NOT NULL,
    musical_schedule_id  INT NOT NULL,
    order_status_id  INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_orders_user_id FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT FK_orders_musical_id FOREIGN KEY(musical_id) REFERENCES musicals(id),
    CONSTRAINT FK_orders_musical_schedule_id FOREIGN KEY(musical_schedule_id) REFERENCES musical_schedules(id),
    CONSTRAINT FK_orders_order_status_id FOREIGN KEY(order_status_id) REFERENCES order_status(id)
);

-- migrate:down
DROP TABLE orders;

