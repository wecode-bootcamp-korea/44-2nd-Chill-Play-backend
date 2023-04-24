-- migrate:up
CREATE TABLE daily_sales_count
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    sold_seat INT NOT NULL,
    musical_id INT NOT NULL,
    musical_schedule_id INT NOT NULL,
    CONSTRAINT FK_daily_sales_count_musical_id FOREIGN KEY(musical_id) REFERENCES musicals(id),
    CONSTRAINT FK_daily_sales_count_musical_schedule_id  FOREIGN KEY(musical_schedule_id) REFERENCES musical_schedules(id)
);

-- migrate:down
DROP TABLE daily_sales_count;

