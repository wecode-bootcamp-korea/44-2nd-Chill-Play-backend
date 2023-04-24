-- migrate:up
CREATE TABLE users
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kakao_id BIGINT NOT NULL UNIQUE,
  account_email VARCHAR(100),
  profile_image VARCHAR(2000) NOT NULL,
  profile_nickname VARCHAR(50) NOT NULL,
  gender VARCHAR(10),
  birthday VARCHAR(100),
  age_range VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE users;

