-- migrate:up
CREATE TABLE musicals
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    descriptions VARCHAR(500) NOT NULL,
    post_image_url VARCHAR(2000) NOT NULL,
    released_date DATE NOT NULL,
    end_date DATE NOT NULL,
    running_time INT NOT NULL,
    age_rated_id INT NOT NULL,
    boarding_status_id INT NOT NULL,
    theater_id INT NOT NULL,
    FOREIGN KEY(age_rated_id) REFERENCES age_rated(id),
    FOREIGN KEY(boarding_status_id) REFERENCES boarding_status(id),
    FOREIGN KEY(theater_id) REFERENCES theaters(id)
);


-- migrate:down
DROP TABLE musicals;

