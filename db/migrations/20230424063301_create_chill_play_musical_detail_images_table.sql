-- migrate:up
CREATE TABLE musical_detail_images
(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(2000) NOT NULL ,
    musical_id INT NOT NULL,
   CONSTRAINT FK_musical_detail_images_musical_id FOREIGN KEY(musical_id) REFERENCES musicals(id)
);

-- migrate:down
DROP TABLE musical_detail_images;

