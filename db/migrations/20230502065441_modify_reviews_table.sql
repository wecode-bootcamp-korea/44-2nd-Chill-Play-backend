-- migrate:up
ALTER TABLE reviews DROP FOREIGN KEY FK_reviews_order_id;
ALTER TABLE reviews DROP order_id;

-- migrate:down

