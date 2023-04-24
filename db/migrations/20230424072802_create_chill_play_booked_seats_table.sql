-- migrate:up
CREATE TABLE booked_seats
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    seat_row VARCHAR(30) NOT NULL,
    seat_column INT NOT NULL,
    musical_id INT NOT NULL,
    theater_id INT NOT NULL,
    seat_class_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY(musical_id) REFERENCES musicals(id),
    FOREIGN KEY(theater_id) REFERENCES theaters(id),
    FOREIGN KEY(seat_class_id) REFERENCES seat_class(id),
    FOREIGN KEY(order_id) REFERENCES orders(id)
);

-- migrate:down
DROP TABLE booked_seats;
