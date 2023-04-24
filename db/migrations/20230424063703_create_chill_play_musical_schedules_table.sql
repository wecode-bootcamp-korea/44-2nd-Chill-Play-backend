-- migrate:up
CREATE TABLE musical_schedules
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    musical_id INT NOT NULL,
    theater_id INT NOT NULL,
    musical_time_id INT NOT NULL,
    musical_date_id INT NOT NULL,
    FOREIGN KEY(musical_id) REFERENCES musicals(id),
    FOREIGN KEY(theater_id) REFERENCES theaters(id),
    FOREIGN KEY(musical_time_id) REFERENCES musical_time(id),
    FOREIGN KEY(musical_date_id) REFERENCES musical_date(id)
);

-- migrate:down
DROP TABLE musical_schedules;

